import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, BookOpen, TrendingUp, Zap, ArrowRight, Plus, BarChart3, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [analyticsRes, leaderRes] = await Promise.all([
                    api.get('/performance/analytics'),
                    api.get('/performance/leaderboard'),
                ]);
                setStats(analyticsRes.data);
                setLeaderboard(leaderRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching admin analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', link: '/admin/students' },
        { label: 'Platform Staff', value: stats?.totalAdmins || 0, icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', link: '/admin/students' },
        { label: 'Global XP Awarded', value: (stats?.totalGlobalXP || 0).toLocaleString(), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', link: '/leaderboard' },
        { label: 'Total Courses', value: 'Manage →', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', link: '/admin/courses' },
    ];

    const quickActions = [
        { label: 'Create Course', icon: BookOpen, path: '/admin/courses', color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100', border: 'border-blue-200' },
        { label: 'Add Assignment', icon: Plus, path: '/admin/assignments', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100', border: 'border-purple-200' },
        { label: 'View Students', icon: Users, path: '/admin/students', color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100', border: 'border-emerald-200' },
        { label: 'Enrollments', icon: UserCheck, path: '/admin/enrollments', color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100', border: 'border-orange-200' },
        { label: 'Doubts', icon: BarChart3, path: '/admin/doubts', color: 'text-pink-600', bg: 'bg-pink-50 hover:bg-pink-100', border: 'border-pink-200' },
        { label: 'Leaderboard', icon: TrendingUp, path: '/leaderboard', color: 'text-indigo-600', bg: 'bg-indigo-50 hover:bg-indigo-100', border: 'border-indigo-200' },
    ];

    const avatarColors = [
        'from-violet-500 to-purple-600', 'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-600', 'from-orange-500 to-amber-500',
        'from-pink-500 to-rose-600',
    ];

    if (loading) return (
        <div className="p-8 space-y-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
    );

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user?.name?.split(' ')[0]}. Here's your platform overview.</p>
                </div>
                <Link to="/admin/courses" className="hidden sm:flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                    <Plus size={16} /> New Course
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(stat => (
                    <Link key={stat.label} to={stat.link} className={`bg-white border ${stat.border} rounded-2xl p-5 hover:shadow-md transition-all group`}>
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                            <ArrowRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick actions */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {quickActions.map(action => (
                            <Link key={action.label} to={action.path} className={`flex flex-col items-center gap-3 p-5 rounded-2xl border border-dashed ${action.border} ${action.bg} transition-colors group`}>
                                <div className={`w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm ${action.color}`}>
                                    <action.icon size={20} />
                                </div>
                                <span className={`text-sm font-semibold ${action.color}`}>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Top learners */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900">Top Learners</h2>
                        <Link to="/leaderboard" className="text-xs text-blue-600 font-medium hover:underline">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {leaderboard.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-6">No activity yet</p>
                        ) : leaderboard.map((entry, idx) => (
                            <div key={entry._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50">
                                <span className="text-lg w-6 text-center">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}</span>
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColors[idx]} flex items-center justify-center text-white font-bold text-xs`}>
                                    {entry.studentId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <span className="font-medium text-sm text-gray-800 flex-1 truncate">{entry.studentId?.name || 'Student'}</span>
                                <span className="text-xs font-bold bg-amber-50 text-amber-600 px-2 py-1 rounded-lg">{entry.totalXP} XP</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
