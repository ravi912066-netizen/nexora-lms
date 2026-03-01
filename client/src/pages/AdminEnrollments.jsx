import React, { useEffect, useState } from 'react';
import api from '../api';
import { CheckCircle, XCircle, Clock, ExternalLink, CreditCard, User, BookOpen } from 'lucide-react';

const AdminEnrollments = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/enrollments/admin/pending');
            setRequests(data);
        } catch (error) {
            console.error('Error fetching enrollment requests', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/enrollments/admin/status/${id}`, { status });
            alert(`Enrollment ${status}!`);
            fetchRequests();
        } catch (error) {
            alert('Status update fail ho gaya');
        }
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;

    return (
        <div className="animate-fade-in max-w-6xl mx-auto p-4 sm:p-10">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mission Access Control</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                        <CreditCard size={14} className="text-blue-500" /> Verify Payments & Unlock Courses
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {requests.map(req => (
                    <div key={req._id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-8 items-center">
                        {/* Course & Student Info */}
                        <div className="flex-1 space-y-4 w-full">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <BookOpen size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{req.course?.title}</h3>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Enrollment Request</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</p>
                                    <div className="flex items-center gap-2 font-bold text-slate-700">
                                        <User size={14} className="text-blue-500" />
                                        {req.student?.name}
                                    </div>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Charged</p>
                                    <p className="font-black text-indigo-600 text-lg">₹{req.course?.price}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                                <p className="font-mono text-xs font-bold text-slate-600 select-all">{req.transactionId || 'NOT PROVIDED'}</p>
                            </div>
                        </div>

                        {/* Payment Screenshot */}
                        <div className="w-full lg:w-64 h-48 bg-slate-100 rounded-3xl overflow-hidden relative group border-2 border-dashed border-slate-200">
                            {req.paymentScreenshot ? (
                                <>
                                    <img src={req.paymentScreenshot} alt="Payment" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <a
                                        href={req.paymentScreenshot}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest"
                                    >
                                        <ExternalLink size={20} className="mb-1 mr-2" /> View Full Proof
                                    </a>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold text-center p-4 uppercase tracking-widest">
                                    No Proof Uploaded
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full lg:w-48">
                            <button
                                onClick={() => handleStatusUpdate(req._id, 'approved')}
                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={16} /> Approve Access
                            </button>
                            <button
                                onClick={() => handleStatusUpdate(req._id, 'rejected')}
                                className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle size={16} /> Deny Request
                            </button>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">All Clear, Ravi Bhai!</h3>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2">No pending course requests at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEnrollments;
