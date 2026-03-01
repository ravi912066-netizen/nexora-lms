import React, { useEffect, useState } from 'react';
import api from '../../api';
import { ExternalLink, Code, Star, Target, Zap, Award, TrendingUp } from 'lucide-react';

const CodingStats = ({ codeforcesHandle, leetcodeHandle, gfgHandle }) => {
    const [cfStats, setCfStats] = useState(null);
    const [lcStats, setLcStats] = useState(null);
    const [cfLoading, setCfLoading] = useState(false);
    const [lcLoading, setLcLoading] = useState(false);

    useEffect(() => {
        if (codeforcesHandle && codeforcesHandle.length > 2) {
            setCfLoading(true);
            api.get(`/auth/coding-stats/${codeforcesHandle}/codeforces`)
                .then(r => setCfStats(r.data))
                .catch(() => setCfStats({ error: true }))
                .finally(() => setCfLoading(false));
        }
    }, [codeforcesHandle]);

    useEffect(() => {
        if (leetcodeHandle && leetcodeHandle.length > 2) {
            setLcLoading(true);
            api.get(`/auth/coding-stats/${leetcodeHandle}/leetcode`)
                .then(r => setLcStats(r.data))
                .catch(() => setLcStats({ error: true }))
                .finally(() => setLcLoading(false));
        }
    }, [leetcodeHandle]);

    const cfRankColors = {
        'newbie': 'text-gray-500',
        'pupil': 'text-green-500',
        'specialist': 'text-cyan-500',
        'expert': 'text-blue-500',
        'candidate master': 'text-purple-500',
        'master': 'text-orange-500',
        'international master': 'text-orange-600',
        'grandmaster': 'text-red-500',
        'international grandmaster': 'text-red-600',
        'legendary grandmaster': 'text-red-700',
    };

    if (!codeforcesHandle && !leetcodeHandle && !gfgHandle) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Code size={18} className="text-blue-500" /> Coding Profiles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Codeforces */}
                {codeforcesHandle && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Code size={16} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Codeforces</p>
                                    <p className="text-sm font-semibold text-blue-700">@{codeforcesHandle}</p>
                                </div>
                            </div>
                            <a href={`https://codeforces.com/profile/${codeforcesHandle}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-600">
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        {cfLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 bg-blue-100 rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-blue-100 rounded animate-pulse w-1/2" />
                            </div>
                        ) : cfStats && !cfStats.error ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Star size={14} className="text-amber-500" />
                                        <span className="text-xs text-gray-500">Rating</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{cfStats.rating || 'Unrated'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp size={14} className="text-blue-500" />
                                        <span className="text-xs text-gray-500">Max Rating</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{cfStats.maxRating || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Target size={14} className="text-green-500" />
                                        <span className="text-xs text-gray-500">Solved</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{cfStats.solved}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <Award size={14} className="text-purple-500" />
                                        <span className="text-xs text-gray-500">Rank</span>
                                    </div>
                                    <span className={`text-xs font-bold capitalize ${cfRankColors[cfStats.rank?.toLowerCase()] || 'text-gray-700'}`}>
                                        {cfStats.rank || 'Unranked'}
                                    </span>
                                </div>
                            </div>
                        ) : cfStats?.error ? (
                            <p className="text-xs text-gray-400">Could not fetch stats</p>
                        ) : (
                            <p className="text-xs text-gray-400">Enter handle to see stats</p>
                        )}
                    </div>
                )}

                {/* LeetCode */}
                {leetcodeHandle && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                                    <Zap size={16} className="text-white" fill="white" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">LeetCode</p>
                                    <p className="text-sm font-semibold text-amber-700">@{leetcodeHandle}</p>
                                </div>
                            </div>
                            <a href={`https://leetcode.com/${leetcodeHandle}`} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-600">
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        {lcLoading ? (
                            <div className="space-y-2">
                                <div className="h-4 bg-amber-100 rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-amber-100 rounded animate-pulse w-1/2" />
                            </div>
                        ) : lcStats && !lcStats.error ? (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Total Solved</span>
                                    <span className="font-bold text-gray-900">{lcStats.totalSolved}</span>
                                </div>
                                <div className="flex gap-3 mt-2">
                                    <span className="flex-1 text-center text-xs py-1.5 px-2 rounded-lg bg-green-100 text-green-700 font-semibold">
                                        Easy: {lcStats.easySolved}
                                    </span>
                                    <span className="flex-1 text-center text-xs py-1.5 px-2 rounded-lg bg-amber-100 text-amber-700 font-semibold">
                                        Med: {lcStats.mediumSolved}
                                    </span>
                                    <span className="flex-1 text-center text-xs py-1.5 px-2 rounded-lg bg-red-100 text-red-700 font-semibold">
                                        Hard: {lcStats.hardSolved}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">Global Rank</span>
                                    <span className="font-bold text-gray-900">#{lcStats.ranking?.toLocaleString() || 'N/A'}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">Enter handle to see stats</p>
                        )}
                    </div>
                )}

                {/* GFG */}
                {gfgHandle && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">GFG</div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">GeeksForGeeks</p>
                                    <p className="text-sm font-semibold text-green-700">@{gfgHandle}</p>
                                </div>
                            </div>
                            <a href={`https://auth.geeksforgeeks.org/user/${gfgHandle}`} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-600">
                                <ExternalLink size={14} />
                            </a>
                        </div>
                        <p className="text-xs text-gray-500">View profile on GFG →</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodingStats;
