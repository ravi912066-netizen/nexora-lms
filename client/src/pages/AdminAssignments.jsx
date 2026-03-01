import React, { useEffect, useState } from 'react';
import api from '../api';
import { CheckCircle, ExternalLink } from 'lucide-react';

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

    // Modal state for viewing code
    const [viewingCode, setViewingCode] = useState(null);

    const fetchData = async () => {
        try {



            const [coursesRes, subsRes] = await Promise.all([
                api.get('/courses'),
                api.get('/assignments/submissions')
            ]);

            setCourses(coursesRes.data);
            if (coursesRes.data.length > 0) setCourseId(coursesRes.data[0]._id);
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
        } catch (error) {
            alert('Error creating assignment');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Tasks & Submissions</h1>

            {/* Create Assignment Form */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h2 className="text-xl font-bold mb-4">Create New Coding Task</h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Course</label>
                        <select className="w-full px-4 py-2 border rounded-xl" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Task Title</label>
                        <input required className="w-full px-4 py-2 border rounded-xl" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea required className="w-full px-4 py-2 border rounded-xl" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Problem URL (e.g. Newton Link)</label>
                        <input className="w-full px-4 py-2 border rounded-xl" type="url" placeholder="https://..." value={problemUrl} onChange={(e) => setProblemUrl(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Document/Calendar Attachments (URL)</label>
                        <input className="w-full px-4 py-2 border rounded-xl" type="url" placeholder="https://docs.google.com/..." value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">XP Reward</label>
                        <input type="number" className="w-full px-4 py-2 border rounded-xl" value={xp} onChange={(e) => setXp(e.target.value)} />
                    </div>
                    <div className="md:col-span-2 mt-2">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 w-full md:w-auto">
                            Add Task to Course
                        </button>
                    </div>
                </form>
            </div>

            {/* Submissions View */}
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Student Responses</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                            <th className="py-4 px-6 font-medium">Student Name</th>
                            <th className="py-4 px-6 font-medium">Course: Task</th>
                            <th className="py-4 px-6 font-medium">Status</th>
                            <th className="py-4 px-6 font-medium">Submitted Work</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {submissions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-slate-800">
                                    {sub.studentId?.name || 'Unknown'}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-slate-800 font-medium">{sub.assignmentId?.courseId?.title}</div>
                                    <div className="text-slate-500 text-sm">{sub.assignmentId?.title}</div>
                                </td>
                                <td className="py-4 px-6">
                                    {sub.status === 'completed' ? (
                                        <span className="inline-flex items-center text-emerald-600 font-medium">
                                            <CheckCircle className="mr-1" size={18} /> Passed
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">Pending</span>
                                    )}
                                </td>
                                <td className="py-4 px-6">
                                    {sub.url ? (
                                        <div className="flex flex-col gap-2">
                                            <a href={sub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                                                <ExternalLink size={16} className="mr-2" /> View Link
                                            </a>
                                            {sub.code && (
                                                <button onClick={() => setViewingCode(sub.code)} className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm">
                                                    Read Code
                                                </button>
                                            )}
                                        </div>
                                    ) : sub.code ? (
                                        <button onClick={() => setViewingCode(sub.code)} className="inline-flex items-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium text-sm">
                                            Read Code
                                        </button>
                                    ) : (
                                        <span className="text-slate-400">No Submission</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {submissions.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-8 text-slate-500">No submissions yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Code Modal */}
            {viewingCode !== null && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 bg-slate-900 text-white">
                            <h3 className="font-bold">Student Code Submission</h3>
                            <button onClick={() => setViewingCode(null)} className="text-slate-400 hover:text-white">Close</button>
                        </div>
                        <div className="flex-1 p-4 bg-slate-50 overflow-y-auto">
                            <pre className="font-mono text-sm text-slate-800 whitespace-pre-wrap">{viewingCode}</pre>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAssignments;
