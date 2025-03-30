import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanApi } from '../services/api';
import { format } from 'date-fns';
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  FileText, 
  User,
  DollarSign, 
  Clock, 
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface LoanDetail {
  id: string;
  applicantName: string;
  email: string;
  amount: number;
  time: string;
  employmentStatus: string;
  employmentAddress: string;
  purpose: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  verifiedBy: { id: string; email: string } | null;
  rejectedBy: { id: string; email: string } | null;
  approvedBy: { id: string; email: string } | null;
  rejectionReason: string | null;
}

const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loan, setLoan] = useState<LoanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchLoanDetails(id);
    }
  }, [id]);

  const fetchLoanDetails = async (loanId: string) => {
    try {
      const response = await loanApi.getLoanById(loanId);
      setLoan(response.data);
    } catch (err) {
      console.error('Error fetching loan details:', err);
      setError('Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!loan) return;
    
    try {
      await loanApi.verifyLoan(loan.id);
      fetchLoanDetails(loan.id);
    } catch (err) {
      console.error('Error verifying loan:', err);
      setError('Failed to verify loan');
    }
  };

  const handleReject = async () => {
    if (!loan) return;
    
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await loanApi.rejectLoan(loan.id, reason);
      fetchLoanDetails(loan.id);
    } catch (err) {
      console.error('Error rejecting loan:', err);
      setError('Failed to reject loan');
    }
  };

  const handleApprove = async () => {
    if (!loan) return;
    
    try {
      await loanApi.approveLoan(loan.id);
      fetchLoanDetails(loan.id);
    } catch (err) {
      console.error('Error approving loan:', err);
      setError('Failed to approve loan');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'VERIFIED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Loan not found</h3>
          <p className="mt-1 text-gray-500">The loan application you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </button>
        
        <div className="flex flex-wrap gap-3">
          {user?.role === 'VERIFIER' && loan.status === 'PENDING' && (
            <>
              <button
                onClick={handleVerify}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CheckCircle size={16} className="mr-2" />
                Verify
              </button>
              <button
                onClick={handleReject}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <XCircle size={16} className="mr-2" />
                Reject
              </button>
            </>
          )}
          
          {user?.role === 'ADMIN' && loan.status === 'VERIFIED' && (
            <button
              onClick={handleApprove}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <CheckCircle size={16} className="mr-2" />
              Approve
            </button>
          )}
          
          {user?.role === 'ADMIN' && loan.status === 'PENDING' && (
            <button
              onClick={handleReject}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <XCircle size={16} className="mr-2" />
              Reject
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Loan Application #{loan.id.substring(0, 8)}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Submitted on {format(new Date(loan.createdAt), 'MMMM dd, yyyy')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(loan.status)}`}>
            {loan.status}
          </span>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-indigo-500" />
                  Applicant Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.applicantName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employment Status</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.employmentStatus}</p>
                  </div>
                  {loan.employmentAddress && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employment Address</p>
                      <p className="mt-1 text-sm text-gray-900">{loan.employmentAddress}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                  Loan Purpose
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-900">{loan.purpose}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-indigo-500" />
                  Loan Details
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">${loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="mt-1 text-sm text-gray-900">{loan.time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Application ID</p>
                    <p className="mt-1 text-sm text-gray-900 font-mono">{loan.id}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                  Application Timeline
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-6">
                    <div className="relative flex items-start pb-6 before:absolute before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
                      <div className="absolute top-0 left-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                        <FileText className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="ml-12">
                        <h3 className="text-sm font-medium text-gray-900">Application Submitted</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {format(new Date(loan.createdAt), 'MMM dd, yyyy, h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    {loan.verifiedBy && (
                      <div className="relative flex items-start pb-6 before:absolute before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
                        <div className="absolute top-0 left-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-12">
                          <h3 className="text-sm font-medium text-gray-900">Verified</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            By {loan.verifiedBy.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {format(new Date(loan.updatedAt), 'MMM dd, yyyy, h:mm a')}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {loan.approvedBy && (
                      <div className="relative flex items-start pb-6 before:absolute before:left-4 before:h-full before:w-0.5 before:bg-gray-200">
                        <div className="absolute top-0 left-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="ml-12">
                          <h3 className="text-sm font-medium text-gray-900">Approved</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            By {loan.approvedBy.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {format(new Date(loan.updatedAt), 'MMM dd, yyyy, h:mm a')}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {loan.rejectedBy && (
                      <div className="relative flex items-start">
                        <div className="absolute top-0 left-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </div>
                        <div className="ml-12">
                          <h3 className="text-sm font-medium text-gray-900">Rejected</h3>
                          <p className="mt-1 text-xs text-gray-500">
                            By {loan.rejectedBy.email}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {format(new Date(loan.updatedAt), 'MMM dd, yyyy, h:mm a')}
                          </p>
                          {loan.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded-md text-sm text-red-800">
                              <p className="font-medium text-xs text-red-800">Reason:</p>
                              <p className="mt-1 text-sm">{loan.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;