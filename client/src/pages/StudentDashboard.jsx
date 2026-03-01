import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Trophy, BookOpen, CheckCircle, Flame, PlayCircle, ArrowRight, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [performance, setPerformance] = useState(null);
    const [courses, setCourses] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [perfRes, coursesRes, leaderRes] = await Promise.all([
                    api.get('/performance/me'),
                    api.get('/courses'),
                    api.get('/performance/leaderboard'),
                ]);
                setPerformance(perfRes.data);
                setCourses(coursesRes.data.slice(0, 3));
                setLeaderboard(leaderRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getHour = () => new Date().getHours();
    const greeting = getHour() < 12 ? 'Good morning' : getHour() < 17 ? 'Good afternoon' : 'Good evening';

    const courseColors = [
        'from-violet-500 to-purple-600',
        'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-600',
        'from-orange-500 to-amber-500',
        'from-pink-500 to-rose-600',
    ];

    if (loading) return (
        <div className="p-8 space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
        </div>
    );

    return (
        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">

            {/* Welcome Hero */}
            <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 overflow-hidden text-white">
                <div className="relative z-10">
                    <p className="text-blue-200 text-sm font-medium mb-1">{greeting} 👋</p>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-blue-100 max-w-lg">
                        You've earned <span className="font-bold text-white">{performance?.totalXP || 0} XP</span> so far.
                        {performance?.currentStreak > 0 ? ` 🔥 ${performance.currentStreak} day streak!` : ' Start your streak today!'}
                    </p>
                    <Link to="/courses" className="inline-flex items-center gap-2 mt-5 bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                        Continue Learning <ArrowRight size={16} />
                    </Link>
                </div>
                <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                <div className="absolute right-24 bottom-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-1/2 blur-2xl" />
                {/* Trophy icon */}
                <div className="absolute right-8 bottom-4 opacity-20">
                    <Trophy size={120} />
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total XP', value: performance?.totalXP || 0, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', suffix: ' pts' },
                    { label: 'Lectures Watched', value: performance?.lecturesCompleted?.length || 0, icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50', suffix: '' },
                    { label: 'Assignments Done', value: performance?.assignmentsCompleted || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', suffix: '' },
                    { label: 'Current Streak', value: performance?.currentStreak || 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', suffix: ' days' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}{stat.suffix}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Courses + Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Courses */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Available Courses</h2>
                        <Link to="/courses" className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {courses.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
                            <p className="font-medium">No courses available yet</p>
                        </div>
                    ) : (
                        courses.map((course, idx) => (
                            <Link key={course._id} to={`/courses/${course._id}`} className="flex items-center gap-5 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-5 transition-all hover:shadow-md group">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${courseColors[idx % courseColors.length]} flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                                    <BookOpen size={22} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
                                    <p className="text-sm text-gray-500 truncate mt-0.5">{course.description}</p>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                            </Link>
                        ))
                    )}
                </div>

                {/* Leaderboard */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
                        <Link to="/leaderboard" className="text-xs text-blue-600 font-medium hover:underline">See all</Link>
                    </div>
                    <div className="space-y-3">
                        {leaderboard.length === 0 ? (
                            <p className="text-center text-gray-400 text-sm py-6">No data yet</p>
                        ) : leaderboard.map((entry, idx) => (
                            <div key={entry._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-gray-100 text-gray-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-500'}`}>
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                    {entry.studentId?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="font-medium text-sm text-gray-800 flex-1 truncate">
                                    {entry.studentId?.name || 'Anonymous'}
                                </span>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
                                    {entry.totalXP} XP
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
