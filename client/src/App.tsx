import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveLoans from './pages/admin/ApproveLoans';
import VerifierDashboard from './pages/verifier/Dashboard';
import VerifyLoans from './pages/verifier/VerifyLoans';
import UserDashboard from './pages/user/Dashboard';
import CreateLoan from './pages/user/CreateLoan';
import LoanDetails from './pages/LoanDetails';
import DashboardLayout from './components/DashboardLayout';

const AuthCheck = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      await initialize();
      
      if (!isLoading && !isAuthenticated && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register')) {
        navigate('/login', { replace: true });
      }
    };
    
    checkAuth();
  }, [initialize, isAuthenticated, isLoading, navigate, location.pathname]);

  return null;
};

const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: { 
  children: JSX.Element, 
  allowedRoles?: Array<'ADMIN' | 'VERIFIER' | 'USER'> 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'VERIFIER') {
      return <Navigate to="/verifier/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }
  
  return children;
};

const PublicRoute = ({ children }: { children: any }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }
  
  if (isAuthenticated && user) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'VERIFIER') {
      return <Navigate to="/verifier/dashboard" replace />;
    } else {
      return <Navigate to="/user/dashboard" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthCheck />
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="approve" element={<ApproveLoans />} />
          <Route path="loans/:id" element={<LoanDetails />} />
        </Route>
        
        <Route path="/verifier" element={
          <ProtectedRoute allowedRoles={['VERIFIER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<VerifierDashboard />} />
          <Route path="verify" element={<VerifyLoans />} />
          <Route path="loans/:id" element={<LoanDetails />} />
        </Route>
        
        <Route path="/user" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="create-loan" element={<CreateLoan />} />
          <Route path="loans/:id" element={<LoanDetails />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="mb-4">Page not found</p>
              <a href="/" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Go Home
              </a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;