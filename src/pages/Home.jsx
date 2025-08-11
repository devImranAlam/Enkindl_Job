import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import { fetchRecruiterApplications, fetchUserApplications } from '../redux/applicationSlice';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import RoleBased from '../components/RoleBased';
import JobCard from '../components/JobCard';
import JobSkeleton from '../components/JobSkeleton';
import { motion } from 'framer-motion';
import { FaBriefcase, FaClipboardList, FaUserCheck } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const Home = () => {
    const dispatch = useDispatch();
    const { jobs, loading } = useSelector((state) => state.jobs);
    const { applications, userApplications } = useSelector((state) => state.applications);
    const { user } = useSelector((state) => state.auth);

    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        dispatch(fetchJobs());
        if (user?.role === 'recruiter') dispatch(fetchRecruiterApplications());
        if (user?.role === 'job_seeker') dispatch(fetchUserApplications());
    }, [dispatch, user]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = `keyword=${keyword}&location=${location}`;
        dispatch(fetchJobs(query));
    };

    const filteredJobs =
        user?.role === 'recruiter'
            ? jobs.filter((job) => job.postedBy === user._id)
            : jobs;

    const recruiterStats = {
        Applied: applications.length,
        Shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
        Accepted: applications.filter((a) => a.status === 'accepted').length,
        Rejected: applications.filter((a) => a.status === 'rejected').length,
    };

    const seekerStats = {
        Applied: userApplications.length,
        Shortlisted: userApplications.filter((a) => a.status === 'shortlisted').length,
        Accepted: userApplications.filter((a) => a.status === 'accepted').length,
        Rejected: userApplications.filter((a) => a.status === 'rejected').length,
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-4xl font-bold text-indigo-700 mb-2">Welcome {user?.name} 👋</h1>
                <p className="text-gray-600 text-lg">Find your dream job or hire the best candidates.</p>
            </motion.div>

            {/* Role-Based Quick Actions */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <RoleBased roles={['job_seeker']}>
                    <Card title="Browse Jobs" icon={<FaBriefcase />} link="/jobs" />
                    <Card title="My Applications" icon={<FaClipboardList />} link="/my-applications" />
                </RoleBased>
                <RoleBased roles={['recruiter', 'admin']}>
                    <Card title="Manage Applications" icon={<FaClipboardList />} link="/manage-applications" />
                    <Card title="Dashboard" icon={<FaUserCheck />} link="/dashboard" />
                </RoleBased>
            </div>


            {/* Dashboard Charts for recruiter */}
            <RoleBased roles={['recruiter']}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto"
                >
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-6">📊 Application Overview</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <div className="h-64">
                            <Bar
                                data={{
                                    labels: Object.keys(recruiterStats),
                                    datasets: [
                                        {
                                            label: 'Applications',
                                            data: Object.values(recruiterStats),
                                            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444'],
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>

                        {/* Stats Section */}
                        <div className="flex flex-col gap-4">
                            {/* Full-width Total Job Posts */}
                            <StatCard
                                label="Total Job Posts"
                                count={jobs?.filter((job) => job.postedBy === user?._id).length || 0}
                                center
                            />

                            {/* 2x2 grid for other stats */}
                            <div className="grid grid-cols-2 gap-4">
                                {Object.entries(recruiterStats).map(([label, count]) => (
                                    <StatCard key={label} label={label} count={count} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </RoleBased>


            {/* Dashboard Charts for job_seeker */}
            <RoleBased roles={['job_seeker']}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow max-w-5xl mx-auto"
                >
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-6">📈 My Application Status</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Pie Chart */}
                        <div className="h-64">
                            <Pie
                                data={{
                                    labels: Object.keys(seekerStats),
                                    datasets: [
                                        {
                                            label: 'My Applications',
                                            data: Object.values(seekerStats),
                                            backgroundColor: ['#facc15', '#60a5fa', '#34d399', '#f87171'],
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                }}
                            />
                        </div>

                        {/* Stat Summary */}
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(seekerStats).map(([label, count]) => (
                                <StatCard key={label} label={label} count={count} />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </RoleBased>


            {/* Search Jobs */}
            <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">🔍 Search Jobs</h2>
                <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Keyword (e.g. frontend)"
                        className="border p-2 rounded"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Location (e.g. Delhi)"
                        className="border p-2 rounded"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md">
                        Search
                    </button>
                </form>

                {/* Job List */}
                {loading ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <JobSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <p className="text-gray-500">No jobs found.</p>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {filteredJobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Reusable Card Component
const Card = ({ title, icon, link }) => (
    <Link
        to={link}
        className="p-6 bg-white rounded-xl shadow hover:shadow-md transition border text-center group"
    >
        <div className="text-3xl text-indigo-600 mb-2">{icon}</div>
        <h3 className="text-lg font-medium text-gray-800 flex items-center justify-center gap-2">
            {title}
            <FiArrowRight className="text-indigo-500 text-base group-hover:translate-x-1 transition-transform duration-200" />
        </h3>
    </Link>
);


const statusColors = {
    Applied: 'bg-yellow-100 text-yellow-800',
    Shortlisted: 'bg-blue-100 text-blue-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};


const StatCard = ({ label, count, center }) => (
    <div
        className={`p-4 rounded-lg shadow-sm border ${statusColors[label] || 'bg-gray-100 text-gray-800'
            } ${center ? 'text-center' : ''}`}
    >
        <h4 className="text-sm font-medium">{label}</h4>
        <p className="text-xl font-bold">{count}</p>
    </div>
);



export default Home;