import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, FileText, BarChart2, Calendar, LogOut, Menu, X, BrainCircuit, Users, User } from 'lucide-react';
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
        { name: 'Profile', icon: User, path: '/profile' }, // Added
    ];

    const adminLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Manage Courses', icon: BookOpen, path: '/admin/courses' },
        { name: 'Assignments', icon: FileText, path: '/admin/assignments' },
        { name: 'Students', icon: Users, path: '/admin/students' },
        { name: 'Profile', icon: User, path: '/profile' }, // Added
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static top-0 left-0 z-30 h-screen w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out flex flex-col shadow-sm",
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="h-20 flex items-center px-8 border-b border-slate-100">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-200">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">Nexora Edu</span>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <nav className="flex-1 py-10 px-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Command Center</p>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = window.location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={clsx(
                                    "flex items-center px-5 py-4 text-sm rounded-[1.5rem] transition-all duration-300 group",
                                    isActive
                                        ? "bg-blue-600 text-white font-black shadow-xl shadow-blue-100 translate-x-1"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                                )}
                            >
                                <Icon size={20} className={clsx("mr-4 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-500")} />
                                <span className="tracking-tight">{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-5 py-4 text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl transition-all duration-300 shadow-sm"
                    >
                        <LogOut size={16} className="mr-3" />
                        System Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10 z-10 shadow-sm">
                    <button
                        className="lg:hidden p-3 text-slate-500 hover:bg-slate-100 rounded-2xl transition-colors"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center gap-6">
                        <Link to="/profile" className="hidden sm:flex flex-col text-right group cursor-pointer">
                            <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{user?.name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role} Access</p>
                        </Link>
                        <Link to="/profile" className="relative group">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-all border-2 border-white ring-1 ring-slate-100">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-slate-50/50 custom-scrollbar">
                    <Outlet />
                </div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
            `}</style>
        </div>
    );
};

export default MainLayout;
