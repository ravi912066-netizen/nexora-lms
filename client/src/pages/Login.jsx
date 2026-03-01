import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
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
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
            {/* Background decoration */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

            <div className="relative w-full max-w-md p-8 m-4 rounded-3xl glass shadow-2xl z-10 transition-all duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 shadow-inner">
                        {showOtp ? <ShieldCheck size={32} /> : <LogIn size={32} />}
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800">
                        {showOtp ? 'Security Check' : 'Welcome Back'}
                    </h2>
                    <p className="text-slate-500 mt-2">
                        {showOtp ? 'Enter the code sent to your mobile' : 'Sign in to your Nexora Edu account'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm text-center border border-red-100 animate-shake">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-4 text-xs text-center border border-blue-100">
                        {message}
                    </div>
                )}

                {!showOtp ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xl shadow-blue-200 active:scale-95"
                        >
                            Log In
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-widest text-[10px]">6-Digit OTP</label>
                            <input
                                type="text"
                                required
                                maxLength="6"
                                className="w-full px-4 py-5 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none transition-all bg-white/80"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                        >
                            Verify & Enter
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowOtp(false)}
                            className="w-full flex items-center justify-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
                        >
                            <ArrowLeft size={14} /> Back to Credentials
                        </button>
                    </form>
                )}

                {!showOtp && (
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Register now
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
