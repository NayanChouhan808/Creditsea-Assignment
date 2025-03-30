import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { loanApi } from '../../services/api';
import { format } from 'date-fns';
import { FileText, PlusCircle, CheckCircle, AlertTriangle, Clock, ExternalLink, AlertCircle } from 'lucide-react';

interface Loan {
  id: string;
  applicantName: string;
  amount: number;
  purpose: string;
  status: string;
  createdAt: string;
}

const UserDashboard = () => {
  const location = useLocation();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state && location.state.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
    
    fetchLoans();
  }, [location]);

  const fetchLoans = async () => {
    try {
      const response = await loanApi.getUserLoanApplications();
      setLoans(response.data);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to load your loan applications');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const pendingCount = loans.filter(loan => loan.status === 'PENDING').length;
  const verifiedCount = loans.filter(loan => loan.status === 'VERIFIED').length;
  const approvedCount = loans.filter(loan => loan.status === 'APPROVED').length;
  const rejectedCount = loans.filter(loan => loan.status === 'REJECTED').length;

  const statusCards = [
    { 
      label: 'Total Applications', 
      value: loans.length, 
      icon: <FileText className="h-6 w-6 text-white" />,
      bgColor: 'bg-indigo-600',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'Pending', 
      value: pendingCount, 
      icon: <Clock className="h-6 w-6 text-white" />,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    { 
      label: 'Verified', 
      value: verifiedCount, 
      icon: <AlertCircle className="h-6 w-6 text-white" />,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Approved', 
      value: approvedCount, 
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    { 
      label: 'Rejected', 
      value: rejectedCount, 
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        <Link 
          to="/user/create-loan"
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Application
        </Link>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {statusCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500">{card.label}</h3>
                <div className={`${card.bgColor} rounded-md p-2`}>
                  {card.icon}
                </div>
              </div>
              <div className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </div>
            </div>
            <div className={`h-1 w-full ${card.bgColor}`}></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Loan Applications</h2>
          <p className="mt-1 text-sm text-gray-500">
            A list of all your loan applications and their current status
          </p>
        </div>
        
        {loans.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <FileText className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't submitted any loan applications yet.
            </p>
            <div className="mt-6">
              <Link
                to="/user/create-loan"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Create New Application
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {loan.id.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${loan.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {loan.purpose}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${loan.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${loan.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' : ''}
                        ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                        ${loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(loan.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/user/loans/${loan.id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        View
                        <ExternalLink className="ml-1 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;