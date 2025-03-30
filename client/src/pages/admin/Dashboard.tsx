import { useEffect, useState } from 'react';
import { loanApi } from '../../services/api';
import { FileText, CheckCircle, AlertTriangle, DollarSign, Activity, TrendingUp, Users } from 'lucide-react';
import { format } from 'date-fns';

interface LoanStats {
  totalLoans: number;
  pendingLoans: number;
  verifiedLoans: number;
  approvedLoans: number;
  rejectedLoans: number;
  approvedAmount: number;
  recentApplications: Array<{
    id: string;
    applicantName: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<LoanStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await loanApi.getTotalUsers();
        setTotalUsers(response.data.user);
        console.log('Total Users:', response.data.user);
      } catch (err) {
        setError('Failed to load user statistics');
        console.error(err);
      }
    };

    fetchUsers();
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
      label: 'Pending', 
      value: stats?.pendingLoans || 0, 
      icon: <Activity className="h-6 w-6 text-white" />,
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
      label: 'Approved', 
      value: stats?.approvedLoans || 0, 
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
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
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0">
          Last updated: {format(new Date(), 'MMM dd, yyyy, h:mm a')}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Total Users</h2>
            <div className="bg-purple-100 rounded-md p-2">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-4xl font-bold text-purple-600">
              {totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-1">registered users</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Total Approved Amount</h2>
            <div className="bg-green-100 rounded-md p-2">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-end space-x-2">
            <p className="text-4xl font-bold text-green-600">
              ${stats?.approvedAmount.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mb-1">total approved</p>
          </div>
          <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${Math.min(100, (stats?.approvedLoans || 0) / (stats?.totalLoans || 1) * 100)}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats?.approvedLoans || 0} of {stats?.totalLoans || 0} applications approved
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <p className="mt-1 text-sm text-gray-500">
            A list of the most recent loan applications
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;