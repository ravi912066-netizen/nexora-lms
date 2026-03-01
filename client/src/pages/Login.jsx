import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, Shield } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setMessage(''); setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.requireOtp) {
                setShowOtp(true);
                setMessage(data.message);
            } else {
                login(data);
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                        Learn smarter.<br />
                        <span className="text-blue-400">Grow faster.</span>
                    </h2>
                    <p className="text-blue-200 text-lg max-w-sm">
                        Your personalized learning dashboard. Track progress, earn XP, compete on the leaderboard.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4">
                    {[
                        { label: 'Active Students', value: '500+' },
                        { label: 'Courses Available', value: '20+' },
                        { label: 'Assignments', value: '100+' },
                        { label: 'XP Awarded', value: '50K+' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-white/5 backdrop-blur rounded-2xl p-5 border border-white/10">
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            <p className="text-blue-300 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* bg blur decorations */}
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

                        {!showOtp ? (
                            <>
                                <div className="mb-8">
                                    <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
                                    <p className="text-gray-500 mt-1">Sign in to your Nexora account</p>
                                </div>

                                {error && <div className="mb-4 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                                        <input
                                            type="email" required
                                            value={email} onChange={e => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                                        <input
                                            type="password" required
                                            value={password} onChange={e => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button
                                        type="submit" disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2"
                                    >
                                        {loading ? 'Signing in...' : <>Sign in <ArrowRight size={16} /></>}
                                    </button>
                                </form>

                                <p className="text-center text-sm text-gray-500 mt-6">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">Create one</Link>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                                        <Shield size={24} className="text-blue-600" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-gray-900">Verify your identity</h1>
                                    <p className="text-gray-500 mt-1 text-sm">{message || `Enter the 6-digit OTP (check backend terminal)`}</p>
                                </div>

                                {error && <div className="mb-4 p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}

                                <form onSubmit={handleVerifyOtp} className="space-y-4">
                                    <input
                                        type="text" required maxLength="6"
                                        value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="w-full text-center text-4xl font-bold tracking-[0.5em] px-4 py-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all bg-gray-50"
                                        placeholder="000000"
                                    />
                                    <button
                                        type="submit" disabled={loading || otp.length < 6}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
                                    >
                                        {loading ? 'Verifying...' : <>Verify & Sign in <ArrowRight size={16} /></>}
                                    </button>
                                    <button type="button" onClick={() => setShowOtp(false)} className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors">
                                        ← Back to login
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
