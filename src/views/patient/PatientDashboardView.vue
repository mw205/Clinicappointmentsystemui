<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div>
      <h1 class="text-3xl font-semibold text-gray-900">Welcome back, John!</h1>
      <p class="text-gray-500 mt-1">Manage your health appointments and medical records</p>
    </div>

    <!-- Quick Actions -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card class="border-blue-200 bg-blue-50/50 hover:shadow-md transition-shadow cursor-pointer" @click="handleNavigate('book-appointment')">
        <CardHeader class="pb-3">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-600 rounded-lg">
              <Plus class="w-5 h-5 text-white" />
            </div>
            <CardTitle class="text-lg">Book Appointment</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>Schedule a new consultation with available doctors</CardDescription>
        </CardContent>
      </Card>

      <Card class="border-teal-200 bg-teal-50/50 hover:shadow-md transition-shadow cursor-pointer" @click="handleNavigate('records')">
        <CardHeader class="pb-3">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-teal-600 rounded-lg">
              <FileText class="w-5 h-5 text-white" />
            </div>
            <CardTitle class="text-lg">Medical Records</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>View your consultation history and prescriptions</CardDescription>
        </CardContent>
      </Card>

      <Card class="border-purple-200 bg-purple-50/50 hover:shadow-md transition-shadow cursor-pointer" @click="handleNavigate('appointments')">
        <CardHeader class="pb-3">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-600 rounded-lg">
              <Calendar class="w-5 h-5 text-white" />
            </div>
            <CardTitle class="text-lg">My Appointments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>View and manage all your appointments</CardDescription>
        </CardContent>
      </Card>
    </div>

    <!-- Upcoming Appointments -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled consultations</CardDescription>
          </div>
          <Button variant="outline" size="sm" @click="handleNavigate('appointments')">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="appointments.length === 0" class="text-center py-12">
          <Calendar class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">No upcoming appointments</p>
          <Button class="mt-4" @click="handleNavigate('book-appointment')">
            Book Your First Appointment
          </Button>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="apt in appointments"
            :key="apt.id"
            class="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div class="flex items-start gap-4">
              <div class="p-2 bg-blue-100 rounded-lg">
                <Calendar class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ apt.doctorName }}</p>
                <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <Calendar class="w-4 h-4" />
                    {{ new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}
                  </span>
                  <span class="flex items-center gap-1">
                    <Clock class="w-4 h-4" />
                    {{ apt.startTime }}
                  </span>
                </div>
                <Badge :class="['mt-2', getStatusColor(apt.status)]" variant="secondary">
                  {{ apt.status }}
                </Badge>
              </div>
            </div>
            <div class="flex gap-2">
              <Button v-if="apt.status === 'pending'" variant="outline" size="sm">Cancel</Button>
              <Button v-if="apt.status === 'confirmed'" variant="outline" size="sm">Reschedule</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Health Summary -->
    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center py-8">
            <div class="text-4xl font-semibold text-blue-600">3</div>
            <p class="text-sm text-gray-500 mt-1">Consultations this year</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Check-up</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center py-8">
            <div class="text-4xl font-semibold text-teal-600">April 22</div>
            <p class="text-sm text-gray-500 mt-1">General Consultation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, Clock, FileText, Plus } from 'lucide-vue-next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '@/types';

const router = useRouter();

const MOCK_UPCOMING: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-22',
    startTime: '10:00',
    endTime: '10:30',
    duration: 30,
    status: 'confirmed',
    type: 'consultation',
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'John Doe',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-25',
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    status: 'pending',
    type: 'follow-up',
  },
];

const appointments = ref(MOCK_UPCOMING);

const handleNavigate = (path: string) => {
  router.push(`/patient/${path}`);
};

const getStatusColor = (status: string) => {
  const colors = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    'checked-in': 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  } as Record<string, string>;
  return colors[status] || colors.pending;
};
</script>
