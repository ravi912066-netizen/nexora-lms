import React, { useEffect, useState } from 'react';
import api from '../api';
import { Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
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

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-10 mt-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-500 mb-4 shadow-inner">
                    <Trophy size={40} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">Global Leaderboard</h1>
                <p className="text-slate-500 mt-2 text-lg">Earn XP by completing assignments and quizzes</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center"><div className="animate-spin text-blue-500"><Trophy /></div></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                                <th className="py-4 px-6 font-medium">Rank</th>
                                <th className="py-4 px-6 font-medium">Student</th>
                                <th className="py-4 px-6 font-medium">Total XP</th>
                                <th className="py-4 px-6 font-medium">Assignments</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaders.map((leader, index) => (
                                <tr key={leader._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center font-bold text-lg text-slate-700">
                                            {index === 0 && <Medal className="text-amber-400 mr-2" fill="currentColor" size={24} />}
                                            {index === 1 && <Medal className="text-slate-400 mr-2" fill="currentColor" size={24} />}
                                            {index === 2 && <Medal className="text-amber-700 mr-2" fill="currentColor" size={24} />}
                                            {index > 2 && <span className="w-6 inline-block text-center mr-2">{index + 1}</span>}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3 shadow-sm">
                                                {leader.studentId?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <span className="font-medium text-slate-800">{leader.studentId?.name || 'Unknown Student'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                                            {leader.totalXP} XP
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-slate-600 font-medium">
                                        {leader.assignmentsCompleted}
                                    </td>
                                </tr>
                            ))}
                            {leaders.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-500">No data available on the leaderboard yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
