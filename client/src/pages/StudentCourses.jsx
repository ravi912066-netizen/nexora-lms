import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, PlayCircle } from 'lucide-react';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get('http://localhost:5001/api/courses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    if (loading) return <div className="p-10 text-center"><div className="animate-spin text-blue-500 mx-auto w-8 h-8 rounded-full border-4 border-t-blue-500 border-blue-100"></div></div>;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Courses</h1>
                <p className="text-slate-500 mt-2">Explore the subjects you are enrolled in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course._id} className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100 transition-all hover:shadow-xl hover:-translate-y-1 group">
                        <div className="h-48 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[22px] p-6 relative overflow-hidden flex flex-col justify-end text-white">
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                                Course
                            </div>
                            {/* Decorative circle */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl mix-blend-overlay"></div>

                            <h3 className="text-2xl font-bold z-10 leading-tight mb-2 drop-shadow-sm">{course.title}</h3>
                        </div>
                        <div className="p-5">
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                            <div className="flex items-center justify-between mt-4 pb-2">
                                <div className="flex text-slate-400 text-sm items-center space-x-4">
                                    <span className="flex items-center"><BookOpen size={16} className="mr-1" /> Module</span>
                                </div>
                                <Link
                                    to={`/courses/${course._id}`}
                                    className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-4 py-2 flex items-center rounded-xl font-medium transition-colors"
                                >
                                    View Course
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 text-slate-300 mb-4">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No courses yet</h3>
                        <p className="text-slate-500 mt-2">Courses will appear here once an admin creates them.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentCourses;
