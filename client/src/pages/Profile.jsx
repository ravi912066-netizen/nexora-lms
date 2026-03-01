import React, { useState, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, Lock, Save, CheckCircle,
    MapPin, Code, Globe, Camera, Github, Link as LinkIcon
} from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || '');
    const [codeforcesHandle, setCodeforcesHandle] = useState(user?.codeforcesHandle || '');
    const [leetcodeHandle, setLeetcodeHandle] = useState(user?.leetcodeHandle || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const fileInputRef = useRef(null);

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
                codeforcesHandle, leetcodeHandle,
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

    const stats = [
        { label: 'Courses', value: '12', color: 'blue' },
        { label: 'XP Points', value: '450', color: 'indigo' },
        { label: 'Rank', value: '#12', color: 'emerald' },
    ];

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-10 animate-fade-in space-y-10">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                    {/* Handles Display */}
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 min-w-[200px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Code size={12} className="text-blue-500" /> Codeforces
                        </p>
                        <p className="font-black text-slate-800 text-lg tracking-tight">
                            {user?.codeforcesHandle || '---'}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 min-w-[200px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-sm"></div> LeetCode
                        </p>
                        <p className="font-black text-slate-800 text-lg tracking-tight">
                            {user?.leetcodeHandle || '---'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Interface */}
            <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-3">
                        <Save className="text-blue-600" />
                        Refine Your Identity
                    </h3>

                    {message.text && (
                        <div className={`p-4 rounded-2xl mb-10 flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100 animate-shake'}`}>
                            <CheckCircle size={18} />
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Column 1: Core Data */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                                <input required className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0 focus:shadow-lg focus:shadow-blue-50" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Mail</label>
                                <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Access</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location / Base</label>
                                <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" placeholder="e.g. Noida, India" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                        </div>

                        {/* Column 2: External Nodes & Security */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Codeforces Handle</label>
                                    <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" placeholder="ravi.Nyadav" value={codeforcesHandle} onChange={(e) => setCodeforcesHandle(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">LeetCode Handle</label>
                                    <input className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" placeholder="ravi_yadav" value={leetcodeHandle} onChange={(e) => setLeetcodeHandle(e.target.value)} />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">
                                        Update Security Pass <span>(Leave empty to keep current)</span>
                                    </label>
                                    <input type="password" placeholder="New Secret Password" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Verify Secret</label>
                                    <input type="password" placeholder="Confirm Secret Password" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none ring-0" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 mt-4 bg-blue-600 text-white font-black rounded-[1.5rem] shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {loading ? 'Syncing Profile...' : 'Finalize Profile Data'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-[100px] -z-0 translate-x-1/2 -translate-y-1/2"></div>
            </div>
        </div>
    );
};

export default Profile;
