import React, { useEffect, useState } from 'react';
import api from '../api';
import { PlusCircle, Calendar, BookOpen, IndianRupee, Trash2 } from 'lucide-react';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [scheduledTimes, setScheduledTimes] = useState({});

    const fetchCourses = async () => {
        try {
            const { data } = await api.get('/courses');
            setCourses(data);
        } catch (error) {
            console.error('Error fetching courses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/courses', { title, description, price });
            setTitle('');
            setDescription('');
            setPrice(0);
            fetchCourses();
            alert('Course created successfully! 🚀');
        } catch (error) {
            alert('Error creating course');
        }
    };

    const handleSchedule = async (courseId) => {
        try {
            const time = scheduledTimes[courseId];
            if (!time) return alert('Please select a time');

            await api.post('/live/start', { courseId, scheduledTime: time });
            alert('Class scheduled successfully! 📡');
        } catch (error) {
            alert('Error scheduling class');
        }
    };

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-10 animate-fade-in space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mission Catalog</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Architect & Manage Your Educational content</p>
                </div>
            </div>

            {/* Create Course Form */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <PlusCircle className="text-blue-600" />
                    Forge New Course
                </h2>
                <form onSubmit={handleCreate} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Course Designation</label>
                            <input
                                required
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none"
                                placeholder="e.g. Full Stack Web Development"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Mission Intelligence (Description)</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none resize-none"
                                placeholder="Describe the mission outcomes..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Access Credit (Price In ₹)</label>
                            <div className="relative">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IndianRupee size={18} />
                                </span>
                                <input
                                    type="number"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-600 transition-all font-bold outline-none"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95 uppercase tracking-widest">
                                Finalize & Launch Course
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Existing Courses */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-900 px-2 flex items-center gap-3">
                    <BookOpen size={24} className="text-indigo-600" />
                    Operational Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => (
                        <div key={course._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:border-indigo-200 transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    <h3 className="font-black text-xl text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                                    <p className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full w-fit">
                                        ₹{course.price} Access
                                    </p>
                                </div>
                                <button className="p-3 text-red-100 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2">{course.description}</p>

                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar size={12} /> Schedule Class
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="datetime-local"
                                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:border-indigo-500 outline-none transition-all shadow-inner"
                                            onChange={(e) => setScheduledTimes({ ...scheduledTimes, [course._id]: e.target.value })}
                                        />
                                        <button
                                            onClick={() => handleSchedule(course._id)}
                                            className="px-6 bg-slate-900 text-white font-black rounded-xl hover:bg-black transition-all text-[10px] uppercase tracking-widest shadow-lg active:scale-95"
                                        >
                                            Set 📡
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;
