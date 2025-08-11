import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaDownload, FaExternalLinkAlt } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { fetchUserApplications } from '../redux/applicationSlice';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    shortlisted: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const MyApplications = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userApplications, loading } = useSelector((state) => state.applications);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        dispatch(fetchUserApplications());
    }, [dispatch]);

    const filteredApplications = userApplications.filter(app => {
        var titleMatch;
        var companyMatch;
        if (app.jobId) {
            titleMatch = app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase());
            companyMatch = app.jobId.company.toLowerCase().includes(searchTerm.toLowerCase());
        }
        else {
            titleMatch = "Job has been deleted".includes(searchTerm.toLowerCase());
            companyMatch = "Job has been deleted".toLowerCase().includes(searchTerm.toLowerCase());
        }
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        return (titleMatch || companyMatch) && statusMatch;
    });

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">📄 My Applications</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by job title or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-1/4 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading your applications...</p>
            ) : filteredApplications.length === 0 ? (
                <p className="text-gray-500">No applications match your search.</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {filteredApplications.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300"
                        >
                            {/* Job Info */}
                            <div>
                                <h3 className={`text-xl font-semibold ${app.jobId ? "text-indigo-700" : "text-red-700"}`}>{app.jobId ? app.jobId.title : "Job has been deleted"}</h3>
                                <p className="text-gray-600">{app.jobId ? app.jobId.company : "Job has been deleted"}</p>
                                <p className="text-sm text-gray-500">
                                    Applied {formatDistanceToNow(new Date(app.createdAt))} ago
                                </p>
                            </div>

                            {/* Status */}
                            <div className="mt-3">
                                <span
                                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusColors[app.status]}`}
                                >
                                    {app.status.toUpperCase()}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex justify-between items-center">
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
                                    View Details <FaExternalLinkAlt className="text-xs" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;