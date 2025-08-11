import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';
import JobCard from '../components/JobCard';
import JobSkeleton from '../components/JobSkeleton';

const Jobs = () => {
    const dispatch = useDispatch();
    const { jobs, loading, error } = useSelector((state) => state.jobs);
    const { user } = useSelector((state) => state.auth);

    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        dispatch(fetchJobs()); // fetch all jobs on initial load
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        const query = `keyword=${keyword}&location=${location}`;
        dispatch(fetchJobs(query));
    };

    const filteredJobs =
        user?.role === 'recruiter'
            ? jobs.filter((job) => job.postedBy === user._id)
            : jobs;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold mb-6 text-indigo-700">Explore Jobs</h1>

            {/* Filter Form */}
            <form onSubmit={handleSearch} className="mb-8 grid md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Keyword (e.g. frontend)"
                    className="input"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Location (e.g. Delhi)"
                    className="input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn-primary text-white rounded-md"
                >
                    Search
                </button>
            </form>

            {/* Job Listings */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <JobSkeleton key={i} />
                    ))}
                </div>
            )}

            {!loading && error && (
                <p className="text-red-500 text-lg font-medium">{error}</p>
            )}

            {!loading && !error && filteredJobs.length === 0 && (
                <p className="text-gray-600 text-lg">No jobs found.</p>
            )}

            {!loading && !error && filteredJobs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Jobs;