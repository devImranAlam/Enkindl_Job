
const JobSkeleton = () => {
    return (
        <div className="border border-gray-200 rounded-lg p-5 shadow animate-pulse space-y-4 bg-white">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
            <div className="flex justify-between mt-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );
};

export default JobSkeleton;