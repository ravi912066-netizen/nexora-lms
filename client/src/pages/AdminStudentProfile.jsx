import React, { useEffect, useState } from 'react';
import api from '../api';
import { Eye, CheckCircle, Clock, UserCheck, ShieldAlert } from 'lucide-react';

const AdminStudentProfile = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentReport, setStudentReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch all students
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

    // Fetch granular report when a student is selected
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
        e.stopPropagation(); // Don't trigger select student
        if (!window.confirm('Kyu bhai, is student ko approve kar du?')) return;

        try {
            await api.put(`/auth/approve/${studentId}`);
            alert('Student approve ho gaya! Ab wo login kar sakta hai.');
            fetchStudents(); // Refresh list to update badge
            if (selectedStudent === studentId) {
                // Refresh report too
                handleSelectStudent(studentId);
            }
        } catch (error) {
            alert('Approval fail ho gaya: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 animate-fade-in flex flex-col lg:flex-row gap-8">
            {/* Left side: Student List */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col h-[calc(100vh-200px)]">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Cadet Directory</h2>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Manage Admission & Access</p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {students.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-bold italic">
                                No cadets registered yet.
                            </div>
                        ) : (
                            students.map(s => (
                                <div
                                    key={s._id}
                                    onClick={() => handleSelectStudent(s._id)}
                                    className={`w-full text-left p-5 rounded-[2rem] transition-all cursor-pointer group border-2 ${selectedStudent === s._id ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200' : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover:scale-110 ${selectedStudent === s._id ? 'bg-white text-blue-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                                                {s.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className={`font-black text-sm tracking-tight ${selectedStudent === s._id ? 'text-white' : 'text-slate-800'}`}>{s.name}</div>
                                                <div className={`text-[10px] font-black uppercase tracking-widest ${selectedStudent === s._id ? 'text-blue-100' : 'text-slate-400'}`}>
                                                    {s.isApproved ? (
                                                        <span className="flex items-center gap-1 text-emerald-500">
                                                            <UserCheck size={10} /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-amber-500">
                                                            <ShieldAlert size={10} /> Pending Approval
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {!s.isApproved && (
                                            <button
                                                onClick={(e) => handleApprove(s._id, e)}
                                                className={`p-3 rounded-xl transition-all shadow-md group-active:scale-95 ${selectedStudent === s._id ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white'}`}
                                                title="Approve Cadet"
                                            >
                                                <UserCheck size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right side: Detailed Report */}
            <div className="flex-1 min-h-[calc(100vh-200px)] flex flex-col">
                {!selectedStudent ? (
                    <div className="bg-white/50 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center flex-1 text-slate-400 p-12 text-center shadow-inner">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                            <Eye size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-400 tracking-tight mb-2">Intelligence Briefing</h3>
                        <p className="max-w-xs font-bold text-sm uppercase tracking-widest leading-relaxed">Select a cadet from the directory to analyze their performance data</p>
                    </div>
                ) : loading ? (
                    <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 flex-1 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) : studentReport ? (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500">
                        {/* Summary Header */}
                        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <h1 className="text-4xl font-black tracking-tight">{studentReport.user.name}'s Mission Report</h1>
                                        {studentReport.user.isApproved ? (
                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 rounded-full flex items-center gap-1.5">
                                                <UserCheck size={12} /> Access Granted
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30 rounded-full flex items-center gap-1.5">
                                                <ShieldAlert size={12} /> Verification Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-blue-200/60 font-medium max-w-xl text-lg">{studentReport.user.email} • Cadet ID: {studentReport.user._id.slice(-6).toUpperCase()}</p>
                                </div>

                                <div className="flex gap-4">
                                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 min-w-[140px] text-center shadow-inner">
                                        <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Total XP</div>
                                        <div className="text-3xl font-black">{studentReport.performance?.totalXP || 0}</div>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 min-w-[140px] text-center shadow-inner">
                                        <div className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Missions</div>
                                        <div className="text-3xl font-black">{studentReport.performance?.assignmentsCompleted || 0}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]"></div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                            <h2 className="text-2xl font-black text-slate-800 mb-8 px-2 flex items-center gap-3">
                                <FileText className="text-indigo-600" />
                                Operation History
                            </h2>
                            <div className="space-y-4">
                                {studentReport.assignments.map((assign, idx) => (
                                    <div key={idx} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:border-blue-200 hover:shadow-2xl transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm ring-1 ring-slate-200/50 group-hover:scale-110 transition-transform">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{assign.courseId?.title || 'General Training'}</div>
                                                <div className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{assign.title}</div>
                                                <div className="text-xs font-bold text-slate-400">Mission Score Target: {assign.xp} XP</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 md:mt-0 flex items-center gap-4">
                                            {assign.status === 'completed' ? (
                                                <div className="flex items-center gap-3 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-50">
                                                    <CheckCircle size={16} /> PASSED
                                                </div>
                                            ) : assign.viewed ? (
                                                <div className="flex items-center gap-3 px-6 py-2.5 bg-blue-50 text-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-blue-100 shadow-sm shadow-blue-50">
                                                    <Eye size={16} /> INSPECTED
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-200">
                                                    <Clock size={16} /> OFFLINE
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {studentReport.assignments.length === 0 && (
                                    <div className="py-20 text-center text-slate-400 font-bold italic bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                                        No active operation data found for this cadet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center flex-1">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-20 h-20 bg-slate-100 rounded-full mb-4"></div>
                            <div className="w-48 h-4 bg-slate-100 rounded mb-2"></div>
                            <div className="w-32 h-4 bg-slate-100 rounded"></div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}</style>
        </div>
    );
};

export default AdminStudentProfile;
