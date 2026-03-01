import React, { useEffect, useState } from 'react';
import api from '../api';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
            await api.post('/courses', { title, description });
            setTitle('');
            setDescription('');
            fetchCourses();
            alert('Course created successfully');
        } catch (error) {
            alert('Error creating course');
        }
    };

    const handleSchedule = async (courseId) => {
        try {
            const time = scheduledTimes[courseId];
            if (!time) return alert('Please select a time');

            await api.post('/live/start', { courseId, scheduledTime: time });
            alert('Class scheduled successfully!');
        } catch (error) {
            alert('Error scheduling class');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Courses</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <h2 className="text-xl font-bold mb-4">Create New Course</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Course Title</label>
                        <input
                            required
                            className="w-full px-4 py-2 border rounded-xl"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            required
                            className="w-full px-4 py-2 border rounded-xl"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
                        Create Course
                    </button>
                </form>
            </div>

            <h2 className="text-xl font-bold mb-4">Existing Courses</h2>
            <div className="space-y-4">
                {courses.map(course => (
                    <div key={course._id} className="p-5 flex items-center justify-between bg-white border border-slate-100 rounded-xl shadow-sm">
                        <div>
                            <h3 className="font-bold text-lg">{course.title}</h3>
                            <p className="text-slate-500">{course.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="datetime-local"
                                className="p-2 border rounded-lg text-sm"
                                onChange={(e) => setScheduledTimes({ ...scheduledTimes, [course._id]: e.target.value })}
                            />
                            <button
                                onClick={() => handleSchedule(course._id)}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-lg hover:bg-indigo-200 transition-all text-xs"
                            >
                                Schedule Class
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCourses;
