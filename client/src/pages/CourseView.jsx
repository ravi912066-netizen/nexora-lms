import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { PlayCircle, CheckCircle, FileText, LayoutList, Plus, X, UploadCloud, Link as LinkIcon, Code } from 'lucide-react';

const CourseView = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState('lectures');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    // Enhanced state for submissions
    const [submissionAttachments, setSubmissionAttachments] = useState({}); // { assignmentId: [{type, value, name}] }
    const [fileUploads, setFileUploads] = useState({}); // { assignmentId: [File] }
    const [passedTests, setPassedTests] = useState({}); // { assignmentId: boolean }

    const [activeLiveRoom, setActiveLiveRoom] = useState(null);
    const [scheduledClass, setScheduledClass] = useState(null);
    const [openIframe, setOpenIframe] = useState(null);
    const [openDocIframe, setOpenDocIframe] = useState(null);

    const fileInputRefs = useRef({});

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
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
        fetchCourseDetails();
    }, [id]);

    const addAttachment = (assignmentId, type) => {
        const value = prompt(`Enter ${type === 'link' ? 'URL' : 'Code Content'}:`);
        if (!value) return;

        const name = type === 'link' ? value : 'Code Snippet';
        const newAttachment = { type, value, name };

        setSubmissionAttachments(prev => ({
            ...prev,
            [assignmentId]: [...(prev[assignmentId] || []), newAttachment]
        }));
    };

    const removeAttachment = (assignmentId, index) => {
        setSubmissionAttachments(prev => ({
            ...prev,
            [assignmentId]: prev[assignmentId].filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (assignmentId, e) => {
        const files = Array.from(e.target.files);
        setFileUploads(prev => ({
            ...prev,
            [assignmentId]: [...(prev[assignmentId] || []), ...files]
        }));
    };

    const removeFile = (assignmentId, index) => {
        setFileUploads(prev => ({
            ...prev,
            [assignmentId]: prev[assignmentId].filter((_, i) => i !== index)
        }));
    };

    const submitAssignment = async (assignmentId) => {
        if (!passedTests[assignmentId]) {
            return alert('Bhai, pehle saare test cases pass karle tabhi submit hoga!');
        }

        const attachments = submissionAttachments[assignmentId] || [];
        const files = fileUploads[assignmentId] || [];

        if (attachments.length === 0 && files.length === 0) {
            return alert('Pehle kuch upload ya link toh kar!');
        }

        try {
            setSubmitLoading(true);
            const formData = new FormData();
            formData.append('attachments', JSON.stringify(attachments));
            files.forEach(file => {
                formData.append('files', file);
            });

            await api.post(`/assignments/${assignmentId}/submit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Shabash! Tera kaam submit ho gaya aur XP mil gaya.');
            // Reset state
            setSubmissionAttachments(prev => ({ ...prev, [assignmentId]: [] }));
            setFileUploads(prev => ({ ...prev, [assignmentId]: [] }));
            setPassedTests(prev => ({ ...prev, [assignmentId]: false }));
        } catch (error) {
            alert(error.response?.data?.message || 'Error submitting assignment');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;
    if (!courseData) return <div>Course not found</div>;

    const { course, lectures } = courseData;

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
                <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute -left-20 -top-20 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Main Tabs */}
            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-200/50">
                <div className="flex p-3 bg-slate-50 border-b border-slate-200">
                    <button
                        className={`flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl font-bold transition-all ${activeTab === 'lectures' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
                        onClick={() => setActiveTab('lectures')}
                    >
                        <PlayCircle size={22} className={activeTab === 'lectures' ? 'text-blue-500' : ''} />
                        Lobby & Lectures
                    </button>
                    <button
                        className={`flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl font-bold transition-all ${activeTab === 'assignments' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        <FileText size={22} className={activeTab === 'assignments' ? 'text-blue-500' : ''} />
                        Assignments Arena
                    </button>
                </div>

                <div className="p-10">
                    {activeTab === 'lectures' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {lectures.length === 0 ? (
                                <div className="col-span-full py-20 text-center text-slate-400 font-medium italic">Patience, young padawan! Lectures are being uploaded...</div>
                            ) : (
                                lectures.map((lecture, index) => (
                                    <div key={lecture._id} className="group bg-slate-50 rounded-[2.5rem] p-6 hover:bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl transition-all h-full flex flex-col">
                                        <div className="aspect-[16/10] bg-slate-900 rounded-3xl mb-6 relative overflow-hidden ring-4 ring-slate-200/50 group-hover:ring-blue-100 transition-all">
                                            <img src={`https://source.unsplash.com/random/800x600/?education,tech&sig=${index}`} alt="cover" className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-125 group-hover:bg-blue-600 group-hover:border-blue-400 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-500">
                                                    <PlayCircle className="text-white fill-white/10" size={32} />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-6 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                                {lecture.duration} Mins
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2 px-1">Lecture Module {index + 1}</div>
                                            <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-blue-900 transition-colors leading-tight">{lecture.title}</h3>
                                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">Start your journey into {lecture.title} and master the core concepts through this guided session.</p>
                                        </div>
                                        <a href={lecture.videoUrl} target="_blank" rel="noreferrer" className="mt-8 py-4 w-full bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all text-center">
                                            Watch Premiere
                                        </a>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className="space-y-12">
                            {assignments.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 font-medium italic">No quests available yet. Contact your mentor.</div>
                            ) : (
                                assignments.map(assignment => (
                                    <div key={assignment._id} className="bg-slate-50/50 rounded-[3rem] border border-slate-200/60 p-10 overflow-hidden">
                                        <div className="flex flex-col xl:flex-row gap-12">
                                            {/* Info & Submissions */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-8 mb-8">
                                                    <div className={`w-20 h-20 rounded-[1.75rem] flex items-center justify-center text-white shadow-2xl ${assignment.type === 'quiz' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-emerald-600 shadow-emerald-200'}`}>
                                                        {assignment.type === 'quiz' ? <LayoutList size={32} /> : <Code size={32} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{assignment.title}</h3>
                                                            <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-black tracking-widest shadow-lg shadow-blue-200">
                                                                {assignment.xp} XP
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-600 font-medium text-lg leading-relaxed">{assignment.description}</p>

                                                        {/* Feature Buttons */}
                                                        <div className="flex flex-wrap gap-4 mt-8">
                                                            {assignment.problemUrl && (
                                                                <button
                                                                    onClick={() => setOpenIframe(openIframe === assignment._id ? null : assignment._id)}
                                                                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${openIframe === assignment._id ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-blue-500'}`}
                                                                >
                                                                    {openIframe === assignment._id ? <X size={18} /> : <UploadCloud size={18} />}
                                                                    {openIframe === assignment._id ? 'Close Integrated Environment' : 'Launch Practice Platform'}
                                                                </button>
                                                            )}
                                                            {assignment.documentUrl && (
                                                                <button
                                                                    onClick={() => setOpenDocIframe(openDocIframe === assignment._id ? null : assignment._id)}
                                                                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-3 ${openDocIframe === assignment._id ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-indigo-600 border-2 border-indigo-200 hover:border-indigo-500'}`}
                                                                >
                                                                    <FileText size={18} />
                                                                    {openDocIframe === assignment._id ? 'Hide Document' : 'View Study Material'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Iframes Section */}
                                                <div className="space-y-6">
                                                    {openIframe === assignment._id && assignment.problemUrl && (
                                                        <div className="rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl border-8 border-slate-800 h-[650px] animate-in slide-in-from-top duration-500">
                                                            <div className="bg-slate-800 px-6 py-3 flex items-center justify-between text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                                                    Cloud Integrated Sandbox
                                                                </div>
                                                                <a href={assignment.problemUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Pop Out ↗</a>
                                                            </div>
                                                            <iframe src={assignment.problemUrl} title="sandbox" className="w-full h-full bg-white" />
                                                        </div>
                                                    )}
                                                    {openDocIframe === assignment._id && assignment.documentUrl && (
                                                        <div className="rounded-[2.5rem] bg-indigo-50 overflow-hidden shadow-2xl border-8 border-indigo-100 h-[650px] animate-in slide-in-from-top duration-500">
                                                            <div className="bg-indigo-100 px-6 py-3 flex items-center justify-between text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText size={14} />
                                                                    Curriculum & Notes
                                                                </div>
                                                                <a href={assignment.documentUrl} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition-colors">External Link ↗</a>
                                                            </div>
                                                            <iframe src={assignment.documentUrl} title="document" className="w-full h-full bg-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submission Panel */}
                                            <div className="w-full xl:w-[450px] flex flex-col gap-6">
                                                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex-1 flex flex-col">
                                                    <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                                                        <UploadCloud className="text-blue-600" size={24} />
                                                        Your Submission
                                                    </h4>

                                                    {/* Custom Attachment List */}
                                                    <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                                        {/* Current Attachments */}
                                                        {(submissionAttachments[assignment._id] || []).map((att, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group transition-all hover:bg-white hover:shadow-md">
                                                                <div className="flex items-center gap-3">
                                                                    {att.type === 'link' ? <LinkIcon size={16} className="text-blue-500" /> : <Code size={16} className="text-purple-500" />}
                                                                    <span className="text-xs font-bold text-slate-700 truncate w-40">{att.name}</span>
                                                                </div>
                                                                <button onClick={() => removeAttachment(assignment._id, idx)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
                                                            </div>
                                                        ))}

                                                        {/* Current Files */}
                                                        {(fileUploads[assignment._id] || []).map((file, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-2xl group transition-all hover:bg-white hover:shadow-md">
                                                                <div className="flex items-center gap-3">
                                                                    <FileText size={16} className="text-indigo-500" />
                                                                    <span className="text-xs font-bold text-slate-700 truncate w-40">{file.name}</span>
                                                                </div>
                                                                <button onClick={() => removeFile(assignment._id, idx)} className="text-slate-400 hover:text-red-500"><X size={16} /></button>
                                                            </div>
                                                        ))}

                                                        {(!submissionAttachments[assignment._id]?.length && !fileUploads[assignment._id]?.length) && (
                                                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                                                <div className="p-4 bg-white rounded-full text-slate-300 mb-3"><Plus size={32} /></div>
                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nothing added yet</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons for Adding */}
                                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                                        <button onClick={() => addAttachment(assignment._id, 'link')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all text-blue-600">
                                                            <LinkIcon size={20} />
                                                            <span className="text-[10px] font-black uppercase">Add Link</span>
                                                        </button>
                                                        <button onClick={() => addAttachment(assignment._id, 'code')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 transition-all text-purple-600">
                                                            <Code size={20} />
                                                            <span className="text-[10px] font-black uppercase">Paste Code</span>
                                                        </button>
                                                        <button onClick={() => fileInputRefs.current[assignment._id].click()} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-emerald-600">
                                                            <Plus size={20} />
                                                            <span className="text-[10px] font-black uppercase">Add Files</span>
                                                        </button>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            ref={el => fileInputRefs.current[assignment._id] = el}
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange(assignment._id, e)}
                                                        />
                                                    </div>

                                                    {/* Verification Checkbox */}
                                                    <div className="bg-slate-900 rounded-[1.75rem] p-5 mb-6 group cursor-pointer transition-all hover:bg-slate-800" onClick={() => setPassedTests(prev => ({ ...prev, [assignment._id]: !prev[assignment._id] }))}>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${passedTests[assignment._id] ? 'bg-emerald-500 scale-110 rotate-3' : 'bg-slate-700'}`}>
                                                                {passedTests[assignment._id] && <CheckCircle className="text-white" size={20} />}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-white font-black text-[10px] uppercase tracking-widest leading-none mb-1">Testing Status</span>
                                                                <span className="text-slate-400 font-bold text-xs">All Test Cases Passed Successfully</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button
                                                        onClick={() => submitAssignment(assignment._id)}
                                                        disabled={submitLoading || !passedTests[assignment._id] || ((submissionAttachments[assignment._id]?.length || 0) === 0 && (fileUploads[assignment._id]?.length || 0) === 0)}
                                                        className="w-full py-5 bg-blue-600 text-white font-black rounded-[1.75rem] shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] hover:bg-blue-700 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none uppercase tracking-[0.2em] text-lg"
                                                    >
                                                        {submitLoading ? 'Transmitting...' : 'Commit Submission'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Scrollbar CSS */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}</style>
        </div>
    );
};

export default CourseView;
