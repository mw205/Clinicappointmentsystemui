import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PatientDashboard } from './components/patient/PatientDashboard';
import { BookAppointment } from './components/patient/BookAppointment';
import { MedicalRecords } from './components/patient/MedicalRecords';
import { DoctorDashboard } from './components/doctor/DoctorDashboard';
import { EMRForm } from './components/doctor/EMRForm';
import { QueueManagement } from './components/receptionist/QueueManagement';
import { DoctorSchedules } from './components/receptionist/DoctorSchedules';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState('dashboard');
  const [viewData, setViewData] = useState<any>(null);

  const handleNavigate = (view: string, data?: any) => {
    setCurrentView(view);
    setViewData(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  const renderView = () => {
    if (!user) return null;

    switch (user.role) {
      case 'patient':
        switch (currentView) {
          case 'dashboard':
            return <PatientDashboard onNavigate={handleNavigate} />;
          case 'book-appointment':
          case 'appointments':
            return <BookAppointment onNavigate={handleNavigate} />;
          case 'records':
            return <MedicalRecords />;
          default:
            return <PatientDashboard onNavigate={handleNavigate} />;
        }

      case 'doctor':
        switch (currentView) {
          case 'dashboard':
          case 'queue':
            return <DoctorDashboard onNavigate={handleNavigate} />;
          case 'emr-form':
            return <EMRForm appointmentId={viewData?.appointmentId} onNavigate={handleNavigate} />;
          case 'records':
            return <MedicalRecords />;
          default:
            return <DoctorDashboard onNavigate={handleNavigate} />;
        }

      case 'receptionist':
        switch (currentView) {
          case 'dashboard':
          case 'queue':
            return <QueueManagement />;
          case 'schedules':
          case 'appointments':
            return <DoctorSchedules />;
          default:
            return <QueueManagement />;
        }

      case 'admin':
        switch (currentView) {
          case 'dashboard':
          case 'analytics':
            return <AdminDashboard />;
          case 'users':
            return <UserManagement />;
          default:
            return <AdminDashboard />;
        }

      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
      {renderView()}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}