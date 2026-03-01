import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, FileText, BarChart2, Calendar, LogOut, Menu, X, BrainCircuit, Users } from 'lucide-react';
import clsx from 'clsx';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.role === 'admin';

    const studentLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'My Courses', icon: BookOpen, path: '/courses' },
        { name: 'Assignments', icon: FileText, path: '/assignments' },
        { name: 'Leaderboard', icon: BarChart2, path: '/leaderboard' },
        { name: 'Calendar', icon: Calendar, path: '/calendar' },
    ];

    const adminLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Manage Courses', icon: BookOpen, path: '/admin/courses' },
        { name: 'Assignments', icon: FileText, path: '/admin/assignments' },
        { name: 'Students', icon: Users, path: '/admin/students' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static top-0 left-0 z-30 h-screen w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col shadow-sm",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <BrainCircuit className="text-blue-600 mr-2" size={28} />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">Nexora</span>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon;
                        // Simplistic active check
                        const isActive = window.location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "flex items-center px-4 py-3 text-sm rounded-xl transition-all",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon size={18} className={clsx("mr-3", isActive ? "text-blue-600" : "text-slate-400")} />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={18} className="mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shadow-sm">
                    <button
                        className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center space-x-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
