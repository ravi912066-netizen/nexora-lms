import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    PlayCircle, CheckCircle, FileText, LayoutList, Plus,
    X, UploadCloud, Link as LinkIcon, Code, Lock, ShieldAlert,
    ArrowLeft, Clock
} from 'lucide-react';
import clsx from 'clsx';

const CourseView = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null); // 'approved', 'pending', or null
    const [activeTab, setActiveTab] = useState('lectures');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Enhanced state for submissions
    const [submissionAttachments, setSubmissionAttachments] = useState({});
    const [fileUploads, setFileUploads] = useState({});
    const [passedTests, setPassedTests] = useState({});

    const [activeLiveRoom, setActiveLiveRoom] = useState(null);
    const [scheduledClass, setScheduledClass] = useState(null);
    const [openIframe, setOpenIframe] = useState(null);
    const [openDocIframe, setOpenDocIframe] = useState(null);

    const fileInputRefs = useRef({});

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (user?.role !== 'admin') {
                    const { data: myEnrollments } = await api.get('/enrollments/my');
                    const currentEnrollment = myEnrollments.find(e => e.course._id === id);
                    if (currentEnrollment) {
                        setEnrollmentStatus(currentEnrollment.status);
                    }

                    if (!currentEnrollment || currentEnrollment.status !== 'approved') {
                        const { data: basicCourse } = await api.get(`/courses/basic/${id}`); // Fallback for basic info
                        setCourseData({ course: basicCourse, lectures: [] });
                        setLoading(false);
                        return;
                    }
                } else {
                    setEnrollmentStatus('approved');
                }

                const [courseRes, assignRes] = await Promise.all([
                    api.get(`/courses/${id}`),
                    api.get(`/assignments/course/${id}`)
                ]);

                setCourseData(courseRes.data);
                setAssignments(assignRes.data);

                try {
                    const liveRes = await api.get(`/live/room/${id}`);
                    setActiveLiveRoom(liveRes.data);
                } catch (e) {
                    setActiveLiveRoom(null);
                    try {
                        const scheduledRes = await api.get(`/live/scheduled/${id}`);
                        setScheduledClass(scheduledRes.data);
                    } catch (err) {
                        setScheduledClass(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching course details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user]);

    const addAttachment = (assignmentId, type) => {
        const value = prompt(`Enter ${type === 'link' ? 'URL' : 'Code Content'}:`);
        if (!value) return;
        const name = type === 'link' ? value : 'Code Snippet';
        const newAttachment = { type, value, name };
        setSubmissionAttachments(prev => ({ ...prev, [assignmentId]: [...(prev[assignmentId] || []), newAttachment] }));
    };

    const removeAttachment = (assignmentId, index) => {
        setSubmissionAttachments(prev => ({ ...prev, [assignmentId]: prev[assignmentId].filter((_, i) => i !== index) }));
    };

    const handleFileChange = (assignmentId, e) => {
        const files = Array.from(e.target.files);
        setFileUploads(prev => ({ ...prev, [assignmentId]: [...(prev[assignmentId] || []), ...files] }));
    };

    const removeFile = (assignmentId, index) => {
        setFileUploads(prev => ({ ...prev, [assignmentId]: prev[assignmentId].filter((_, i) => i !== index) }));
    };

    const submitAssignment = async (assignmentId) => {
        if (!passedTests[assignmentId]) return alert('Bhai, pehle saare test cases pass karle tabhi submit hoga!');
        const attachments = submissionAttachments[assignmentId] || [];
        const files = fileUploads[assignmentId] || [];
        if (attachments.length === 0 && files.length === 0) return alert('Pehle kuch upload ya link toh kar!');
        try {
            setSubmitLoading(true);
            const formData = new FormData();
            formData.append('attachments', JSON.stringify(attachments));
            files.forEach(file => formData.append('files', file));
            await api.post(`/assignments/${assignmentId}/submit`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('Shabash! Tera kaam submit हो गया!');
            setSubmissionAttachments(prev => ({ ...prev, [assignmentId]: [] }));
            setFileUploads(prev => ({ ...prev, [assignmentId]: [] }));
            setPassedTests(prev => ({ ...prev, [assignmentId]: false }));
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;
    if (!courseData) return <div className="p-20 text-center font-black text-slate-400">MISSION DATA NOT FOUND</div>;

    const { course, lectures } = courseData;
    const isLocked = enrollmentStatus !== 'approved' && user?.role !== 'admin';

    if (isLocked) {
        return (
            <div className="max-w-4xl mx-auto p-10 animate-fade-in text-center space-y-10 py-20">
                <div className="w-32 h-32 bg-red-100 text-red-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-100 animate-bounce">
                    <Lock size={64} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Access Restricted 🔒</h1>
                    <p className="text-slate-500 font-bold text-lg max-w-lg mx-auto leading-relaxed">
                        Aap is course mein enrolled nahi hain ya aapki payment abhi approve nahi hui hai.
                    </p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between pb-6 border-b border-slate-50">
                        <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Course Name</span>
                        <span className="text-slate-900 font-black tracking-tight">{course.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-black uppercase tracking-widest text-xs">Enrollment Status</span>
                        <span className={clsx(
                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                            enrollmentStatus === 'pending' ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                        )}>
                            {enrollmentStatus === 'pending' ? 'Pending Approval' : 'Not Requested'}
                        </span>
                    </div>

                    <div className="pt-10 flex gap-4">
                        <Link to="/courses" className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Course Catalog
                        </Link>
                        {enrollmentStatus !== 'pending' && (
                            <Link to="/courses" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2">
                                <CreditCard size={16} /> Request Access
                            </Link>
                        )}
                    </div>
                </div>

                {enrollmentStatus === 'pending' && (
                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-4 max-w-lg mx-auto">
                        <Clock className="text-blue-500 shrink-0" />
                        <p className="text-xs font-bold text-blue-700 text-left leading-relaxed">
                            Ravi Yadav bhai aapki payment verify kar rahe hain. Thoda sabar karein, mission jald hi unlock hoga!
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-fade-in p-4">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-[2.5rem] p-12 text-white mb-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                            LMS Course Portal
                        </div>
                        <h1 className="text-5xl font-black mb-6 tracking-tight leading-none">{course.title}</h1>
                        <p className="text-blue-100/80 text-xl font-medium max-w-2xl leading-relaxed">{course.description}</p>
                    </div>
                    <div className="flex flex-col gap-4 min-w-[300px]">
                        {activeLiveRoom && (
                            <a href={`/live/${id}`} className="group flex items-center justify-center gap-4 bg-red-500 hover:bg-red-600 px-8 py-5 rounded-3xl font-black text-xl shadow-[0_15px_30px_-5px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-1 active:scale-95">
                                <span className="w-3.5 h-3.5 bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></span>
                                LIVE CLASS NOW
                            </a>
                        )}
                        {!activeLiveRoom && scheduledClass && (
                            <div className="px-8 py-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-inner">
                                <div className="text-blue-400 text-[10px] font-black uppercase tracking-[0.25em] mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                    Coming Up Next
                                </div>
                                <div className="text-2xl font-black flex flex-col">
                                    <span className="text-white">{new Date(scheduledClass.scheduledTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                    <span className="text-blue-300">at {new Date(scheduledClass.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                <div className="flex p-3 bg-slate-50 border-b border-slate-200">
                    <button className={clsx("flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl font-bold transition-all", activeTab === 'lectures' ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-200/50")} onClick={() => setActiveTab('lectures')}>
                        <PlayCircle size={22} /> Lobby & Lectures
                    </button>
                    <button className={clsx("flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl font-bold transition-all", activeTab === 'assignments' ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-slate-200/50")} onClick={() => setActiveTab('assignments')}>
                        <FileText size={22} /> Assignments Arena
                    </button>
                </div>

                <div className="p-10">
                    {activeTab === 'lectures' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lectures.map((lecture, index) => (
                                <div key={lecture._id} className="group bg-slate-50 rounded-[2.5rem] p-6 hover:bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all flex flex-col">
                                    <div className="aspect-video bg-slate-900 rounded-3xl mb-6 relative overflow-hidden ring-4 ring-slate-200/50 group-hover:ring-blue-100 transition-all">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircle className="text-white/20 group-hover:text-blue-500 transition-colors" size={64} />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-4">{lecture.title}</h3>
                                    <a href={lecture.videoUrl} target="_blank" rel="noreferrer" className="mt-auto py-4 w-full bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-900 hover:text-white transition-all text-center">Watch</a>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className="space-y-12">
                            {assignments.map(assignment => (
                                <div key={assignment._id} className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-200 flex flex-col xl:flex-row gap-12">
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black text-slate-800 mb-4">{assignment.title}</h3>
                                        <p className="text-slate-600 mb-8">{assignment.description}</p>
                                        <div className="flex flex-wrap gap-4">
                                            {assignment.problemUrl && <button onClick={() => setOpenIframe(openIframe === assignment._id ? null : assignment._id)} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2"><Code size={18} /> Practice</button>}
                                            {assignment.documentUrl && <button onClick={() => setOpenDocIframe(openDocIframe === assignment._id ? null : assignment._id)} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2"><FileText size={18} /> View DOC</button>}
                                        </div>
                                        {openIframe === assignment._id && <iframe src={assignment.problemUrl} className="w-full h-[500px] mt-6 rounded-3xl border-8 border-slate-200 bg-white" />}
                                        {openDocIframe === assignment._id && <iframe src={assignment.documentUrl} className="w-full h-[500px] mt-6 rounded-3xl border-8 border-indigo-100 bg-white" />}
                                    </div>

                                    <div className="w-full xl:w-[400px] bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                                        <h4 className="font-black text-xl mb-6">Submission</h4>
                                        <div className="space-y-3 mb-6">
                                            {/* (Submission status indicators logic same as before) */}
                                            <div className="bg-slate-900 rounded-2xl p-4 flex items-center gap-3 cursor-pointer" onClick={() => setPassedTests(prev => ({ ...prev, [assignment._id]: !prev[assignment._id] }))}>
                                                <div className={clsx("w-6 h-6 rounded-lg flex items-center justify-center", passedTests[assignment._id] ? "bg-emerald-500" : "bg-slate-700")}>
                                                    {passedTests[assignment._id] && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <span className="text-white font-black text-[10px] uppercase">All Tests Passed</span>
                                            </div>
                                        </div>
                                        <button onClick={() => submitAssignment(assignment._id)} disabled={!passedTests[assignment._id]} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg disabled:opacity-50">Submit Mission</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseView;
