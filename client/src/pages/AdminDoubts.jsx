import React, { useEffect, useState } from 'react';
import api from '../api';
import {
    MessageSquare, CheckCircle, Clock, Send,
    User, Search, Filter, ShieldQuestion, Loader2, X
} from 'lucide-react';
import clsx from 'clsx';

const AdminDoubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDoubt, setActiveDoubt] = useState(null);
    const [answer, setAnswer] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchDoubts();
    }, []);

    const fetchDoubts = async () => {
        try {
            const { data } = await api.get('/doubts/all');
            setDoubts(data);
        } catch (error) {
            console.error('Error fetching doubts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;
        setSubmitLoading(true);
        try {
            await api.put(`/doubts/${activeDoubt._id}/resolve`, { answer });
            setAnswer('');
            setActiveDoubt(null);
            fetchDoubts();
            alert('Sawal resolve ho gaya! Student ko answer mil jayega. ✅');
        } catch (error) {
            alert('Error resolving doubt');
        } finally {
            setSubmitLoading(false);
        }
    };

    const filteredDoubts = doubts.filter(d =>
        d.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center p-20 animate-fade-in">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Mission Intel...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-10 animate-fade-in space-y-10">
            {/* Header */}
            <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div>
                        <div className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            Command Center / Doubts
                        </div>
                        <h1 className="text-5xl font-black mb-4 tracking-tight leading-none">Student Question Log 🛡️</h1>
                        <p className="text-blue-100/60 font-medium text-lg max-w-xl">
                            Ravi bhai, yahan students ke saare doubts aur sawal aayenge. Unhe guide karein aur mission successful banayein!
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 text-center min-w-[150px]">
                            <p className="text-3xl font-black text-white">{doubts.filter(d => d.status === 'pending').length}</p>
                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mt-1">Pending Doubts</p>
                        </div>
                        <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl text-center min-w-[150px]">
                            <p className="text-3xl font-black text-white">{doubts.filter(d => d.status === 'resolved').length}</p>
                            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mt-1">Resolved Tasks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Hub */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0"
                        placeholder="Search student or question..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <button className="p-4 bg-slate-50 text-slate-500 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 transition-all">
                        <Filter size={20} />
                    </button>
                    <button onClick={fetchDoubts} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-blue-600 transition-all">
                        Refresh Intel
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Doubt List */}
                <div className="lg:col-span-2 space-y-6">
                    {filteredDoubts.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] text-center border border-slate-100">
                            <ShieldQuestion size={64} className="text-slate-200 mx-auto mb-6" />
                            <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No matching questions found.</p>
                        </div>
                    ) : (
                        filteredDoubts.map(d => (
                            <div
                                key={d._id}
                                onClick={() => d.status === 'pending' && setActiveDoubt(d)}
                                className={clsx(
                                    "bg-white p-8 rounded-[2.5rem] shadow-lg border-2 transition-all cursor-pointer group flex flex-col md:flex-row gap-8 items-start",
                                    d.status === 'resolved' ? "border-emerald-50 bg-emerald-50/20" : "border-slate-50 hover:border-blue-500 hover:shadow-2xl"
                                )}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                    <User size={32} />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900 text-xl">{d.student?.name}</p>
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{d.student?.email}</p>
                                        </div>
                                        <div className={clsx(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
                                            d.status === 'resolved' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                        )}>
                                            <div className={clsx("w-1.5 h-1.5 rounded-full", d.status === 'resolved' ? "bg-emerald-600" : "bg-amber-600 animate-pulse")}></div>
                                            {d.status}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-relaxed italic">"{d.question}"</p>

                                    {d.answer && (
                                        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 mt-4">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Ravi Yadav's Response:</p>
                                            <p className="text-emerald-900 font-bold text-sm">"{d.answer}"</p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-xs font-black text-slate-400 pt-4">
                                        <span className="flex items-center gap-2 italic"><Clock size={12} /> {new Date(d.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Response Panel (Sticky-ish) */}
                <div className="lg:sticky lg:top-10 h-fit space-y-10">
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-3xl space-y-8 relative overflow-hidden min-h-[400px] flex flex-col justify-center text-center">
                        <div className="z-10 relative space-y-6">
                            {activeDoubt ? (
                                <>
                                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                        <MessageSquare size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black">Resolve Doubt</h3>
                                    <p className="text-blue-300 font-bold text-sm">Responding to <span className="text-white">{activeDoubt.student?.name}</span>'s concern.</p>

                                    <textarea
                                        className="w-full h-40 bg-white/10 border-2 border-white/20 rounded-3xl p-6 font-bold text-white placeholder-white/30 outline-none focus:border-blue-500 transition-all resize-none"
                                        placeholder="Enter your expert guidance here..."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    />

                                    <div className="flex gap-4">
                                        <button onClick={() => setActiveDoubt(null)} className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all">Cancel</button>
                                        <button
                                            onClick={handleResolve}
                                            disabled={submitLoading || !answer.trim()}
                                            className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            {submitLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                            Transmit Solution
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 group">
                                        <ShieldQuestion size={48} className="text-white/20 group-hover:text-blue-500 transition-all duration-500" />
                                    </div>
                                    <h3 className="text-2xl font-black mb-4">Command Post</h3>
                                    <p className="text-blue-300/60 font-bold text-sm leading-relaxed px-4">
                                        Select a pending doubt from the list to start the resolution protocol. Aapki guidance students ke liye bohot zaruri hai!
                                    </p>
                                </>
                            )}
                        </div>
                        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDoubts;
