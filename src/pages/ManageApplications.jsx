import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchRecruiterApplications,
    updateApplicationStatus,
    fetchAdminApplications
} from '../redux/applicationSlice';
import toast from 'react-hot-toast';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    shortlisted: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const ManageApplications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { applications, loading, error } = useSelector((state) => state.applications);
    const { user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobFilter, setJobFilter] = useState('all');

    useEffect(() => {
        if (user?.role == "admin") {
            dispatch(fetchAdminApplications());
        }
        else {
            dispatch(fetchRecruiterApplications());
        }
    }, [dispatch]);

    const handleStatusChange = async (id, status) => {
        try {
            await dispatch(updateApplicationStatus({ id, status })).unwrap();
            toast.success(`Application marked as ${status}`);
        } catch {
            toast.error('Failed to update status');
        }
    };

    // Unique job titles for filtering
    const jobTitles = [...new Set(applications.map(app => app.jobId?.title || ''))];

    const filteredApps = applications.filter(app => {
        const nameMatch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = app.email.toLowerCase().includes(searchTerm.toLowerCase());
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        var jobMatch;
        if (app.jobId) {
            jobMatch = jobFilter === 'all' || app.jobId?.title === jobFilter;
        }
        else {
            jobMatch = jobFilter === 'all' || "Job has been deleted" === jobFilter;
        }
        return (nameMatch || emailMatch) && statusMatch && jobMatch;
    });

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">🧑‍💼 Manage Applications</h2>

            {/* Filters */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>

                {jobTitles.length > 1 && (
                    <select
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2"
                    >
                        <option value="all">All Jobs</option>
                        {jobTitles.map(title => (
                            <option key={title} value={title}>{title}</option>
                        ))}
                    </select>
                )}
            </div>

            {/* Application Cards */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : filteredApps.length === 0 ? (
                <p className="text-gray-500">No applications found.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredApps.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg space-y-2 transition-all duration-300"
                        >
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">{app.name}</h3>
                                    <p className="text-sm text-gray-500">{app.email}</p>
                                </div>
                                <span
                                    className={`text-xs px-3 py-3 rounded-full font-semibold ${statusColors[app.status]}`}
                                >
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm">
                                For: <span className={`font-medium ${app.jobId ? "" : "text-red-500"}`}>{app.jobId ? app.jobId.title : "Job has been deleted"}</span>
                            </p>

                            <div className="flex justify-between items-center mt-3">
                                <a
                                    href={`${import.meta.env.VITE_API_RESUME_URL}/${app.resume}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline text-sm flex items-center gap-2"
                                >
                                    <FaDownload /> Resume
                                </a>

                                <button
                                    onClick={() => navigate(`/application/${app._id}`)}
                                    className={`text-sm flex items-center gap-1 hover:underline ${app.jobId ? "text-blue-600 hover:cursor-pointer" : "text-red-700 line-through hover:opacity-0 hover:cursor-not-allowed"}`} disabled={app.jobId ? false : true}>
                                    View <FaExternalLinkAlt className="text-xs" />
                                </button>
                            </div>

                            <div className="flex gap-2 mt-4 justify-end">
                                {['shortlisted', 'accepted', 'rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(app._id, status)}
                                        className={`text-xs px-3 py-1 rounded-full font-medium transition ${statusColors[status]} hover:opacity-90 hover:cursor-pointer`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageApplications;