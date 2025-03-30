import { useEffect, useState } from 'react';
import { userApi } from '../../services/api';
import { format } from 'date-fns';
import { Trash2, X, User, Shield, UserPlus, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'admin' | 'verifier'>('admin');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userApi.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const openModal = (type: 'admin' | 'verifier') => {
    setModalType(type);
    setNewEmail('');
    setNewPassword('');
    setShowModal(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (modalType === 'admin') {
        await userApi.createAdmin({ email: newEmail, password: newPassword });
      } else {
        await userApi.createVerifier({ email: newEmail, password: newPassword });
      }
      
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      setError(`Failed to create ${modalType}`);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => openModal('admin')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Shield size={16} className="mr-2" />
            Add Admin
          </button>
          <button 
            onClick={() => openModal('verifier')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <UserPlus size={16} className="mr-2" />
            Add Verifier
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 block w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="font-medium text-indigo-600">
                          {user.email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${user.role === 'VERIFIER' ? 'bg-blue-100 text-blue-800' : ''}
                      ${user.role === 'USER' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New {modalType === 'admin' ? 'Admin' : 'Verifier'}
              </h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    modalType === 'admin' 
                      ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                  }`}
                >
                  Create {modalType === 'admin' ? 'Admin' : 'Verifier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;