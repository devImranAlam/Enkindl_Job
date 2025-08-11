import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa';
import JobFormModal from './JobFormModal';
import ConfirmModal from './ConfirmModal';
import { deleteJob, fetchJobs } from '../redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isOwner = user?.role === 'admin' || job?.postedBy === user?._id;

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDelete = async () => {
        await dispatch(deleteJob(job._id));
        dispatch(fetchJobs()); // Refresh job list
        setIsConfirmOpen(false);
    };

    return (
        <>
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition">
                <h2 className="text-xl font-semibold text-indigo-600">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{job.description}</p>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{job.type}</span>

                    {user?.role === 'job_seeker' && (
                        <div className="flex gap-3 text-sm">
                            {/* View Details Button */}
                            <button
                                onClick={() => navigate(`/job-details/${job._id}`)}
                                className="text-indigo-600 hover:underline"
                            >
                                View Details
                            </button>
                            <button onClick={() => navigate(`/apply/${job._id}`)} className="btn-primary text-sm px-3 py-1">
                                Apply
                            </button>
                        </div>
                    )}

                    {isOwner && (
                        <div className="flex gap-3 text-sm">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="text-red-600 hover:underline flex items-center gap-1"
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditOpen && (
                <JobFormModal
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    initialData={job}
                    isEditMode
                />
            )}

            {/* Delete Confirmation Modal */}
            {isConfirmOpen && (
                <ConfirmModal
                    title="Delete Job"
                    message="Are you sure you want to delete this job? This action cannot be undone."
                    onCancel={() => setIsConfirmOpen(false)}
                    onConfirm={handleDelete}
                />
            )}
        </>
    );
};

export default JobCard;