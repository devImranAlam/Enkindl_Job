import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const fetchJob = async () => {
        try {
            const { data } = await axiosInstance.get(`/jobs/${id}`);
            setJob(data);
        } catch (err) {
            toast.error('Job not found');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/jobs/${id}`);
            toast.success('Job deleted successfully');
            navigate('/jobs');
        } catch (err) {
            toast.error('Failed to delete job');
        }
    };

    const isOwner = user?.role === 'admin' || job?.postedBy === user?._id;

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <p className="text-gray-500">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <p className="text-red-500">Job not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold text-indigo-700 mb-4">{job.title}</h1>
            <p className="text-lg text-gray-600 mb-2">{job.company}</p>
            <p className="text-sm text-gray-500 mb-6">{job.location} · {job.type}</p>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Requirements</h3>
                <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Salary Range</h3>
                <p className="text-gray-700">{job.salary}</p>
            </div>

            <div className="flex items-center justify-between mt-8">
                {user?.role === 'job_seeker' && (
                    <Link
                        to={`/apply/${job._id}`}
                        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Apply Now
                    </Link>
                )}

                {isOwner && (
                    <div className="flex gap-4">
                        <Link
                            to={`/edit-job/${job._id}`}
                            className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                            <FaEdit /> Edit
                        </Link>
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="text-red-600 hover:underline flex items-center gap-1"
                        >
                            <FaTrash /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Popup */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-red-600">Confirm Deletion</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this job?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={() => setConfirmDelete(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;