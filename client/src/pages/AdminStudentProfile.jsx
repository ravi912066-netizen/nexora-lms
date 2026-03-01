import React, { useEffect, useState } from 'react';
import api from '../api';
import {
    Users, CheckCircle, Clock, UserCheck, ShieldAlert,
    Code, MapPin, Mail, Phone, ExternalLink,
    TrendingUp, Award, Zap, FileText, Video, BookOpen,
    Target, Star, Flame, Activity, XCircle, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ActivityTracker from '../components/profile/ActivityTracker';
import CodingStats from '../components/profile/CodingStats';

const AdminStudentProfile = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentReport, setStudentReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const res = await api.get('/auth/students');
            setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students', error);
        }
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleSelectStudent = async (student) => {
        setSelectedStudent(student);
        try {
            setLoading(true);
            const res = await api.get(`/performance/admin/student/${student._id}`);
            setStudentReport(res.data);
        } catch (error) {
            console.error('Error fetching student report', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (studentId, e) => {
        e && e.stopPropagation();
        if (!window.confirm('Approve this student?')) return;
        try {
            await api.put(`/auth/approve/${studentId}`);
            fetchStudents();
            if (selectedStudent?._id === studentId) handleSelectStudent(selectedStudent);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleReject = async (studentId, e) => {
        e && e.stopPropagation();
        if (!window.confirm('Reject/remove this student? This cannot be undone.')) return;
        try {
            await api.put(`/auth/reject/${studentId}`);
            fetchStudents();
            if (selectedStudent?._id === studentId) setSelectedStudent(null);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const handleInitiateCall = async (studentId) => {
        try {
            const res = await api.put(`/auth/call/start/${studentId}`);
            navigate(`/call/${res.data.roomId}/${studentId}`);
        } catch (error) {
            alert('Could not initiate call');
        }
    };

    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    const avatarColors = [
        'from-violet-500 to-purple-600', 'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-600', 'from-orange-500 to-amber-500',
        'from-pink-500 to-rose-600', 'from-indigo-500 to-blue-600',
    ];

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Student Analytics</h1>
                <p className="text-gray-500 mt-1">View detailed performance and activity for each student</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Student List */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <input
                            value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search students..."
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        />
                    </div>
                    <div className="divide-y divide-gray-50 max-h-[70vh] overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Users size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No students found</p>
                            </div>
                        ) : filtered.map((student, idx) => (
                            <div
                                key={student._id}
                                onClick={() => handleSelectStudent(student)}
                                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedStudent?._id === student._id ? 'bg-blue-50 border-r-2 border-blue-600' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden`}>
                                    {student.profilePicture
                                        ? <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                                        : student.name?.charAt(0).toUpperCase()
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">{student.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{student.email}</p>
                                </div>
                                {student.isApproved ? (
                                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <Clock size={14} className="text-amber-400 flex-shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Student Detail */}
                <div className="lg:col-span-2 space-y-5">
                    {!selectedStudent ? (
                        <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center text-gray-400 shadow-sm">
                            <Users size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="font-medium">Select a student to view analytics</p>
                        </div>
                    ) : (
                        <>
                            {/* Student Header */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 overflow-hidden">
                                        {selectedStudent.profilePicture
                                            ? <img src={selectedStudent.profilePicture} alt="" className="w-full h-full object-cover" />
                                            : selectedStudent.name?.charAt(0).toUpperCase()
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                                            {selectedStudent.isApproved ? (
                                                <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">
                                                    <CheckCircle size={12} /> Approved
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Mail size={13} />{selectedStudent.email}</span>
                                            {selectedStudent.phone && <span className="flex items-center gap-1"><Phone size={13} />{selectedStudent.phone}</span>}
                                            {selectedStudent.location && <span className="flex items-center gap-1"><MapPin size={13} />{selectedStudent.location}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {!selectedStudent.isApproved && (
                                            <button onClick={e => handleApprove(selectedStudent._id, e)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
                                                <UserCheck size={14} /> Approve
                                            </button>
                                        )}
                                        <button onClick={() => handleInitiateCall(selectedStudent._id)} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
                                            <Video size={14} /> Call
                                        </button>
                                        <button onClick={e => handleReject(selectedStudent._id, e)} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-xl transition-colors border border-red-100">
                                            <XCircle size={14} /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Stats */}
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
                                </div>
                            ) : studentReport ? (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total XP', value: studentReport.totalXP || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                                            { label: 'Streak', value: `${studentReport.currentStreak || 0}d`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50' },
                                            { label: 'Lectures', value: studentReport.lecturesCompleted?.length || 0, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50' },
                                            { label: 'Assignments', value: studentReport.assignmentsCompleted || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                        ].map(stat => (
                                            <div key={stat.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                                <div className={`w-9 h-9 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                                                    <stat.icon size={18} />
                                                </div>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Activity Tracker */}
                                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Activity size={16} className="text-blue-500" /> Activity Heatmap
                                        </h3>
                                        <ActivityTracker studentId={selectedStudent._id} />
                                    </div>

                                    {/* Coding Platform Stats */}
                                    {(selectedStudent.codeforcesHandle || selectedStudent.leetcodeHandle || selectedStudent.gfgHandle) && (
                                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                            <CodingStats
                                                codeforcesHandle={selectedStudent.codeforcesHandle}
                                                leetcodeHandle={selectedStudent.leetcodeHandle}
                                                gfgHandle={selectedStudent.gfgHandle}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-400 shadow-sm">
                                    <Activity size={32} className="mx-auto mb-3 opacity-30" />
                                    <p>No performance data available yet</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminStudentProfile;
