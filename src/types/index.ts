// Core types for the Clinic Appointment System

export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  bloodGroup?: string;
  allergies?: string[];
}

export interface Doctor extends User {
  role: 'doctor';
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'checked-in' | 'completed' | 'cancelled' | 'no-show';
  type: 'consultation' | 'follow-up' | 'emergency';
  checkInTime?: string;
  completedTime?: string;
  cancelReason?: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  chiefComplaint?: string;
  diagnosis: string;
  notes: string;
  prescriptions: Prescription[];
  tests: TestOrder[];
  vitals?: {
    temperature?: number;
    bloodPressure?: string;
    heartRate?: number;
    weight?: number;
    height?: number;
  };
}

export interface Prescription {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface TestOrder {
  id: string;
  testName: string;
  reason?: string;
  urgent: boolean;
}

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  slotDuration: number;
  isAvailable: boolean;
  reason?: string;
}

export interface WeeklySchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface Analytics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowRate: number;
  peakHours: { hour: string; count: number }[];
  revenue: number;
  avgWaitTime: number;
}
