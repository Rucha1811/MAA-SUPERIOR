import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Public pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import QuoteRequest from './pages/QuoteRequest';
import CustomMenu from './pages/CustomMenu';

// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminQuotations from './pages/admin/Quotations';
import AdminQuoteDetail from './pages/admin/QuoteDetail';
import AdminCustomers from './pages/admin/Customers';
import AdminCustomerDetail from './pages/admin/CustomerDetail';
import AdminMenuManagement from './pages/admin/MenuManagement';
import AdminSettings from './pages/admin/Settings';
import AdminEventRecords from './pages/admin/EventRecords';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading } = useAuth();
  if (isLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1C0000' }}>
      <div className="spinner" />
    </div>
  );
  if (!user || !isAdmin) return <Navigate to="/admin-login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
          style: { background: '#2D0000', color: '#F5EDD8', fontFamily: 'Nunito, sans-serif', border: '1px solid rgba(201,150,26,0.4)' },
          success: { iconTheme: { primary: '#C9961A', secondary: '#2D0000' } },
          error: { iconTheme: { primary: '#FF4444', secondary: '#2D0000' } },
        }} />
        <Routes>
          {/* Public — no login required */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<QuoteRequest />} />
          <Route path="/custom-menu" element={<CustomMenu />} />

          {/* Admin auth */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin panel — guarded */}
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminDashboard />} />
            <Route path="quotations" element={<AdminQuotations />} />
            <Route path="quotations/:id" element={<AdminQuoteDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="menu" element={<AdminMenuManagement />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="events" element={<AdminEventRecords />} />
          </Route>

          {/* Redirect old login routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
