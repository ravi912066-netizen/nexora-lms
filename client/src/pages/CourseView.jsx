import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, CheckCircle, FileText, LayoutList } from 'lucide-react';

const CourseView = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState('lectures');
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [urls, setUrls] = useState({});
    const [codes, setCodes] = useState({});
    const [activeLiveRoom, setActiveLiveRoom] = useState(null);
    const [scheduledClass, setScheduledClass] = useState(null);
    const [openIframe, setOpenIframe] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [courseRes, assignRes] = await Promise.all([
                    axios.get(`http://localhost:5001/api/courses/${id}`, config),
                    axios.get(`http://localhost:5001/api/assignments/course/${id}`, config)
                ]);

                setCourseData(courseRes.data);
                setAssignments(assignRes.data);

                // Check for live class
                try {
                    const liveRes = await axios.get(`http://localhost:5001/api/live/room/${id}`, config);
                    setActiveLiveRoom(liveRes.data);
                } catch (e) {
                    setActiveLiveRoom(null);
                    // If no live room, check for scheduled room
                    try {
                        const scheduledRes = await axios.get(`http://localhost:5001/api/live/scheduled/${id}`, config);
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

    const submitAssignment = async (assignmentId) => {
        if (!urls[assignmentId] && !codes[assignmentId]) return alert('Please paste your Newton URL or Source Code first');
        try {
            setSubmitLoading(true);
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5001/api/assignments/${assignmentId}/submit`, {
                url: urls[assignmentId],
                code: codes[assignmentId]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Work submitted successfully! XP rewarded.');
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
        <div className="max-w-6xl mx-auto animate-fade-in">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl p-10 text-white mb-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                        <p className="text-blue-100 text-lg max-w-3xl">{course.description}</p>
                    </div>
                    {activeLiveRoom && (
                        <a href={`/live/${id}`} className="mt-6 md:mt-0 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-red-500/50 transition-all transform hover:-translate-y-1">
                            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                            Join Live Class
                        </a>
                    )}
                    {!activeLiveRoom && scheduledClass && (
                        <div className="mt-6 md:mt-0 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                            <div className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Next Scheduled Class</div>
                            <div className="text-xl font-bold">
                                {new Date(scheduledClass.scheduledTime).toLocaleDateString()} at {new Date(scheduledClass.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    )}
                </div>
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'lectures' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('lectures')}
                    >
                        <PlayCircle className="inline-block mr-2 pb-1" size={20} />
                        Lectures
                    </button>
                    <button
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'assignments' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
                        onClick={() => setActiveTab('assignments')}
                    >
                        <FileText className="inline-block mr-2 pb-1" size={20} />
                        Assignments & Quizzes
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'lectures' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Course Content</h2>
                            {lectures.length === 0 ? (
                                <p className="text-slate-500 text-center py-6">No lectures uploaded yet.</p>
                            ) : (
                                lectures.map((lecture, index) => (
                                    <div key={lecture._id} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                                        <div className="w-full md:w-64 h-36 bg-slate-800 rounded-xl relative overflow-hidden flex-shrink-0">
                                            <img src={`https://source.unsplash.com/random/400x300/?code,technology&sig=${index}`} alt="thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                                    <PlayCircle className="text-white" size={24} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="text-sm text-blue-600 font-bold mb-1 uppercase tracking-wider">Lecture {index + 1}</div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">{lecture.title}</h3>
                                            <p className="text-slate-500 text-sm mb-4">Duration: {lecture.duration} mins • Video URL: <a href={lecture.videoUrl} className="text-blue-500 hover:underline">{lecture.videoUrl}</a></p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Assignments & Quizzes</h2>
                            {assignments.length === 0 ? (
                                <p className="text-slate-500 text-center py-6">No assignments for this course.</p>
                            ) : (
                                assignments.map(assignment => (
                                    <React.Fragment key={assignment._id}>
                                        <div className="mb-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-start">
                                                    <div className={`p-3 rounded-xl mr-5 text-white shadow-sm ${assignment.type === 'quiz' ? 'bg-purple-500' : 'bg-emerald-500'}`}>
                                                        {assignment.type === 'quiz' ? <LayoutList size={24} /> : <FileText size={24} />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <h3 className="text-lg font-bold text-slate-800 mr-3">{assignment.title}</h3>
                                                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                                {assignment.xp} XP
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-500 text-sm max-w-lg mb-3">{assignment.description}</p>
                                                        <div className="flex gap-3 mt-4">
                                                            {assignment.problemUrl && (
                                                                <button
                                                                    onClick={() => setOpenIframe(openIframe === assignment._id ? null : assignment._id)}
                                                                    className="text-sm px-4 py-1.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    {openIframe === assignment._id ? 'Close Problem Platform' : 'Open Problem in Platform'}
                                                                </button>
                                                            )}
                                                            {assignment.documentUrl && (
                                                                <a href={assignment.documentUrl} target="_blank" rel="noopener noreferrer" className="text-sm px-4 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                                                                    Related Document/Calendar
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-3 w-72">
                                                    <textarea
                                                        placeholder="Paste your code here..."
                                                        className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono resize-none"
                                                        value={codes[assignment._id] || ''}
                                                        onChange={(e) => setCodes({ ...codes, [assignment._id]: e.target.value })}
                                                    />
                                                    <input
                                                        type="url"
                                                        placeholder="Optional Link (if any)..."
                                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        value={urls[assignment._id] || ''}
                                                        onChange={(e) => setUrls({ ...urls, [assignment._id]: e.target.value })}
                                                    />
                                                    <button
                                                        onClick={() => submitAssignment(assignment._id)}
                                                        disabled={submitLoading || (!urls[assignment._id] && !codes[assignment._id])}
                                                        className="w-full px-6 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold transition-colors disabled:opacity-50"
                                                    >
                                                        {submitLoading ? 'Submitting...' : 'Submit Work'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Inline Problem Iframe */}
                                            {openIframe === assignment._id && assignment.problemUrl && (
                                                <div className="mt-4 border-2 border-indigo-100 rounded-2xl overflow-hidden bg-slate-50 relative h-[600px]">
                                                    <div className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 flex justify-between items-center">
                                                        <span>Integrated Sandbox Environment</span>
                                                        <a href={assignment.problemUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-200">Open in New Tab if blocked</a>
                                                    </div>
                                                    <iframe
                                                        src={assignment.problemUrl}
                                                        title={`Problem for ${assignment.title}`}
                                                        className="w-full h-full border-none"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </React.Fragment>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseView;
