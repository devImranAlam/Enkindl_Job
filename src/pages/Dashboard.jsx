import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

import JobFormModal from '../components/JobFormModal';
import { fetchRecruiterApplications, fetchAdminApplications } from '../redux/applicationSlice';
import { fetchJobs } from '../redux/jobSlice';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);
  const { jobs } = useSelector((state) => state.jobs);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.role === 'recruiter' || user?.role === 'admin') {
      if (user?.role == "admin") {
        dispatch(fetchAdminApplications());
      }
      else {
        dispatch(fetchRecruiterApplications());
      }
      dispatch(fetchJobs());
    }
  }, [dispatch, user]);

  // Stats
  var jobCount;
  if (user.role == "admin") {
    jobCount = jobs.length || 0;
  } else {
    jobCount = jobs?.filter((job) => job.postedBy === user._id).length || 0;
  }
  const stats = {
    Applied: applications.length,
    Shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    Accepted: applications.filter((a) => a.status === 'accepted').length,
    Rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <motion.div
      className="min-h-screen bg-slate-50 px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            Welcome back, {user?.name || 'User'} 👋
          </h2>
          <p className="text-gray-600">
            {user?.role === 'recruiter' || user?.role === 'admin'
              ? 'Manage your job postings and applications here.'
              : 'Browse jobs and track your applications.'}
          </p>
        </div>

        {/* Dashboard Action Cards */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 shadow rounded-lg border border-indigo-100"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Post New Job</h3>
            <p className="text-gray-600 mb-4">Create and publish a new job listing for seekers.</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Create Job
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 shadow rounded-lg border border-indigo-100"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">Manage Listings</h3>
            <p className="text-gray-600 mb-4">View, update or delete your job postings.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Manage Jobs
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 shadow rounded-lg border border-indigo-100"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">View Applications</h3>
            <p className="text-gray-600 mb-4">Check who has applied to your job listings.</p>
            <button
              onClick={() => navigate('/manage-applications')}
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              View Applicants
            </button>
          </motion.div>
        </div>

        {/* Stats + Chart */}
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Count Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow rounded-lg p-4 border border-slate-100 text-center col-span-2">
              <p className="text-sm text-slate-500">Total Job Posts</p>
              <p className="text-2xl font-bold text-indigo-700">{jobCount}</p>
            </div>

            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white shadow rounded-lg p-4 border border-slate-100 text-center"
              >
                <p className="text-sm text-slate-500">{key}</p>
                <p className="text-2xl font-bold text-indigo-700">{value}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow border border-slate-100">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4 text-center">
              Application Status Overview
            </h3>
            <Bar
              data={{
                labels: Object.keys(stats),
                datasets: [
                  {
                    label: 'Applications',
                    data: Object.values(stats),
                    backgroundColor: ['#60a5fa', '#facc15', '#10b981', '#f87171'],
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <JobFormModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </motion.div>
  );
};

export default Dashboard;
