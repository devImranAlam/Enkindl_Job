import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchJobs } from '../redux/jobSlice';

const jobSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    company: Yup.string().required('Company is required'),
    location: Yup.string().required('Location is required'),
    type: Yup.string().required('Job type is required'),
    description: Yup.string().required('Description is required'),
    requirements: Yup.string().required('Requirements are required'),
    salary: Yup.string().required('Salary range is required'),
});

const JobFormModal = ({ isOpen, onClose, initialData = null, isEditMode = false }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const handleEscape = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleJobSubmit = async (values, { resetForm, setSubmitting }) => {
        try {
            if (isEditMode) {
                await axiosInstance.put(`/jobs/${initialData._id}`, values);
                toast.success('Job updated successfully!');
            } else {
                await axiosInstance.post('/jobs', values);
                toast.success('Job posted successfully!');
            }

            resetForm();
            onClose();
            dispatch(fetchJobs());
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit job');
        } finally {
            setSubmitting(false);
        }
    };

    const defaultValues = {
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>

                        <h2 className="text-3xl font-semibold text-indigo-600 mb-6 text-center">
                            {isEditMode ? '✏️ Edit Job Post' : '📄 Post a New Job'}
                        </h2>

                        <Formik
                            initialValues={initialData || defaultValues}
                            validationSchema={jobSchema}
                            onSubmit={handleJobSubmit}
                            enableReinitialize
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Job Title</label>
                                            <Field name="title" placeholder="e.g. Frontend Developer" className="input" />
                                            <ErrorMessage name="title" component="div" className="text-sm text-red-500 mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Company</label>
                                            <Field name="company" placeholder="e.g. Google, Meta" className="input" />
                                            <ErrorMessage name="company" component="div" className="text-sm text-red-500 mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Location</label>
                                            <Field name="location" placeholder="e.g. Delhi, India" className="input" />
                                            <ErrorMessage name="location" component="div" className="text-sm text-red-500 mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">Job Type</label>
                                            <Field as="select" name="type" className="input">
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Internship">Internship</option>
                                            </Field>
                                            <ErrorMessage name="type" component="div" className="text-sm text-red-500 mt-1" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Job Description</label>
                                        <Field
                                            as="textarea"
                                            name="description"
                                            className="input h-24 resize-none"
                                            placeholder="Describe the role..."
                                        />
                                        <ErrorMessage name="description" component="div" className="text-sm text-red-500 mt-1" />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Requirements</label>
                                        <Field
                                            as="textarea"
                                            name="requirements"
                                            className="input h-24 resize-none"
                                            placeholder="What skills or experience do you need?"
                                        />
                                        <ErrorMessage name="requirements" component="div" className="text-sm text-red-500 mt-1" />
                                    </div>

                                    <div>
                                        <label className="block mb-1 font-medium text-gray-700">Salary Range</label>
                                        <Field name="salary" className="input" placeholder="e.g. ₹30,000 - ₹60,000" />
                                        <ErrorMessage name="salary" component="div" className="text-sm text-red-500 mt-1" />
                                    </div>

                                    <div className="flex justify-end gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="btn-secondary px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-primary px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded"
                                        >
                                            {isSubmitting ? (isEditMode ? 'Updating...' : 'Posting...') : (isEditMode ? 'Update Job' : 'Post Job')}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default JobFormModal;