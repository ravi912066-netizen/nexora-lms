import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, BookOpen, TrendingUp, BarChart } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5001/api/performance/analytics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(data);
            } catch (error) {
                console.error('Error fetching admin analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
                <p className="text-slate-500 mt-2">Platform analytics and management dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 rounded-xl bg-blue-100 text-blue-600 mr-5">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Students</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats?.totalStudents || 0}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600 mr-5">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Staff</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats?.totalAdmins || 0}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 rounded-xl bg-emerald-100 text-emerald-600 mr-5">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Platform XP Earned</p>
                        <h3 className="text-2xl font-bold text-slate-800">{stats?.totalGlobalXP || 0}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
                    <div className="p-4 rounded-xl bg-purple-100 text-purple-600 mr-5">
                        <BarChart size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Active Courses</p>
                        <h3 className="text-2xl font-bold text-slate-800">View Catalog</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button className="flex items-center justify-center py-4 rounded-xl border-2 border-dashed border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors font-semibold">
                        + Create New Course
                    </button>
                    <button className="flex items-center justify-center py-4 rounded-xl border-2 border-dashed border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors font-semibold">
                        + Add Assignment
                    </button>
                    <button className="flex items-center justify-center py-4 rounded-xl border-2 border-dashed border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold">
                        View Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
