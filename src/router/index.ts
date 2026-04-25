import { createRouter, createWebHistory } from 'vue-router';
import { getDefaultRouteForRole, useAuth } from '@/composables/useAuth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/auth/SignupView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // Patient routes
        { path: 'patient/dashboard', name: 'patient-dashboard', component: () => import('@/views/patient/PatientDashboardView.vue') },
        { path: 'patient/book-appointment', name: 'patient-book-appointment', component: () => import('@/views/patient/BookAppointmentView.vue') },
        { path: 'patient/records', name: 'patient-records', component: () => import('@/views/patient/MedicalRecordsView.vue') },
        
        // Doctor routes
        { path: 'doctor/dashboard', name: 'doctor-dashboard', component: () => import('@/views/doctor/DoctorDashboardView.vue') },
        { path: 'doctor/schedules', name: 'doctor-schedules', component: () => import('@/views/receptionist/DoctorSchedulesView.vue') },
        { path: 'doctor/emr-form', name: 'doctor-emr-form', component: () => import('@/views/doctor/EMRFormView.vue') },
        { path: 'doctor/records', name: 'doctor-records', component: () => import('@/views/patient/MedicalRecordsView.vue') }, // Uses same component
        
        // Receptionist routes
        { path: 'receptionist/queue', name: 'receptionist-queue', component: () => import('@/views/receptionist/QueueManagementView.vue') },
        { path: 'receptionist/schedules', name: 'receptionist-schedules', component: () => import('@/views/receptionist/DoctorSchedulesView.vue') },
        
        // Admin routes
        { path: 'admin/dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardView.vue') },
        { path: 'admin/users', name: 'admin-users', component: () => import('@/views/admin/UserManagementView.vue') },
        
        {
          path: '',
          name: 'home-redirect',
          redirect: () => {
            const { user } = useAuth();
            return getDefaultRouteForRole(user.value?.role);
          }
        }
      ]
    }
  ]
});

router.beforeEach(async (to) => {
  const { isAuthenticated, isInitialized, user, checkSession } = useAuth();

  if (!isInitialized.value) {
    await checkSession();
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'login' };
  }

  if (to.meta.guestOnly && isAuthenticated.value) {
    return getDefaultRouteForRole(user.value?.role);
  }
});

export default router;
