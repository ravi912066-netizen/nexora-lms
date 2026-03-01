import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, User, Mail, Phone, Lock, GraduationCap } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, phone, password, role });
            if (data.isApproved) {
                login(data);
                navigate('/');
            } else {
                alert('Account created! ✅ Now login with your credentials.');
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { label: 'Full Name', type: 'text', placeholder: 'Your full name', value: name, onChange: setName, icon: User },
        { label: 'Email Address', type: 'email', placeholder: 'you@example.com', value: email, onChange: setEmail, icon: Mail },
        { label: 'Mobile Number', type: 'tel', placeholder: '+91 00000 00000', value: phone, onChange: setPhone, icon: Phone },
        { label: 'Password', type: 'password', placeholder: '••••••••', value: password, onChange: setPassword, icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex">
            {/* Left Panel */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                            <Zap size={22} className="text-white" fill="white" />
                        </div>
                        <span className="text-2xl font-bold text-white">Nexora</span>
                    </div>
                    <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                        Join 500+<br />
                        <span className="text-blue-400">learners today.</span>
                    </h2>
                    <p className="text-blue-200 text-lg max-w-sm">
                        Start your journey with Nexora. Access premium courses, earn XP, and compete on the leaderboard.
                    </p>
                </div>

                <div className="relative z-10 space-y-4">
                    {[
                        { emoji: '⚡', title: 'Earn XP for every action', desc: 'Logins, assignments, lectures — all reward you.' },
                        { emoji: '🏆', title: 'Compete on the leaderboard', desc: 'Rise to the top among your peers.' },
                        { emoji: '🎥', title: '1-on-1 Mentor sessions', desc: 'Get personal guidance from Ravi Yadav.' },
                    ].map(item => (
                        <div key={item.title} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                                <p className="text-white font-semibold text-sm">{item.title}</p>
                                <p className="text-blue-300 text-xs mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-3xl p-8 shadow-2xl">
                        {/* Mobile logo */}
                        <div className="flex items-center gap-2 mb-8 lg:hidden">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Zap size={18} className="text-white" fill="white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">Nexora</span>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                            <p className="text-gray-500 mt-1 text-sm">Join Nexora and start learning today</p>
                        </div>

                        {error && <div className="mb-4 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {fields.map(field => (
                                <div key={field.label}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                                    <div className="relative">
                                        <field.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type={field.type} required
                                            value={field.value} onChange={e => field.onChange(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a...</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[{ val: 'student', label: 'Student', icon: '🎓' }, { val: 'admin', label: 'Instructor', icon: '👨‍🏫' }].map(opt => (
                                        <button
                                            key={opt.val} type="button"
                                            onClick={() => setRole(opt.val)}
                                            className={`flex items-center gap-2 p-3 border-2 rounded-xl text-sm font-semibold transition-all ${role === opt.val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                        >
                                            <span className="text-lg">{opt.icon}</span> {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2"
                            >
                                {loading ? 'Creating account...' : <><GraduationCap size={16} /> Create Account <ArrowRight size={16} /></>}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-5">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
