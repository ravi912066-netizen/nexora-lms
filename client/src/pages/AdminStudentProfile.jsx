import React, { useEffect, useState } from 'react';
import api from '../api';
import {
    Eye, CheckCircle, Clock, UserCheck, ShieldAlert,
    Code, MapPin, Mail, Phone, ExternalLink, AlertCircle,
    TrendingUp, Award, Zap, FileText, Video
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import ActivityTracker from '../components/profile/ActivityTracker';

const AdminStudentProfile = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentReport, setStudentReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const res = await api.get('/auth/students');
            setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students', error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSelectStudent = async (studentId) => {
        setSelectedStudent(studentId);
        try {
            setLoading(true);
            const res = await api.get(`/performance/admin/student/${studentId}`);
            setStudentReport(res.data);
        } catch (error) {
            console.error('Error fetching student report', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (studentId, e) => {
        e.stopPropagation();
        if (!window.confirm('Approve this cadet for mission access?')) return;
        try {
            await api.put(`/auth/approve/${studentId}`);
            fetchStudents();
            if (selectedStudent === studentId) handleSelectStudent(studentId);
        } catch (error) {
            alert('Approval fail: ' + error.message);
        }
    };

    const handleInitiateCall = async (studentId) => {
        try {
            const res = await api.put(`/auth/call/start/${studentId}`);
            navigate(`/call/${res.data.roomId}/${studentId}`);
        } catch (error) {
            console.error('Failed to initiate call:', error);
            alert('Failed to initiate call');
        }
    };

    const HandleBadge = ({ platform, handle, verified }) => (
        <div className="bg-slate-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 flex-1 min-w-[160px] group transition-all hover:bg-slate-900">
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest flex items-center gap-2">
                    {platform} Handle
                </p>
                {verified ? <CheckCircle size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-amber-400" />}
            </div>
            <p className="font-black text-white text-lg tracking-tight truncate">{handle || 'N/A'}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 animate-fade-in flex flex-col lg:flex-row gap-8">
            {/* Cadet Directory */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-[calc(100vh-200px)]">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Cadet Directory</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Select to Inspect Intel</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {students.map(s => (
                            <div
                                key={s._id}
                                onClick={() => handleSelectStudent(s._id)}
                                className={clsx(
                                    "w-full text-left p-5 rounded-[2rem] transition-all cursor-pointer group border-2",
                                    selectedStudent === s._id ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-200" : "bg-white border-slate-50 hover:border-blue-200"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg", selectedStudent === s._id ? "bg-white text-blue-600" : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white")}>
                                            {s.profilePicture ? <img src={s.profilePicture} className="w-full h-full object-cover rounded-2xl" /> : s.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className={clsx("font-black text-sm tracking-tight", selectedStudent === s._id ? "text-white" : "text-slate-800")}>{s.name}</div>
                                            <div className={clsx("text-[10px] font-black uppercase tracking-widest", selectedStudent === s._id ? "text-blue-100" : "text-slate-400")}>
                                                {s.isApproved ? "Verified Agent" : "Admission Pending"}
                                            </div>
                                        </div>
                                    </div>
                                    {!s.isApproved && (
                                        <button onClick={(e) => handleApprove(s._id, e)} className="p-3 bg-amber-100 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all"><UserCheck size={18} /></button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile Intelligence */}
            <div className="flex-1 min-h-[calc(100vh-200px)] flex flex-col">
                {!selectedStudent ? (
                    <div className="bg-white/50 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center flex-1 text-slate-400 p-12 text-center shadow-inner">
                        <Eye size={64} className="mb-6 opacity-20" />
                        <h3 className="text-2xl font-black tracking-tight">Intelligence Briefing</h3>
                        <p className="max-w-xs font-bold text-xs uppercase tracking-widest mt-2">Select a cadet to analyze their coding trajectory</p>
                    </div>
                ) : loading ? (
                    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 flex-1 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : studentReport ? (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
                        {/* Header Profile Section */}
                        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-center">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-white/10 p-1 border border-white/20 shadow-2xl shrink-0 overflow-hidden">
                                    {studentReport.user.profilePicture ? (
                                        <img src={studentReport.user.profilePicture} className="w-full h-full object-cover rounded-[2.2rem]" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl font-black">{studentReport.user.name.charAt(0)}</div>
                                    )}
                                </div>

                                <div className="flex-1 text-center lg:text-left space-y-4">
                                    <div className="space-y-1">
                                        <h1 className="text-4xl font-black tracking-tight">{studentReport.user.name}</h1>
                                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center text-blue-200/60 font-bold text-sm">
                                            <span className="flex items-center gap-1.5"><Mail size={14} /> {studentReport.user.email}</span>
                                            {studentReport.user.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {studentReport.user.phone}</span>}
                                            {studentReport.user.location && <span className="flex items-center gap-1.5"><MapPin size={14} /> {studentReport.user.location}</span>}
                                        </div>
                                        <div className="pt-2 flex justify-center lg:justify-start">
                                            <button
                                                onClick={() => handleInitiateCall(studentReport.user._id)}
                                                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg border-2 border-emerald-400/50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
                                                <Video size={18} /> Initiate Secure Comms
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                        <HandleBadge platform="CF" handle={studentReport.user.codeforcesHandle} verified={studentReport.user.isVerifiedCF} />
                                        <HandleBadge platform="LC" handle={studentReport.user.leetcodeHandle} verified={studentReport.user.isVerifiedLC} />
                                        <HandleBadge platform="GFG" handle={studentReport.user.gfgHandle} verified={studentReport.user.isVerifiedGFG} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]"></div>
                        </div>

                        {/* Performance Stats Overlay */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Efficiency Streak', value: `${studentReport.performance?.accuracy || 95}%`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                                { label: 'Missions Cleared', value: studentReport.performance?.assignmentsCompleted || 0, icon: Award, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Accumulated XP', value: studentReport.performance?.totalXP || 0, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                            ].map(stat => (
                                <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 flex items-center gap-6">
                                    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Real Activity Tracker for Admin Context */}
                        <div className="bg-white p-2 rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden">
                            <ActivityTracker studentId={selectedStudent} />
                        </div>

                        {/* Mission Logs */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                <FileText className="text-indigo-600" /> Mission Accuracy Logs
                            </h2>
                            <div className="space-y-4">
                                {studentReport.assignments.map((assign, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400"><FileText size={20} /></div>
                                            <div>
                                                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">{assign.courseId?.title}</p>
                                                <p className="text-lg font-black text-slate-800 tracking-tight">{assign.title}</p>
                                            </div>
                                        </div>
                                        <div className={clsx(
                                            "px-6 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border mt-4 md:mt-0",
                                            assign.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                        )}>
                                            {assign.status === 'completed' ? 'Cleared ✅' : 'In Progress ⏳'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminStudentProfile;
