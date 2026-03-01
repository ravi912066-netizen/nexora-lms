import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, CheckCircle, Clock } from 'lucide-react';

const AdminStudentProfile = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentReport, setStudentReport] = useState(null);

    // Fetch all students
    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5001/api/auth/students', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(res.data);
        };
        fetchStudents();
    }, []);

    // Fetch granular report when a student is selected
    const handleSelectStudent = async (studentId) => {
        setSelectedStudent(studentId);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5001/api/performance/admin/student/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudentReport(res.data);
        } catch (error) {
            console.error('Error fetching student report', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fade-in flex gap-6">
            {/* Left side: Student List */}
            <div className="w-1/3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-4">Students Directory</h2>
                <div className="space-y-2">
                    {students.map(s => (
                        <button
                            key={s._id}
                            onClick={() => handleSelectStudent(s._id)}
                            className={`w-full text-left p-3 rounded-xl transition-colors ${selectedStudent === s._id ? 'bg-blue-50 border border-blue-200 text-blue-800' : 'hover:bg-slate-50 border border-transparent'}`}
                        >
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-xs text-slate-500">{s.email}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right side: Detailed Report */}
            <div className="col-span-2 flex-1">
                {!studentReport ? (
                    <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center h-full text-slate-400">
                        Select a student to view their detailed activity report
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 p-8 rounded-2xl text-white">
                            <h1 className="text-3xl font-bold mb-2">{studentReport.user.name}'s Report</h1>
                            <div className="flex gap-6 mt-4">
                                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    <div className="text-xs text-blue-200">Total XP</div>
                                    <div className="text-xl font-bold">{studentReport.performance?.totalXP || 0}</div>
                                </div>
                                <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                                    <div className="text-xs text-blue-200">Tasks Completed</div>
                                    <div className="text-xl font-bold">{studentReport.performance?.assignmentsCompleted || 0}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold mb-4">Assignment Activity</h2>
                            <div className="space-y-4">
                                {studentReport.assignments.map(assign => (
                                    <div key={assign._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                                        <div>
                                            <div className="font-semibold">{assign.title}</div>
                                            <div className="text-sm text-slate-500">{assign.courseId?.title}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {assign.status === 'completed' ? (
                                                <span className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
                                                    <CheckCircle size={16} className="mr-1" /> Passed
                                                </span>
                                            ) : assign.viewed ? (
                                                <span className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
                                                    <Eye size={16} className="mr-1" /> Viewed (Pending)
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-sm font-medium">
                                                    <Clock size={16} className="mr-1" /> Unopened
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStudentProfile;
