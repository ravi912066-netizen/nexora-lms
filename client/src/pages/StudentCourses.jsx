import React, { useEffect, useState } from 'react';
import api from '../api';
import {
    BookOpen, Clock, CheckCircle, Lock,
    ArrowRight, CreditCard, X, Upload, Send, IndianRupee, Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

const courseGradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
];

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [file, setFile] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({ upiId: '', paymentInstructions: '' });
    const [requestLoading, setRequestLoading] = useState(false);
    const [search, setSearch] = useState('');

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
            alert('Request sent! Ravi bhai will approve shortly. ✅');
            setSelectedCourse(null);
            setTransactionId('');
            setFile(null);
            fetchData();
        } catch (error) {
            alert('Request failed: ' + error.response?.data?.message);
        } finally {
            setRequestLoading(false);
        }
    };

    const getEnrollmentStatus = (courseId) => enrollments.find(e => e.course?._id === courseId || e.course === courseId);

    const filtered = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
    );

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="text-gray-500 mt-1">{courses.length} courses available for you</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full sm:w-72">
                    <Search size={16} className="text-gray-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search courses..."
                        className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-full"
                    />
                </div>
            </div>

            {/* Course Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No courses found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((course, idx) => {
                        const enrollment = getEnrollmentStatus(course._id);
                        const isEnrolled = enrollment?.status === 'approved';
                        const isPending = enrollment?.status === 'pending';

                        return (
                            <div key={course._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden group flex flex-col">
                                {/* Course thumbnail */}
                                <div className={`h-44 bg-gradient-to-br ${courseGradients[idx % courseGradients.length]} relative overflow-hidden flex items-center justify-center`}>
                                    <BookOpen size={56} className="text-white/30" />
                                    {course.price > 0 && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 font-bold text-sm px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                                            <IndianRupee size={13} />{course.price}
                                        </div>
                                    )}
                                    {isEnrolled && (
                                        <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                                            <CheckCircle size={12} /> Enrolled
                                        </div>
                                    )}
                                    {isPending && (
                                        <div className="absolute top-4 left-4 bg-amber-400 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                                            <Clock size={12} /> Pending
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">By Ravi Yadav</p>
                                        <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">{course.description}</p>
                                    </div>

                                    <div className="mt-5">
                                        {isEnrolled ? (
                                            <Link to={`/courses/${course._id}`} className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors">
                                                <CheckCircle size={16} /> Go to Course <ArrowRight size={14} />
                                            </Link>
                                        ) : isPending ? (
                                            <div className="flex items-center justify-center gap-2 w-full py-3 bg-amber-50 text-amber-600 font-semibold rounded-xl text-sm border border-amber-200">
                                                <Clock size={16} /> Approval Pending
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedCourse(course)}
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
                                            >
                                                <Lock size={15} /> Request Access
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Payment Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Request Course Access</h2>
                                <p className="text-sm text-gray-500 mt-0.5">{selectedCourse.title}</p>
                            </div>
                            <button onClick={() => setSelectedCourse(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Payment Info */}
                            <div className="space-y-4">
                                <div className="bg-blue-600 rounded-2xl p-6 text-white">
                                    <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold mb-3">
                                        <CreditCard size={14} /> PAYMENT DETAILS
                                    </div>
                                    <p className="text-xs text-blue-200 mb-1">Pay via UPI to:</p>
                                    <p className="text-xl font-bold">{paymentInfo.upiId || 'raviyadav@upi'}</p>
                                    <div className="mt-4 p-3 bg-white/10 rounded-xl">
                                        <p className="text-xs text-blue-200 mb-0.5">Course Fee</p>
                                        <p className="text-lg font-bold flex items-center gap-1">
                                            <IndianRupee size={16} />{selectedCourse.price || 0}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-sm text-amber-800">
                                    {paymentInfo.paymentInstructions || 'Pay via UPI, take a screenshot, and upload it below.'}
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleRequestAccess} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Transaction ID</label>
                                    <input
                                        required value={transactionId} onChange={e => setTransactionId(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-all"
                                        placeholder="Enter UPI transaction ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Screenshot</label>
                                    <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                                        <input type="file" required onChange={e => setFile(e.target.files[0])} className="hidden" />
                                        {file ? (
                                            <div className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                                                <CheckCircle size={18} /> {file.name.length > 20 ? file.name.slice(0, 20) + '...' : file.name}
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={22} className="text-gray-400" />
                                                <p className="text-sm text-gray-400 font-medium">Click to upload screenshot</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                                <button type="submit" disabled={requestLoading} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
                                    {requestLoading ? <Clock size={16} className="animate-spin" /> : <Send size={16} />}
                                    {requestLoading ? 'Submitting...' : 'Submit Request'}
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
