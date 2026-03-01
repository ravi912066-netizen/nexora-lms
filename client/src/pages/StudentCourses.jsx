import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { BookOpen, CreditCard, CheckCircle, Clock, X, Upload, IndianRupee, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEnrollModal, setShowEnrollModal] = useState(null); // course object
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState(null);
    const [requesting, setRequesting] = useState(false);

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

    useEffect(() => {
        fetchData();
    }, []);

    const handleEnrollRequest = async (e) => {
        e.preventDefault();
        if (!file) return alert('Bhai, payment ka screenshot to dalo!');

        setRequesting(true);
        const formData = new FormData();
        formData.append('courseId', showEnrollModal._id);
        formData.append('transactionId', transactionId);
        formData.append('screenshot', file);

        try {
            await api.post('/enrollments/request', formData);
            alert('Request bhej di gayi hai! Ravi Yadav bhai ke approve karne ka wait karein.');
            setShowEnrollModal(null);
            setFile(null);
            setTransactionId('');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Request fail ho gaya');
        } finally {
            setRequesting(false);
        }
    };

    const getEnrollmentStatus = (courseId) => {
        const enrollment = enrollments.find(e => e.course._id === courseId);
        return enrollment ? enrollment.status : null;
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;

    return (
        <div className="animate-fade-in p-2 sm:p-6 lg:p-10">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mission Catalog</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                    <BookOpen size={14} className="text-blue-500" /> Choose Your Training Path
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.map(course => {
                    const status = getEnrollmentStatus(course._id);
                    const isApproved = status === 'approved';
                    const isPending = status === 'pending';

                    return (
                        <div key={course._id} className="bg-white rounded-[2.5rem] p-1 shadow-xl border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-2 group overflow-hidden flex flex-col">
                            <div className="h-56 bg-gradient-to-tr from-slate-900 to-blue-900 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-end text-white">
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                        ₹{course.price}
                                    </div>
                                    {isApproved && (
                                        <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                                            <CheckCircle size={10} /> Enrolled
                                        </div>
                                    )}
                                </div>

                                <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen group-hover:scale-110 transition-transform duration-700"></div>

                                <h3 className="text-2xl font-black z-10 leading-tight mb-2 tracking-tight group-hover:translate-x-1 transition-transform">{course.title}</h3>
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{course.description}</p>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                    {isApproved ? (
                                        <Link
                                            to={`/courses/${course._id}`}
                                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                                        >
                                            Enter Mission Ground
                                        </Link>
                                    ) : isPending ? (
                                        <div className="w-full bg-amber-50 text-amber-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-center border border-amber-100 flex items-center justify-center gap-2">
                                            <Clock size={16} /> Identity Pending
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowEnrollModal(course)}
                                            className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] text-center hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <CreditCard size={16} /> Request Access
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {courses.length === 0 && (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-slate-50 text-slate-300 mb-6">
                            <BookOpen size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Catalog Empty</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">New missions are being architected by the admin.</p>
                    </div>
                )}
            </div>

            {/* Enrollment Modal */}
            {showEnrollModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowEnrollModal(null)}></div>
                    <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.5)] z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 sm:p-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Request Course Access</h2>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{showEnrollModal.title}</p>
                                </div>
                                <button onClick={() => setShowEnrollModal(null)} className="p-3 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-2xl transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Fee</p>
                                    <p className="text-3xl font-black text-blue-700 tracking-tight">₹{showEnrollModal.price}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl rotate-3 shadow-lg border border-blue-50">
                                    <IndianRupee size={24} className="text-blue-500" />
                                </div>
                            </div>

                            <form onSubmit={handleEnrollRequest} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Transaction ID / TXN Hash</label>
                                    <input
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none"
                                        placeholder="Enter the ID from your UPI/Bank app"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Payment Verification Image</label>
                                    <div
                                        className={clsx(
                                            "w-full h-40 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
                                            file ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50"
                                        )}
                                        onClick={() => document.getElementById('enroll-upload').click()}
                                    >
                                        {file ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <CheckCircle size={32} className="text-emerald-500" />
                                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{file.name}</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload size={32} className="text-slate-300" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Screenshot</p>
                                            </div>
                                        )}
                                        <input
                                            id="enroll-upload"
                                            type="file"
                                            hidden
                                            onChange={(e) => setFile(e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={requesting}
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-black transition-all transform active:scale-95 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                                >
                                    {requesting ? 'Processing Signal...' : 'Transmit Access Request'}
                                </button>
                            </form>

                            <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-start gap-4">
                                <ShieldAlert size={20} className="text-red-600 shrink-0 mt-1" />
                                <p className="text-[10px] font-bold text-red-700 uppercase leading-relaxed tracking-wider">
                                    Warning: Galat Proof dalne par identity blacklist ho sakti hai. Ravi Yadav bhai ke account mein paise transfer karke hi request karein.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentCourses;
