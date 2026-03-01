import React, { useEffect, useState } from 'react';
import api from '../api';
import { CheckCircle, ExternalLink, FileText, Link as LinkIcon, Code, Download, Eye, X } from 'lucide-react';

const AdminAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [submissions, setSubmissions] = useState([]);

    // Form fields
    const [courseId, setCourseId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [problemUrl, setProblemUrl] = useState('');
    const [documentUrl, setDocumentUrl] = useState('');
    const [xp, setXp] = useState(100);

    // Modal state
    const [viewingAttachment, setViewingAttachment] = useState(null); // { type, value, name }

    const fetchData = async () => {
        try {
            const [coursesRes, subsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/assignments/submissions')
            ]);

            setCourses(coursesRes.data);
            if (coursesRes.data.length > 0 && !courseId) setCourseId(coursesRes.data[0]._id);
            setSubmissions(subsRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments', {
                courseId, title, description, problemUrl, documentUrl, xp
            });
            alert('Assignment created successfully!');
            setTitle('');
            setDescription('');
            setProblemUrl('');
            setDocumentUrl('');
            fetchData();
        } catch (error) {
            alert('Error creating assignment');
        }
    };

    const getBackendUrl = (path) => {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        return `${baseUrl}${path}`;
    };

    return (
        <div className="max-w-7xl mx-auto p-8 animate-fade-in bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assignment Control Center</h1>
                    <p className="text-slate-500 font-medium">Design tasks and track student submissions in real-time.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Total Submissions</span>
                        <span className="text-2xl font-black text-blue-600">{submissions.length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Create Assignment Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 sticky top-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <PlusCircle className="text-blue-600" />
                            New Coding Task
                        </h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Target Course</label>
                                <select className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none appearance-none" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Mission Title</label>
                                <input required className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" placeholder="e.g. Newton's Apple Mystery" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Instruction Brief</label>
                                <textarea required className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none h-32 resize-none" placeholder="What should the student achieve?" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Newton/Sandbox URL</label>
                                <input className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" type="url" placeholder="https://newtonschool.co/..." value={problemUrl} onChange={(e) => setProblemUrl(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Supporting Docs (URL)</label>
                                <input className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" type="url" placeholder="Google Drive/PDF Link" value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Reward (XP)</label>
                                <input type="number" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" value={xp} onChange={(e) => setXp(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all transform active:scale-95 uppercase tracking-widest mt-4">
                                Deploy Task
                            </button>
                        </form>
                    </div>
                </div>

                {/* Submissions View */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <CheckCircle className="text-emerald-500" />
                                Student Responses
                            </h2>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <th className="py-6 px-10">Cadet Info</th>
                                        <th className="py-6 px-10">Task Mission</th>
                                        <th className="py-6 px-10">Artifacts</th>
                                        <th className="py-6 px-10">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {submissions.map((sub) => (
                                        <tr key={sub._id} className="group hover:bg-slate-50/80 transition-all">
                                            <td className="py-6 px-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                                                        {sub.studentId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800">{sub.studentId?.name || 'Unknown User'}</div>
                                                        <div className="text-xs font-bold text-slate-400">{sub.studentId?.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-10">
                                                <div className="font-black text-blue-600 text-xs mb-1 uppercase tracking-widest">{sub.assignmentId?.courseId?.title}</div>
                                                <div className="text-slate-800 font-bold">{sub.assignmentId?.title}</div>
                                            </td>
                                            <td className="py-6 px-10">
                                                <div className="flex flex-wrap gap-2">
                                                    {(sub.attachments?.length > 0 || sub.code || sub.url) ? (
                                                        <>
                                                            {/* Old format support */}
                                                            {sub.url && (
                                                                <a href={sub.url} target="_blank" rel="noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all border border-blue-100 flex items-center gap-2 text-[10px] font-black uppercase">
                                                                    <LinkIcon size={14} /> URL
                                                                </a>
                                                            )}
                                                            {sub.code && (
                                                                <button onClick={() => setViewingAttachment({ type: 'code', value: sub.code, name: 'Submission Buffer' })} className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all border border-purple-100 flex items-center gap-2 text-[10px] font-black uppercase">
                                                                    <Code size={14} /> Code
                                                                </button>
                                                            )}
                                                            {/* New Multi-Modal format */}
                                                            {sub.attachments?.map((att, idx) => (
                                                                <div key={idx} className="flex gap-2">
                                                                    {att.type === 'file' ? (
                                                                        <a href={getBackendUrl(att.value)} target="_blank" rel="noreferrer" className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100 flex items-center gap-2 text-[10px] font-black uppercase">
                                                                            <Download size={14} /> File
                                                                        </a>
                                                                    ) : (
                                                                        <button onClick={() => setViewingAttachment(att)} className={`p-2 rounded-xl transition-all border flex items-center gap-2 text-[10px] font-black uppercase ${att.type === 'link' ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'}`}>
                                                                            {att.type === 'link' ? <LinkIcon size={14} /> : <Code size={14} />}
                                                                            {att.type === 'link' ? 'Link' : 'Snippet'}
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ghosted</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6 px-10">
                                                <div className="text-xs font-black text-slate-400 mb-1">{new Date(sub.submittedAt).toLocaleDateString()}</div>
                                                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            </td>
                                        </tr>
                                    ))}
                                    {submissions.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-20 text-slate-400 font-bold italic">Waiting for incoming responses...</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Attachment Preview Modal */}
            {viewingAttachment && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-8 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/20">
                        <div className="flex items-center justify-between p-8 bg-slate-900 text-white">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${viewingAttachment.type === 'link' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                    {viewingAttachment.type === 'link' ? <LinkIcon size={24} /> : <Code size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black">{viewingAttachment.name}</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{viewingAttachment.type} Artifact</p>
                                </div>
                            </div>
                            <button onClick={() => setViewingAttachment(null)} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 p-10 bg-slate-50 overflow-y-auto">
                            {viewingAttachment.type === 'link' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 font-black text-4xl">
                                        🔗
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-800 mb-4">External Resource Link</h4>
                                    <p className="text-slate-500 font-medium mb-8 max-w-md">This artifact is hosted on an external platform. Click below to inspect it in a new window.</p>
                                    <a href={viewingAttachment.value} target="_blank" rel="noreferrer" className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center gap-3">
                                        Open External Platform
                                        <ExternalLink size={20} />
                                    </a>
                                </div>
                            ) : (
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25"></div>
                                    <pre className="relative bg-white font-mono text-sm text-slate-800 p-8 rounded-2xl border border-slate-200 whitespace-pre-wrap leading-relaxed shadow-sm">
                                        {viewingAttachment.value}
                                    </pre>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-slate-100 border-t border-slate-200 flex justify-end">
                            <button onClick={() => setViewingAttachment(null)} className="px-8 py-3 bg-slate-800 text-white font-black rounded-xl hover:bg-black transition-all">
                                Close Terminal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Icon component used inside
const PlusCircle = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

export default AdminAssignments;
