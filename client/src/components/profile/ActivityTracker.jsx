import React from 'react';
import { Calendar as CalendarIcon, Trophy, Flame } from 'lucide-react';
import clsx from 'clsx';

const ActivityTracker = () => {
    // Generate mock heatmap data (365 days)
    const activeDays = Math.floor(Math.random() * 50) + 20;
    const maxStreak = Math.floor(Math.random() * 15) + 5;
    const currentStreak = Math.floor(Math.random() * 5) + 1;

    const generateHeatmap = () => {
        const weeks = [];
        for (let i = 0; i < 52; i++) {
            const days = [];
            for (let j = 0; j < 7; j++) {
                const intensity = Math.random() > 0.8 ? Math.floor(Math.random() * 4) + 1 : 0;
                days.push(Math.random() > 0.95 ? 0 : intensity); // Random gaps
            }
            weeks.push(days);
        }
        return weeks;
    };

    const heatmap = generateHeatmap();

    // Mock Calendar for current month
    const currentMonthDays = Array.from({ length: 31 }, (_, i) => i + 1);

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
                            <h3 className="text-xl font-bold">{activeDays} Active days</h3>
                            <button className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-slate-300 hover:text-white transition-colors">
                                Global
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                            <span className="flex items-center gap-1"><Flame size={14} className="text-amber-500" /> Max Streak: {maxStreak}</span>
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
                                                intensity === 1 && "bg-emerald-900",
                                                intensity === 2 && "bg-emerald-700",
                                                intensity === 3 && "bg-emerald-500",
                                                intensity === 4 && "bg-emerald-400",
                                            )}
                                        ></div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 text-xs font-bold text-slate-500 relative z-10">
                        <span>{activeDays * 3} problems solved this year</span>
                        <div className="flex items-center gap-2">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <span className="w-3 h-3 rounded-sm bg-slate-800/50"></span>
                                <span className="w-3 h-3 rounded-sm bg-emerald-900"></span>
                                <span className="w-3 h-3 rounded-sm bg-emerald-700"></span>
                                <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
                                <span className="w-3 h-3 rounded-sm bg-emerald-400"></span>
                            </div>
                            <span>More</span>
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
                            <CalendarIcon size={16} /> March 2026
                        </h4>

                        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
                            <span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span><span>SU</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: 2 }).map((_, i) => ( // Empty slots
                                <div key={`empty-${i}`} className="w-8 h-8"></div>
                            ))}
                            {currentMonthDays.map(day => {
                                const isActive = Math.random() > 0.7;
                                const isToday = day === new Date().getDate();
                                return (
                                    <div
                                        key={day}
                                        className={clsx(
                                            "w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all",
                                            isToday ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110" :
                                                isActive ? "bg-emerald-100 text-emerald-700 font-black cursor-pointer hover:bg-emerald-200" :
                                                    "text-slate-600 hover:bg-slate-100 cursor-pointer"
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
                            {[
                                { name: 'Rajat M.', score: 372, color: 'border-yellow-400' },
                                { name: 'Sohit S.', score: 360, color: 'border-slate-300' },
                                { name: 'Faizan I.', score: 345, color: 'border-amber-700' }
                            ].map((person, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx("w-8 h-8 rounded-full border-2 bg-gradient-to-tr from-slate-800 flex items-center justify-center font-bold text-xs", person.color)}>
                                            {idx + 1}
                                        </div>
                                        <span className="font-bold text-sm tracking-tight">{person.name}</span>
                                    </div>
                                    <div className="text-amber-400 text-xs font-black flex items-center gap-1">
                                        <Flame size={12} /> {person.score}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityTracker;
