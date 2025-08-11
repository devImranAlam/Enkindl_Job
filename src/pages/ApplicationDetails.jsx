import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../utils/axios';
import { updateApplicationStatus } from '../redux/applicationSlice';
import toast from 'react-hot-toast';
import { FaDownload, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    shortlisted: 'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

const ApplicationDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    const isRecruiter = user?.role === 'recruiter' || user?.role === 'admin';

    const fetchDetails = async () => {
        try {
            const res = await axiosInstance.get(`/apply/${id}`);
            setApplication(res.data);
        } catch (err) {
            toast.error('Failed to load application');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    const handleStatusChange = async (newStatus) => {
        try {
            await dispatch(updateApplicationStatus({ id, status: newStatus })).unwrap();
            toast.success(`Status updated to "${newStatus}"`);
            setApplication({ ...application, status: newStatus });
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return <div className="text-center mt-10 text-gray-500">Loading application details...</div>;
    }

    if (!application) {
        return <div className="text-center mt-10 text-red-500">Application not found.</div>;
    }

    if (!application.jobId) {
        return <div className="text-center mt-10 text-red-500">Job has been deleted for this Application.</div>;
    }

    const { jobId } = application;

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">📋 Application Details</h2>

            {/* Candidate Section */}
            <div className="border-b pb-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">👤 Candidate Info</h3>
                <p><span className="font-medium text-gray-600">Name:</span> {application.name}</p>
                <p><span className="font-medium text-gray-600">Email:</span> {application.email}</p>
                <p className="mt-2">
                    <span className="font-medium text-gray-600">Resume:</span>{' '}
                    <a
                        href={`${import.meta.env.VITE_API_RESUME_URL}/${application.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline flex items-center gap-2 text-sm"
                    >
                        <FaDownload /> Download Resume
                    </a>
                </p>
                <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusColors[application.status]}`}>
                        Status: {application.status.toUpperCase()}
                    </span>
                </div>

                {isRecruiter && (
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Change Status:</h4>
                        <div className="flex gap-3 flex-wrap">
                            {['shortlisted', 'accepted', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-4 py-2 text-sm rounded-md font-medium transition ${statusColors[status]} hover:opacity-90 hover:cursor-pointer`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Job Section */}
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">💼 Job Details</h3>
                <p className="text-indigo-700 text-lg font-semibold">{jobId.title}</p>
                <p className="text-gray-600 mb-1">{jobId.company}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1"><FaMapMarkerAlt /> {jobId.location}</span>
                    <span className="flex items-center gap-1"><FaBriefcase /> {jobId.type}</span>
                    <span className="flex items-center gap-1"><FaMoneyBillWave /> {jobId.salary}</span>
                </div>

                <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-1">Description:</h4>
                    <p className="text-gray-700 whitespace-pre-line text-sm">{jobId.description}</p>
                </div>

                <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-1">Requirements:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 whitespace-pre-line">
                        {jobId.requirements.split('\n').map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;