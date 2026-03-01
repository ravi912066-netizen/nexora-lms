import React, { useEffect, useState } from 'react';
import api from '../api';
import {
    BookOpen, Clock, CheckCircle, Lock,
    ArrowRight, CreditCard, ShieldCheck, AlertCircle,
    X, Upload, Send, IndianRupee
} from 'lucide-react';
import clsx from 'clsx';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({ upiId: '', paymentInstructions: '' });
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(() => {
        fetchData();
        fetchPaymentInfo();
    }, []);

    const fetchData = async () => {
        try {
            const [coursesRes, enrollRes] = await Promise.all([
                api.get('/courses'),
                api.get('/enrollments/my')
            ]);
            setCourses(coursesRes.data);
            setEnrollments(enrollRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentInfo = async () => {
        try {
            const { data } = await api.get('/enrollments/payment-info');
            setPaymentInfo(data);
        } catch (err) {
            console.error('Err payment info', err);
        }
    };

    const handleRequestAccess = async (e) => {
        e.preventDefault();
        if (!file || !transactionId) return alert('Please provide payment proof.');

        setRequestLoading(true);
        const formData = new FormData();
        formData.append('courseId', selectedCourse._id);
        formData.append('transactionId', transactionId);
        formData.append('screenshot', file);

        try {
            await api.post('/enrollments/request', formData);
            alert('Request send ho gayi! Ravi bhai check karke approve kar denge. ✅');
            setSelectedCourse(null);
            fetchData();
        } catch (error) {
            alert('Request fail ho gayi: ' + error.response?.data?.message);
        } finally {
            setRequestLoading(false);
        }
    };

    const getEnrollmentStatus = (courseId) => {
        return enrollments.find(e => e.course?._id === courseId || e.course === courseId);
    };

    if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-400">Loading Missions...</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-10 animate-fade-in space-y-12">
            {/* Header */}
            <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl">
                <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        Mission Directory / Courses
                    </div>
                    <h1 className="text-5xl font-black mb-4 tracking-tight leading-none text-white">Unlock Your Potential 🔓</h1>
                    <p className="text-blue-100/60 font-medium text-lg max-w-xl">
                        Aapke liye curated premium courses. Enroll karein aur apna coding level next tier par le jayein.
                    </p>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map(course => {
                    const enrollment = getEnrollmentStatus(course._id);
                    const isEnrolled = enrollment?.status === 'approved';
                    const isPending = enrollment?.status === 'pending';

                    return (
                        <div key={course._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                            <div className="h-48 bg-slate-50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BookOpen size={48} className="text-blue-600/20" />
                                </div>
                                <div className="absolute top-6 right-6">
                                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm text-slate-900 font-black flex items-center gap-1.5 text-sm">
                                        <IndianRupee size={14} /> {course.price || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col space-y-4">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 italic">Mentor: Ravi Yadav</p>
                                </div>

                                <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                    {course.description}
                                </p>

                                <div className="pt-4 flex items-center justify-between gap-4">
                                    {isEnrolled ? (
                                        <a href={`/courses/${course._id}`} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-center text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all">
                                            <CheckCircle size={16} /> Dashboard Access
                                        </a>
                                    ) : isPending ? (
                                        <div className="flex-1 py-4 bg-amber-50 text-amber-600 rounded-2xl font-black text-center text-xs uppercase tracking-widest border border-amber-100 flex items-center justify-center gap-2">
                                            <Clock size={16} /> Approval Pending
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedCourse(course)}
                                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all transform active:scale-95 translate-y-0 hover:-translate-y-1"
                                        >
                                            <Lock size={16} /> Request Access
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Payment Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-3xl animate-slide-up relative overflow-hidden border border-white/20">
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Authorization</h2>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Target: {selectedCourse.title}</p>
                            </div>
                            <button onClick={() => setSelectedCourse(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={24} /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                            {/* UPI Info Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                                    <div className="z-10 relative space-y-4">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 flex items-center gap-2 text-white">
                                            <CreditCard size={12} /> Payment Gateway
                                        </p>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold opacity-70">Pay via UPI to Ravi Yadav:</p>
                                            <p className="text-2xl font-black tracking-tight">{paymentInfo.upiId || 'raviyadav@upi'}</p>
                                        </div>
                                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <p className="text-[10px] font-black uppercase mb-1">Total Fee</p>
                                            <p className="text-xl font-black flex items-center gap-1"><IndianRupee size={18} /> {selectedCourse.price}</p>
                                        </div>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full"></div> Instructions</p>
                                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                                        {paymentInfo.paymentInstructions || 'Scan the QR or use the UPI ID above. Please upload the screenshot after success.'}
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleRequestAccess} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Transaction ID / Reference</label>
                                    <input
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 font-bold outline-none"
                                        placeholder="Enter T-ID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-white">Payment Screenshot</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            required
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-full px-6 py-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl group-hover:border-blue-400 transition-all flex flex-col items-center gap-3">
                                            {file ? (
                                                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                                    <CheckCircle size={20} /> {file.name.slice(0, 10)}...
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload className="text-slate-400" size={24} />
                                                    <p className="text-[10px] font-black text-slate-400 uppercase">Drop Screenshot</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={requestLoading}
                                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    {requestLoading ? <Clock className="animate-spin" size={20} /> : <Send size={20} />}
                                    {requestLoading ? 'Transmitting...' : 'Confirm Request'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCourses;
