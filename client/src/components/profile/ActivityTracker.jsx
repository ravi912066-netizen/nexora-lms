import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Trophy, Flame, Loader2 } from 'lucide-react';
import api from '../../api';
import clsx from 'clsx';

const ActivityTracker = ({ studentId }) => {
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const endpoint = studentId ? `/performance/admin/student/${studentId}` : '/performance/me';
                const [perfRes, leaderRes] = await Promise.all([
                    api.get(endpoint),
                    api.get('/performance/leaderboard')
                ]);

                // Admin endpoint returns { user, performance, assignments }
                const perfData = studentId ? perfRes.data.performance : perfRes.data;
                setStats(perfData);
                setLeaderboard(leaderRes.data.slice(0, 3));
            } catch (err) {
                console.error('Error fetching activity stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [studentId]);

    const generateRealHeatmap = () => {
        if (!stats || !stats.activityLogs) return [];

        const weeks = [];
        const today = new Date();

        // Activity logs are "YYYY-MM-DD" strings
        const logs = new Set(stats.activityLogs);

        // We want to show the last 52 weeks ending today
        // Start from 364 days ago
        let currentDate = new Date();
        currentDate.setDate(today.getDate() - 364);

        // Align to the start of a week (e.g. Monday)
        const dayOfWeek = currentDate.getDay(); // 0 is Sunday
        const diff = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // diff from Monday
        currentDate.setDate(currentDate.getDate() - diff);

        for (let i = 0; i < 53; i++) {
            const days = [];
            for (let j = 0; j < 7; j++) {
                const dateStr = currentDate.toISOString().split('T')[0];
                const active = logs.has(dateStr);
                days.push(active ? 4 : 0);
                currentDate.setDate(currentDate.getDate() + 1);
                if (currentDate > today && i === 52) break;
            }
            weeks.push(days);
        }
        return weeks;
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20 text-slate-400">
            <Loader2 className="animate-spin mr-2" />
            <span className="font-black uppercase tracking-widest text-xs">Syncing Performance Data...</span>
        </div>
    );

    const heatmap = generateRealHeatmap();
    const activeDaysCount = stats?.activityLogs?.length || 0;
    const currentStreak = stats?.currentStreak || 0;
    const maxStreak = stats?.longestStreak || 0;
    const totalXP = stats?.totalXP || 0;

    // Calendar for current month
    const currentDate = new Date();
    const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const emptySlots = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    return (
        <div className="space-y-6 animate-fade-in mt-10">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Flame className="text-amber-500" /> Performance Activity
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Heatmap Section */}
                <div className="lg:col-span-3 bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold">{activeDaysCount} Active days</h3>
                            <button className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">
                                Real-time
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1"><Flame size={14} className="text-amber-500" /> All-Time Max: {maxStreak}</span>
                        </div>
                    </div>

                    {/* Graph */}
                    <div className="overflow-x-auto custom-scrollbar relative z-10">
                        <div className="flex gap-1.5 min-w-max pb-4">
                            {heatmap.map((week, wIndex) => (
                                <div key={wIndex} className="flex flex-col gap-1.5">
                                    {week.map((intensity, dIndex) => (
                                        <div
                                            key={`${wIndex}-${dIndex}`}
                                            className={clsx(
                                                "w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer",
                                                intensity === 0 && "bg-slate-800/50",
                                                intensity === 4 && "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]",
                                            )}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 text-xs font-bold text-slate-500 relative z-10">
                        <span>{totalXP} Total XP Earned</span>
                        <div className="flex items-center gap-2">
                            <span>Inactive</span>
                            <div className="flex gap-1">
                                <span className="w-3 h-3 rounded-sm bg-slate-800/50"></span>
                                <span className="w-3 h-3 rounded-sm bg-emerald-400"></span>
                            </div>
                            <span>Active</span>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Streak and Leaderboard Details */}
                <div className="space-y-6">
                    {/* Visit Streak Calendar */}
                    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl">
                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl mb-6">
                            <div className="text-center w-1/2 border-r border-slate-200">
                                <p className="text-[10px] font-black uppercase text-slate-400">Current Streak</p>
                                <p className="text-lg font-black text-slate-900">{currentStreak} day(s)</p>
                            </div>
                            <div className="text-center w-1/2">
                                <p className="text-[10px] font-black uppercase text-slate-400">Longest Streak</p>
                                <p className="text-lg font-black text-amber-600">{maxStreak} days</p>
                            </div>
                        </div>

                        <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <CalendarIcon size={16} /> {monthName} {year}
                        </h4>

                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
                            <span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span><span>SU</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: emptySlots }).map((_, i) => (
                                <div key={`empty-${i}`} className="w-8 h-8"></div>
                            ))}
                            {currentMonthDays.map(day => {
                                const dateStr = new Date(year, currentDate.getMonth(), day).toISOString().split('T')[0];
                                const isActive = stats?.activityLogs?.includes(dateStr);
                                const isToday = day === new Date().getDate();
                                return (
                                    <div
                                        key={day}
                                        className={clsx(
                                            "w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all",
                                            isToday ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110" :
                                                isActive ? "bg-emerald-100 text-emerald-700 font-black" :
                                                    "text-slate-600"
                                        )}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mini Leaderboard Spotlight */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                        <h4 className="font-bold mb-4 flex items-center justify-between z-10 relative">
                            Leaderboard <Trophy size={16} className="text-amber-400" />
                        </h4>
                        <div className="space-y-3 z-10 relative">
                            {leaderboard.map((person, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-8 h-8 rounded-full border-2 bg-gradient-to-tr from-slate-800 flex items-center justify-center font-bold text-xs",
                                            idx === 0 ? "border-yellow-400" : idx === 1 ? "border-slate-300" : "border-amber-700"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{person.studentId?.name || 'Anonymous'}</span>
                                    </div>
                                    <div className="text-amber-400 text-xs font-black flex items-center gap-1">
                                        <Flame size={12} /> {person.totalXP}
                                    </div>
                                </div>
                            ))}
                            {leaderboard.length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-2">No active leaders yet.</p>
                            )}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityTracker;
