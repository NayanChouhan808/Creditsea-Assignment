import { useEffect, useState } from 'react';
import { loanApi } from '../../services/api';
import { format } from 'date-fns';
import { FileText, CheckCircle, AlertTriangle, Clock, ExternalLink, Activity, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoanStats {
  totalLoans: number;
  pendingLoans: number;
  verifiedLoans: number;
  rejectedLoans: number;
  recentApplications: Array<{
    id: string;
    applicantName: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

const VerifierDashboard = () => {
  const [stats, setStats] = useState<LoanStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await loanApi.getLoanStatistics();
        setStats(response.data);
      } catch (err) {
        setError('Failed to load statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
        <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <p>{error}</p>
      </div>
    );
  }

  const statusCards = [
    { 
      label: 'Total Applications', 
      value: stats?.totalLoans || 0, 
      icon: <FileText className="h-6 w-6 text-white" />,
      bgColor: 'bg-indigo-600',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'Pending Verification', 
      value: stats?.pendingLoans || 0, 
      icon: <Clock className="h-6 w-6 text-white" />,
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    { 
      label: 'Verified', 
      value: stats?.verifiedLoans || 0, 
      icon: <CheckCircle className="h-6 w-6 text-white" />,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Rejected', 
      value: stats?.rejectedLoans || 0, 
      icon: <AlertTriangle className="h-6 w-6 text-white" />,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Verifier Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0">
          Last updated: {format(new Date(), 'MMM dd, yyyy, h:mm a')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {card.value.toLocaleString()}
              </div>
            </div>
            <div className={`h-1 w-full ${card.bgColor}`}></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/verifier/verify"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
          >
            <div className="rounded-full bg-indigo-100 p-3 mr-4 group-hover:bg-indigo-200 transition-colors">
              <Activity className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Verify Applications</h3>
              <p className="text-sm text-gray-500">Review and verify pending applications</p>
            </div>
          </Link>
          
          <Link
            to="/verifier/dashboard"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors group"
          >
            <div className="rounded-full bg-indigo-100 p-3 mr-4 group-hover:bg-indigo-200 transition-colors">
              <LinkIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">View All Applications</h3>
              <p className="text-sm text-gray-500">See all loan applications in the system</p>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <p className="mt-1 text-sm text-gray-500">
            The most recent loan applications submitted to the system
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {stats?.recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {app.applicantName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{app.applicantName}</div>
                        <div className="text-sm text-gray-500">ID: {app.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${app.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${app.status === 'VERIFIED' ? 'bg-blue-100 text-blue-800' : ''}
                      ${app.status === 'APPROVED' ? 'bg-green-100 text-green-800' : ''}
                      ${app.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(app.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/verifier/loans/${app.id}`}
                      className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                    >
                      View Details
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Link to="/verifier/verify" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Verify pending applications →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;