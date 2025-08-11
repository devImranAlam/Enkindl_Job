import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const registerSchema = Yup.object().shape({
        name: Yup.string().min(2).required('Name required'),
        email: Yup.string().email('Invalid email').required('Email required'),
        password: Yup.string().min(3, 'Minimum 3 characters').required('Password required'),
        role: Yup.string().oneOf(['job_seeker', 'recruiter']).required('Role required'),
    });

    const handleRegister = async (values, { setSubmitting }) => {
        try {
            await axiosInstance.post('/auth/register', values);
            toast.success('Registration successful!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            className="flex items-center justify-center min-h-screen bg-slate-50 px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Create your account</h2>

                <Formik
                    initialValues={{ name: '', email: '', password: '', role: 'job_seeker' }}
                    validationSchema={registerSchema}
                    onSubmit={handleRegister}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <Field
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div>
                                <div className="relative">
                                    <Field
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-2 text-sm text-indigo-500"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div>
                                <Field
                                    as="select"
                                    name="role"
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="job_seeker">Job Seeker</option>
                                    <option value="recruiter">Recruiter</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p className="text-sm text-center mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline">Login</a>
                </p>
            </div>
        </motion.div>
    );
};

export default Register;