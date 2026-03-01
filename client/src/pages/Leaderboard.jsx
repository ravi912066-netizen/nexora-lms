import React, { useEffect, useState } from 'react';
import api from '../api';
import { Trophy, Flame, Star, Medal, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
    const { user } = useAuth();
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/performance/leaderboard');
                setLeaders(data);
            } catch (error) {
                console.error('Error fetching leaderboard', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const rankColors = ['bg-amber-100 text-amber-600 border-amber-300', 'bg-gray-100 text-gray-600 border-gray-300', 'bg-orange-100 text-orange-600 border-orange-300'];
    const rankIcons = ['🥇', '🥈', '🥉'];
    const avatarColors = [
        'from-violet-500 to-purple-600', 'from-blue-500 to-cyan-500',
        'from-emerald-500 to-teal-600', 'from-orange-500 to-amber-500',
        'from-pink-500 to-rose-600', 'from-indigo-500 to-blue-600',
    ];

    return (
        <div className="p-6 sm:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
                    <Trophy size={32} className="text-amber-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Global Leaderboard</h1>
                <p className="text-gray-500 mt-2">Compete. Learn. Earn XP. Rise to the top.</p>
            </div>

            {/* Top 3 Podium */}
            {leaders.length >= 3 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[leaders[1], leaders[0], leaders[2]].map((leader, i) => {
                        const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
                        const isFirst = realRank === 1;
                        return (
                            <div key={leader._id} className={`flex flex-col items-center p-5 rounded-2xl border-2 ${isFirst ? 'bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-xl scale-105' : 'bg-white border-gray-100 shadow-sm'}`}>
                                <span className="text-3xl mb-2">{rankIcons[realRank - 1]}</span>
                                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarColors[realRank]} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-3`}>
                                    {leader.studentId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <p className="font-semibold text-gray-900 text-sm text-center truncate w-full">{leader.studentId?.name || 'Student'}</p>
                                <div className="mt-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {leader.totalXP} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Full Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">All Rankings</h2>
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{leaders.length} students</span>
                </div>

                {loading ? (
                    <div className="p-10 space-y-4">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : leaders.length === 0 ? (
                    <div className="p-10 text-center text-gray-400">
                        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                        <p>No rankings yet. Start completing assignments!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {leaders.map((leader, index) => {
                            const isCurrentUser = leader.studentId?._id === user?._id || leader.studentId?.email === user?.email;
                            return (
                                <div key={leader._id} className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${isCurrentUser ? 'bg-blue-50/50' : ''}`}>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold border ${index < 3 ? rankColors[index] : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                                        {index < 3 ? rankIcons[index] : index + 1}
                                    </div>
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                        {leader.studentId?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {leader.studentId?.name || 'Anonymous'} {isCurrentUser && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full ml-1">You</span>}
                                        </p>
                                        <p className="text-xs text-gray-400">{leader.assignmentsCompleted || 0} assignments • {leader.lecturesCompleted?.length || 0} lectures</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Flame size={14} className="text-orange-400" />
                                        <span className="font-bold text-gray-900">{leader.totalXP}</span>
                                        <span className="text-xs text-gray-400">XP</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
