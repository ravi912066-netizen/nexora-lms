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
    const [upiId, setUpiId] = useState(user?.upiId || '');
    const [paymentInstructions, setPaymentInstructions] = useState(user?.paymentInstructions || '');
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
    const isAdmin = user?.role === 'admin';

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
                upiId, paymentInstructions,
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
                        <div className={clsx(
                            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2",
                            isAdmin ? "bg-amber-100 text-amber-600 border border-amber-200" : "bg-blue-50 text-blue-600"
                        )}>
                            <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", isAdmin ? "bg-amber-600" : "bg-blue-600")}></span>
                            {isAdmin ? 'Founder & CEO' : `${user?.role} Active`}
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

            {/* Profile & Intel Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                    <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                        <Save className="text-blue-600" /> Administrative Console
                    </h3>

                    {message.text && (
                        <div className={`p-4 rounded-2xl mb-10 text-sm font-bold uppercase border-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tactical Name</label>
                                <input required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Comms Email</label>
                                <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Direct Line (Phone)</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Deployment Location</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2 italic"><Code size={10} /> Codeforces</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={codeforcesHandle} onChange={(e) => setCodeforcesHandle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2 italic"><Globe size={10} /> LeetCode</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={leetcodeHandle} onChange={(e) => setLeetcodeHandle(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2 italic"><AlertCircle size={10} /> GFG</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none" value={gfgHandle} onChange={(e) => setGfgHandle(e.target.value)} />
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="pt-8 border-t-2 border-dashed border-slate-100 space-y-8">
                                <h4 className="text-sm font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <ShieldQuestion size={16} /> Founder Operations Protocol
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Global UPI Signature</label>
                                        <input
                                            className="w-full px-6 py-4 bg-amber-50/40 border-2 border-amber-100 rounded-2xl focus:border-amber-600 font-black text-amber-900 outline-none"
                                            placeholder="Your UPI ID"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Directives</label>
                                        <input
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none"
                                            placeholder="Instructions for students"
                                            value={paymentInstructions}
                                            onChange={(e) => setPaymentInstructions(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-blue-600 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                            <Save size={20} /> {loading ? 'Transmitting Data...' : 'Confirm System Update'}
                        </button>
                    </form>
                </div>

                {/* Right Column / Quick Info */}
                <div className="space-y-10">
                    <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                        <div className="z-10 relative space-y-4">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-400/30">
                                <MessageSquare size={28} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tight">Direct Intel Link</h3>
                            <p className="text-blue-100/40 text-xs font-bold leading-relaxed">
                                Something blocking your mission? Ravi Yadav is ready to provide tactical guidance. Contact the Command Center.
                            </p>

                            <button
                                onClick={() => setShowDoubtModal(true)}
                                className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
                            >
                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                Request Support
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 italic">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div> System Status
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black uppercase text-slate-500">Account Tier</span>
                                <span className="text-xs font-black text-blue-600 uppercase">{user.role}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black uppercase text-slate-500">Security Guard</span>
                                <span className="text-xs font-black text-emerald-600 uppercase italic">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Intel / Doubt Dashboard - THE BIG REFACTOR */}
            <div className="bg-white/40 backdrop-blur-md rounded-[4rem] p-12 border border-white/40 shadow-xl space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Mission Intel Hub 🛡️</h2>
                        <p className="text-slate-500 font-bold text-sm mt-1">Track your support requests and tactical guidance from Ravi Yadav.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-center shadow-lg">
                            <p className="text-xl font-black">{doubts.length}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-blue-400">Total Intel</p>
                        </div>
                        <div className="bg-white text-slate-900 border border-slate-100 px-6 py-3 rounded-2xl text-center shadow-lg">
                            <p className="text-xl font-black">{doubts.filter(d => d.status === 'resolved').length}</p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Resolved</p>
                        </div>
                    </div>
                </div>

                {doubts.length === 0 ? (
                    <div className="bg-slate-50/50 p-20 rounded-[3.5rem] text-center border-2 border-dashed border-slate-100">
                        <MessageSquare size={48} className="text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Intel requests initiated. Ready for deployment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pr-2 custom-scrollbar">
                        {doubts.map(d => (
                            <div key={d._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-6 group">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            d.status === 'resolved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                                        )}>
                                            <ShieldQuestion size={24} />
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Query ID: #{d._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-xs font-black text-slate-900 italic">{new Date(d.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className={clsx(
                                        "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest",
                                        d.status === 'resolved' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                    )}>
                                        {d.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-slate-800 font-bold leading-relaxed">
                                        "{d.question}"
                                    </h4>

                                    {d.answer ? (
                                        <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 relative mt-4">
                                            <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                Ravi's Directive
                                            </div>
                                            <p className="text-blue-900 font-bold text-sm leading-relaxed italic">
                                                "{d.answer}"
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 pt-2 text-slate-400">
                                            <Clock size={12} className="animate-spin-slow" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Mission Pending Approval...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Question Modal */}
            {showDoubtModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-3xl animate-slide-up border border-white/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                        <div className="flex justify-between items-center mb-10 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Request Intel 🧠</h2>
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Direct Link to Ravi Yadav</p>
                            </div>
                            <button onClick={() => setShowDoubtModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleAskDoubt} className="space-y-8 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mission Query Details</label>
                                <textarea
                                    required
                                    value={doubtQuestion}
                                    onChange={(e) => setDoubtQuestion(e.target.value)}
                                    placeholder="Describe your blocker or question in detail..."
                                    className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-blue-600 font-bold outline-none transition-all resize-none shadow-inner"
                                />
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={doubtLoading}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em]"
                                >
                                    {doubtLoading ? <Clock className="animate-spin" size={20} /> : <Send size={20} />}
                                    {doubtLoading ? 'Transmitting...' : 'Initiate Transmission'}
                                </button>
                                <p className="text-[8px] font-black text-slate-300 text-center uppercase tracking-widest">
                                    Secure Connection Established via Nexora Protocol
                                </p>
                            </div>
                        </form>

                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
