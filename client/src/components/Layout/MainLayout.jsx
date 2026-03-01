import React, { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, BookOpen, FileText, BarChart2, LogOut,
    Menu, X, Users, User, CreditCard, MessageSquare, Zap,
    ChevronRight, Bell, Search
} from 'lucide-react';
import AIDoubtAssistant from '../AIDoubtAssistant';
import clsx from 'clsx';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.role === 'admin';

    const studentLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'My Courses', icon: BookOpen, path: '/courses' },
        { name: 'Assignments', icon: FileText, path: '/assignments' },
        { name: 'Leaderboard', icon: BarChart2, path: '/leaderboard' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    const adminLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Manage Courses', icon: BookOpen, path: '/admin/courses' },
        { name: 'Enrollment Requests', icon: CreditCard, path: '/admin/enrollments' },
        { name: 'Student Doubts', icon: MessageSquare, path: '/admin/doubts' },
        { name: 'Assignments', icon: FileText, path: '/admin/assignments' },
        { name: 'Students', icon: Users, path: '/admin/students' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-[#F7F8FC] flex font-sans">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <Zap size={18} className="text-white" fill="white" />
                    </div>
                    <span className="text-lg font-bold text-gray-900">Nexora</span>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-1">
                    <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        {isAdmin ? 'Admin Controls' : 'Navigation'}
                    </p>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setSidebarOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all font-medium",
                                    active
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={18} className={active ? 'text-white' : 'text-gray-400'} />
                                <span>{link.name}</span>
                                {active && <ChevronRight size={14} className="ml-auto text-blue-200" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User info + logout */}
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                            {user?.profilePicture
                                ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                : user?.name?.charAt(0).toUpperCase()
                            }
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        <LogOut size={16} />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-72">
                            <Search size={16} className="text-gray-400" />
                            <input placeholder="Search courses, assignments..." className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-full" readOnly />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <Link to="/profile" className="flex items-center gap-3 pl-3 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</p>
                                <p className="text-xs text-gray-400 capitalize">{user?.role === 'admin' ? 'Admin' : 'Student'}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                                {user?.profilePicture
                                    ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                    : user?.name?.charAt(0).toUpperCase()
                                }
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </main>

            {!isAdmin && <AIDoubtAssistant />}
        </div>
    );
};

export default MainLayout;
