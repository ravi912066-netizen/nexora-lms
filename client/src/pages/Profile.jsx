import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, Lock, Save, CheckCircle,
    MapPin, Code, Globe, Camera, Github, Link as LinkIcon,
    AlertCircle, MessageSquare, Send, Clock, X
} from 'lucide-react';
import clsx from 'clsx';

const Profile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || '');
    const [codeforcesHandle, setCodeforcesHandle] = useState(user?.codeforcesHandle || '');
    const [leetcodeHandle, setLeetcodeHandle] = useState(user?.leetcodeHandle || '');
    const [gfgHandle, setGfgHandle] = useState(user?.gfgHandle || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [showDoubtModal, setShowDoubtModal] = useState(false);
    const [doubtQuestion, setDoubtQuestion] = useState('');
    const [doubts, setDoubts] = useState([]);
    const [doubtLoading, setDoubtLoading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchMyDoubts();
    }, []);

    const fetchMyDoubts = async () => {
        try {
            const { data } = await api.get('/doubts/my');
            setDoubts(data);
        } catch (err) {
            console.error('Err fetching doubts', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords match nahi kar rahe!' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/profile', {
                name, email, phone, location,
                codeforcesHandle, leetcodeHandle, gfgHandle,
                password: password || undefined
            });
            login(data);
            setMessage({ type: 'success', text: 'Profile updated successfully! 🎉' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const { data } = await api.post('/auth/profile-picture', formData);
            login({ ...user, profilePicture: data.profilePicture });
            setMessage({ type: 'success', text: 'Photo updated! 📸' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleAskDoubt = async (e) => {
        e.preventDefault();
        if (!doubtQuestion.trim()) return;
        setDoubtLoading(true);
        try {
            await api.post('/doubts', { question: doubtQuestion });
            setDoubtQuestion('');
            setShowDoubtModal(false);
            fetchMyDoubts();
            alert('Aapka sawal Ravi bhai ke paas pahunch gaya hai! 🚀');
        } catch (error) {
            alert('Sawal bhejne mein galti hui.');
        } finally {
            setDoubtLoading(false);
        }
    };

    const stats = [
        { label: 'Courses', value: '12', color: 'blue' },
        { label: 'XP Points', value: '450', color: 'indigo' },
        { label: 'Rank', value: '#12', color: 'emerald' },
    ];

    const HandleBadge = ({ platform, handle, verified }) => (
        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex-1 min-w-[180px] relative overflow-hidden group">
            <div className="flex justify-between items-start mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    {platform === 'CF' ? <Code size={12} className="text-blue-500" /> : <div className={clsx("w-3 h-3 rounded-sm", platform === 'LC' ? "bg-amber-500" : "bg-emerald-600")}></div>}
                    {platform === 'CF' ? 'Codeforces' : platform === 'LC' ? 'LeetCode' : 'GFG'}
                </p>
                {verified ? (
                    <CheckCircle size={14} className="text-emerald-500" />
                ) : (
                    <AlertCircle size={14} className="text-amber-500" />
                )}
            </div>
            <p className="font-black text-slate-800 text-lg tracking-tight truncate">
                {handle || '---'}
            </p>
            <div className={clsx(
                "absolute bottom-0 left-0 h-1 transition-all group-hover:h-full group-hover:opacity-5",
                verified ? "bg-emerald-500 w-full" : "bg-amber-500 w-1/2"
            )}></div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-10 animate-fade-in space-y-10 relative">
            {/* TLE Inspired Header Card */}
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row p-10 gap-10 items-center">
                <div className="relative group">
                    <div className="w-48 h-48 rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-7xl font-black shadow-2xl transform group-hover:rotate-3 transition-all duration-500 overflow-hidden ring-4 ring-white ring-offset-4 ring-offset-slate-50">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.name?.charAt(0).toUpperCase()
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 active:scale-90 border border-slate-100"
                    >
                        {uploading ? <div className="w-5 h-5 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></div> : <Camera size={20} />}
                    </button>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{user?.name}</h1>
                        <p className="text-slate-400 font-bold text-sm">{user?.email}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <div className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></span>
                            {user?.role} Active
                        </div>
                        {user?.location && (
                            <div className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={12} />
                                {user.location}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4 max-w-sm">
                        {stats.map(s => (
                            <div key={s.label} className="text-center group cursor-default">
                                <p className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{s.value}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                    <HandleBadge platform="CF" handle={user?.codeforcesHandle} verified={user?.isVerifiedCF} />
                    <HandleBadge platform="LC" handle={user?.leetcodeHandle} verified={user?.isVerifiedLC} />
                    <HandleBadge platform="GFG" handle={user?.gfgHandle} verified={user?.isVerifiedGFG} />
                </div>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                    <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                        <Save className="text-blue-600" /> Edit Profile
                    </h3>

                    {message.text && (
                        <div className={`p-4 rounded-2xl mb-10 text-sm font-bold uppercase border-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                                <input required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Mail</label>
                                <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Access</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location / Base</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Codeforces Handle</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={codeforcesHandle} onChange={(e) => setCodeforcesHandle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">LeetCode Handle</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={leetcodeHandle} onChange={(e) => setLeetcodeHandle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">GFG Handle</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none ring-0" value={gfgHandle} onChange={(e) => setGfgHandle(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                            <Save size={20} /> {loading ? 'Syncing...' : 'Finalize Profile'}
                        </button>
                    </form>
                </div>

                {/* Question Section */}
                <div className="space-y-10 flex flex-col">
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-2xl relative overflow-hidden flex-1 flex flex-col">
                        <div className="z-10 relative">
                            <h3 className="text-xl font-black mb-2">Ask Ravi Yadav ❓</h3>
                            <p className="text-slate-400 text-sm font-bold">Aapko koi doubt hai ya platform par help chahiye? Seedha Ravi bhai ko pucho!</p>

                            <button
                                onClick={() => setShowDoubtModal(true)}
                                className="mt-8 w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare size={18} /> Ask a Question
                            </button>
                        </div>

                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 flex-1 flex flex-col shadow-xl">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <Clock size={14} /> Mission Logs / Doubts
                        </h4>
                        <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                            {doubts.length === 0 ? (
                                <p className="text-slate-300 font-bold text-center py-10 italic">No doubts logged yet.</p>
                            ) : (
                                doubts.map(d => (
                                    <div key={d._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                        <p className="text-xs font-black text-slate-800 line-clamp-2">{d.question}</p>
                                        <div className="flex justify-between items-center">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase",
                                                d.status === 'resolved' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                            )}>
                                                {d.status}
                                            </span>
                                            {d.answer && <p className="text-[10px] text-blue-600 font-bold italic">Resolved ✅</p>}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Question Modal */}
            {showDoubtModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-3xl animate-slide-up border border-white/20">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black text-slate-900">Ask the Visionary 🧠</h2>
                            <button onClick={() => setShowDoubtModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleAskDoubt} className="space-y-6">
                            <textarea
                                required
                                value={doubtQuestion}
                                onChange={(e) => setDoubtQuestion(e.target.value)}
                                placeholder="Bhai, mujhe coding mein doubt aa raha hai..."
                                className="w-full h-40 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-600 font-bold outline-none ring-0 resize-none"
                            />
                            <button
                                type="submit"
                                disabled={doubtLoading}
                                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                <Send size={20} /> {doubtLoading ? 'Transmitting...' : 'Send to Ravi Yadav'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
