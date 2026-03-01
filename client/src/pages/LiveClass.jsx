import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, Send, CheckCircle, StopCircle, RefreshCw } from 'lucide-react';

const LiveClass = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [liveData, setLiveData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Admin specifics
    const [questionTitle, setQuestionTitle] = useState('');
    const [problemUrl, setProblemUrl] = useState('');
    const [xp, setXp] = useState(100);

    // Student specifics
    const [studentUrl, setStudentUrl] = useState('');
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Polling interval ref
    const pollInterval = useRef(null);

    const checkLiveStatus = async () => {
        try {
            const res = await api.get(`/live/room/${courseId}`);
            setLiveData(res.data);

            // If student joins, optionally hit the join endpoint once
            if (user.role === 'student' && res.data) {
                await api.post('/live/join', { roomId: res.data.roomId });
            }
        } catch (error) {
            setLiveData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLiveStatus();
        pollInterval.current = setInterval(checkLiveStatus, 5000);
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [courseId, user.role]);

    const startClass = async () => {
        try {
            const roomId = `nexus-live-${courseId}-${Date.now()}`;
            await api.post('/live/start', { courseId, roomId });
            checkLiveStatus();
        } catch (error) {
            alert('Failed to start class');
        }
    };

    const pushQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('/live/push', {
                roomId: liveData.roomId,
                title: questionTitle,
                problemUrl: problemUrl,
                xp: Number(xp)
            });
            alert('Question Pushed to all students!');
            setQuestionTitle('');
            setProblemUrl('');
        } catch (error) {
            alert('Failed to push problem');
        }
    };

    const submitAnswer = async () => {
        if (!studentUrl) return;
        setSubmissionLoading(true);
        setTimeout(() => {
            setSubmitted(true);
            setSubmissionLoading(false);
            setStudentUrl('');
        }, 1500);
    };

    const endClass = async () => {
        if (!window.confirm("End this live class?")) return;
        try {
            await api.post('/live/end', { roomId: liveData.roomId });
            navigate(user.role === 'admin' ? '/admin/courses' : '/courses');
        } catch (error) {
            alert('Failed to end class');
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Live Room...</div>;

    if (!liveData) {
        return (
            <div className="max-w-4xl mx-auto p-10 text-center">
                <h2 className="text-3xl font-bold mb-4">{user.role === 'admin' ? 'No Active Class Found' : 'Class is offline'}</h2>
                <p className="text-slate-500 mb-8">{user.role === 'admin' ? 'Start the live video session for this course here.' : 'The instructor has not started a live session for this course yet.'}</p>
                {user.role === 'admin' && (
                    <button onClick={startClass} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
                        Launch Live Class Room
                    </button>
                )}
                <button onClick={() => navigate(-1)} className="block mx-auto mt-4 text-slate-500 hover:text-indigo-600">Go Back</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1500px] mx-auto p-4 flex flex-col h-[calc(100vh-2rem)]">
            {/* Header with Navigation */}
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
                        <RefreshCw size={20} className="rotate-180" />
                    </button>
                    <div>
                        <h2 className="font-bold text-slate-800">Live Session Interface</h2>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Nexora High-Performance Classroom</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        {liveData.activeStudents?.length || 0} Connected
                    </div>
                    {user.role === 'admin' && (
                        <button onClick={endClass} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-red-500/30 flex items-center gap-2">
                            <StopCircle size={18} /> End Session
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Column: Video */}
                <div className="flex-1 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-900 group">
                    <iframe
                        src={`https://meet.jit.si/${liveData.roomId}#config.prejoinPageEnabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","closedcaptions","desktop","fullscreen","fodeviceselection","hangup","profile","chat","recording","livestreaming","etherpad","sharedvideo","settings","raisehand","videoquality","filmstrip","invite","feedback","stats","shortcuts","tileview","videobackgroundblur","download","help","mute-everyone","security"]`}
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        className="w-full h-full border-none"
                        title="Live Class Video"
                    />
                </div>

                {/* Right Column: Engagement Panel */}
                <div className="w-full md:w-[450px] bg-slate-50 rounded-3xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        {user.role === 'admin' ? (
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 text-lg border-b pb-2 flex items-center gap-2">
                                    <Send size={18} className="text-indigo-600" /> Broadcast Task
                                </h3>
                                <form onSubmit={pushQuestion} className="space-y-4">
                                    <input required placeholder="Task Title" className="w-full p-3 border rounded-xl text-sm" value={questionTitle} onChange={e => setQuestionTitle(e.target.value)} />
                                    <input required type="url" placeholder="Problem URL (Newton)" className="w-full p-3 border rounded-xl text-sm" value={problemUrl} onChange={e => setProblemUrl(e.target.value)} />
                                    <div className="flex items-center gap-4">
                                        <label className="text-xs text-slate-500 font-bold whitespace-nowrap">XP Value:</label>
                                        <input required type="number" className="flex-1 p-2 border rounded-xl text-sm" value={xp} onChange={e => setXp(e.target.value)} />
                                    </div>
                                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all">
                                        <Send size={16} /> Broadcast Now
                                    </button>
                                </form>
                                {liveData.currentQuestion?.title && (
                                    <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                            <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase">ACTIVE</span>
                                        </div>
                                        <div className="font-semibold text-emerald-900 text-sm">{liveData.currentQuestion.title}</div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="font-bold text-slate-800 text-lg">Class Workspace</h3>
                                    <RefreshCw size={16} className="text-slate-400" />
                                </div>
                                {!liveData.currentQuestion?.title ? (
                                    <div className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-white">
                                        <p className="text-sm font-medium text-slate-400">Instructor is preparing the next task...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                            <div className="bg-slate-800 text-white p-3 text-xs font-bold flex justify-between items-center">
                                                <span>Integrated Practice Arena</span>
                                                <span className="text-emerald-400">{liveData.currentQuestion.xp} XP</span>
                                            </div>
                                            <div className="h-[400px] bg-slate-100">
                                                <iframe src={liveData.currentQuestion.problemUrl} className="w-full h-full border-none" title="Sandbox" />
                                            </div>
                                        </div>
                                        <div className="bg-white border-2 border-indigo-100 p-5 rounded-2xl shadow-sm relative overflow-hidden">
                                            {submitted && (
                                                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                                    <CheckCircle className="text-emerald-500 mb-2" size={48} />
                                                    <div className="font-bold text-emerald-700">Done!</div>
                                                </div>
                                            )}
                                            <h4 className="font-bold text-slate-800 mb-4 text-sm">Submit Solution</h4>
                                            <div className="space-y-3">
                                                <input type="url" placeholder="Paste Result URL..." className="w-full text-sm p-3 border rounded-xl" value={studentUrl} onChange={e => setStudentUrl(e.target.value)} />
                                                <button onClick={submitAnswer} disabled={submissionLoading || !studentUrl} className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl shadow hover:bg-emerald-600 transition-all disabled:opacity-50">
                                                    {submissionLoading ? 'Submitting...' : 'Submit Work'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClass;
