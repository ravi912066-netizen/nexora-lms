import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trophy, BookOpen, CheckCircle, TrendingUp, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-xl ${colorClass} text-white mr-5 shadow-sm`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const StudentDashboard = () => {
    const { user } = useAuth();
    const [performance, setPerformance] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [perfRes, coursesRes] = await Promise.all([
                    axios.get('http://localhost:5001/api/performance/me', config),
                    axios.get('http://localhost:5001/api/courses', config)
                ]);

                setPerformance(perfRes.data);
                setCourses(coursesRes.data.slice(0, 3)); // Just top 3 for dashboard
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6"><div className="h-24 bg-slate-200 rounded-xl col-span-1" /></div>
    </div>;

    return (
        <div className="space-y-8 animate-fade-in text-slate-800">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 shadow-lg">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                    <p className="text-blue-100 max-w-xl text-lg">You've earned {performance?.totalXP || 0} XP so far. Keep up the great work and keep learning!</p>
                    <button className="mt-6 px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                        Resume Learning
                    </button>
                </div>
                {/* Decorative elements */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"></div>
                <div className="absolute right-32 bottom-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl transform translate-y-1/2"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total XP" value={performance?.totalXP || 0} icon={Trophy} colorClass="bg-gradient-to-br from-amber-400 to-orange-500" />
                <StatCard title="Lectures Watched" value={performance?.lecturesCompleted?.length || 0} icon={PlayCircle} colorClass="bg-gradient-to-br from-sky-400 to-blue-600" />
                <StatCard title="Assignments Done" value={performance?.assignmentsCompleted || 0} icon={CheckCircle} colorClass="bg-gradient-to-br from-emerald-400 to-green-600" />
                <StatCard title="Current Streak" value="3 Days" icon={TrendingUp} colorClass="bg-gradient-to-br from-purple-400 to-indigo-600" />
            </div>

            {/* Recent Courses section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recent Courses</h2>
                    <Link to="/courses" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-transform hover:-translate-y-1 group">
                            <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-100 relative group-hover:opacity-90 transition-opacity">
                                {/* Placeholder for Course Image */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                    <BookOpen size={48} opacity={0.5} />
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-lg mb-2 text-slate-800 line-clamp-1">{course.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{course.description}</p>
                                <div className="flex items-center text-sm font-medium text-blue-600 mt-2 hover:underline">
                                    <Link to={`/courses/${course._id}`}>Continue Course &rarr;</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <p className="text-slate-500 col-span-3 text-center py-8">No courses available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
