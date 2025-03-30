import { useEffect, useState } from 'react';
import { loanApi } from '../../services/api';
import { format } from 'date-fns';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Loan {
  id: string;
  applicantName: string;
  email: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
}

const ApproveLoans = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await loanApi.getAllLoans();
      const verifiedLoans = response.data.filter(
        (loan: Loan) => loan.status === 'VERIFIED'
      );
      setLoans(verifiedLoans);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to load loan applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await loanApi.approveLoan(id);
      fetchLoans();
    } catch (err) {
      console.error('Error approving loan:', err);
      setError('Failed to approve loan');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await loanApi.rejectLoan(id, reason);
      fetchLoans();
    } catch (err) {
      console.error('Error rejecting loan:', err);
      setError('Failed to reject loan');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Approve Loan Applications</h1>
        <div className="mt-3 sm:mt-0 text-sm text-gray-500">
          {loans.length} application{loans.length !== 1 ? 's' : ''} waiting for approval
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {loans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-indigo-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            There are no verified loans waiting for approval at this time. Check back later or refresh the page.
          </p>
          <button 
            onClick={fetchLoans}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loan.applicantName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{loan.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${loan.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{loan.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(loan.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprove(loan.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(loan.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveLoans;