import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, Link } from 'react-router-dom';
import MainPage from './pages/MainPage';
import UserFormPage from './pages/UserFormPage';
import GroupListPage from './pages/GroupListPage';
import GroupFormPage from './pages/GroupFormPage';
import DepartmentListPage from './pages/DepartmentListPage';
import AuditLogPage from './pages/AuditLogPage';
import LoginPage from './pages/LoginPage';
import SystemOperatorPage from './pages/SystemOperatorPage';
import SystemOperatorFormPage from './pages/SystemOperatorFormPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AssetListPage from './pages/AssetListPage';
import AssetFormPage from './pages/AssetFormPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Users, UsersRound, Building2, History, LogOut, ShieldCheck, Box } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Block "User" role from accessing the main app
  if (user?.role === 'User') {
    return (
      <Routes>
        <Route path="/access-denied" element={<AccessDeniedPage />} />
        <Route path="*" element={<Navigate to="/access-denied" />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div>
          <Link to="/accounts" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2 style={{ cursor: 'pointer' }}>MK CORE</h2>
          </Link>
          <nav>
            <NavLink to="/accounts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Users size={20} /> Accounts
            </NavLink>
            <NavLink to="/groups" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <UsersRound size={20} /> Groups
            </NavLink>
            <NavLink to="/departments" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Building2 size={20} /> Departments
            </NavLink>
            <NavLink to="/assets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Box size={20} /> Assets
            </NavLink>
            {user?.role !== 'User' && (
              <NavLink to="/audit-logs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <History size={20} /> Audit Logs
              </NavLink>
            )}
            {user?.role === 'Admin' && (
              <>
                <div style={{ margin: '1rem 0 0.5rem 1rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Administration
                </div>
                <NavLink to="/system-operators" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <ShieldCheck size={20} /> System Operators
                </NavLink>
              </>
            )}
          </nav>
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
            Logged in as <strong>{user?.firstName}</strong>
          </div>
          <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/accounts" replace />} />
          <Route path="/accounts" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
          <Route path="/modify/:id" element={<ProtectedRoute><UserFormPage /></ProtectedRoute>} />
          <Route path="/groups" element={<ProtectedRoute><GroupListPage /></ProtectedRoute>} />
          <Route path="/groups/add" element={<ProtectedRoute><GroupFormPage /></ProtectedRoute>} />
          <Route path="/groups/modify/:id" element={<ProtectedRoute><GroupFormPage /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><DepartmentListPage /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><AssetListPage /></ProtectedRoute>} />
          <Route path="/assets/add" element={<ProtectedRoute><AssetFormPage /></ProtectedRoute>} />
          <Route path="/assets/modify/:id" element={<ProtectedRoute><AssetFormPage /></ProtectedRoute>} />
          <Route path="/system-operators" element={<ProtectedRoute><SystemOperatorPage /></ProtectedRoute>} />
          <Route path="/system-operators/add" element={<ProtectedRoute><SystemOperatorFormPage /></ProtectedRoute>} />
          <Route path="/system-operators/modify/:id" element={<ProtectedRoute><SystemOperatorFormPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
