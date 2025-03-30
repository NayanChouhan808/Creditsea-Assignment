import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loanApi } from '../../services/api';
import { AlertTriangle, ArrowLeft, DollarSign, Mail, User, Briefcase, MapPin, FileText, Clock, Send } from 'lucide-react';

const CreateLoan = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        applicantName: '',
        email: '',
        amount: '',
        time: '',
        employmentStatus: '',
        employmentAddress: '',
        purpose: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loanApi.createLoan(formData);
            navigate('/user/dashboard', { state: { message: 'Loan application submitted successfully!' } });
        } catch (err: any) {
            console.error('Error creating loan:', err);
            setError(err.response?.data?.message || 'Failed to submit loan application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
                <Link to="/user/dashboard" className="mr-4 text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Create Loan Application</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-lg font-medium text-gray-900">Application Details</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Please provide accurate information to expedite your loan approval process.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="applicantName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="applicantName"
                                    name="applicantName"
                                    value={formData.applicantName}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                Loan Amount ($)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="5000"
                                    min="1000"
                                    required
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Minimum amount: $1,000</p>
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                Loan Duration
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Clock className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                    required
                                >
                                    <option value="">Select duration</option>
                                    <option value="6 months">6 months</option>
                                    <option value="12 months">12 months</option>
                                    <option value="24 months">24 months</option>
                                    <option value="36 months">36 months</option>
                                    <option value="48 months">48 months</option>
                                    <option value="60 months">60 months</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                Employment Status
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="employmentStatus"
                                    name="employmentStatus"
                                    value={formData.employmentStatus}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Self-employed">Self-employed</option>
                                    <option value="Unemployed">Unemployed</option>
                                    <option value="Retired">Retired</option>
                                    <option value="Student">Student</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="employmentAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                Employment Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="employmentAddress"
                                    name="employmentAddress"
                                    value={formData.employmentAddress}
                                    onChange={handleChange}
                                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="123 Business St, City"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Required for employed applicants</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                            Loan Purpose
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                                id="purpose"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                rows={4}
                                placeholder="Please describe the purpose of this loan request..."
                                required
                            ></textarea>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Provide details about how you plan to use the loan</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                        <Link
                            to="/user/dashboard"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLoan;