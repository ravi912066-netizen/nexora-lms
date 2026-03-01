import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save, CheckCircle } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            return setMessage({ type: 'error', text: 'Mafi chahte hain! Passwords match nahi kar rahe.' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data } = await api.put('/auth/profile', {
                name, email, phone, password: password || undefined
            });
            login(data); // Update local state
            setMessage({ type: 'success', text: 'Profile update ho gayi hai! 🎉' });
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Update fail ho gaya' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 animate-fade-in">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Identity</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Manage your Nexora Edu Profile ID</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Visual Avatar Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-5xl font-black shadow-2xl mb-6 transform hover:rotate-6 transition-transform">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user?.name}</h2>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1 bg-blue-50 px-3 py-1 rounded-full">{user?.role} Cadet</p>

                        <div className="mt-8 pt-8 border-t border-slate-100 w-full space-y-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Mail size={16} className="text-slate-300" />
                                <span className="text-xs font-bold truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <Phone size={16} className="text-slate-300" />
                                <span className="text-xs font-bold">{user?.phone || 'No Phone Added'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="md:col-span-2">
                    <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                        <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
                            <User className="text-blue-600" />
                            Update Information
                        </h3>

                        {message.text && (
                            <div className={`p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold uppercase tracking-widest border-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100 animate-shake'}`}>
                                {message.type === 'success' ? <CheckCircle size={18} /> : null}
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                                    <input required className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mobile Number</label>
                                    <input className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                <input required type="email" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Security Credentials</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">New Password (Optional)</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Confirm Identity</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 transition-all font-bold outline-none" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all transform active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {loading ? 'Updating Identity...' : 'Save Mission Data'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
