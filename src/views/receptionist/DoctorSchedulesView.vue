<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Doctor Schedules</h1>
        <p class="text-gray-500 mt-1">Manage doctor availability and time blocks</p>
      </div>
      <Dialog v-model:open="dialogOpen">
        <DialogTrigger as-child>
          <Button class="bg-blue-600 hover:bg-blue-700">
            <Plus class="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Doctor Schedule</DialogTitle>
            <DialogDescription>Set availability or block time for a doctor</DialogDescription>
          </DialogHeader>
          <div class="space-y-4 py-4">
            <div class="space-y-2">
              <Label>Doctor</Label>
              <Select v-model="newSchedule.doctorId">
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="doctor in MOCK_DOCTORS" :key="doctor.id" :value="doctor.id">
                    {{ doctor.firstName }} {{ doctor.lastName }} - {{ doctor.specialization }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  v-model="newSchedule.startTime"
                />
              </div>
              <div class="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  v-model="newSchedule.endTime"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label>Slot Duration</Label>
              <Select v-model="newSchedule.slotDuration">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <Label>Status</Label>
              <Select v-model="newSchedule.isAvailable">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Available</SelectItem>
                  <SelectItem value="false">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div v-if="newSchedule.isAvailable === 'false'" class="space-y-2">
              <Label>Reason for Block</Label>
              <Textarea
                placeholder="e.g., Vacation, Conference, Emergency"
                v-model="newSchedule.reason"
                :rows="2"
              />
            </div>
          </div>
          <div class="flex gap-3 justify-end">
            <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
            <Button @click="handleAddSchedule">Add Schedule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Calendar -->
      <Card class="lg:col-span-1">
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent class="flex justify-center">
          <Calendar
            id="schedule-calendar"
            mode="single"
            v-model="selectedDate"
            class="rounded-md border"
          />
        </CardContent>
      </Card>

      <!-- Schedules for Selected Date -->
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            Schedules for {{ formattedSelectedDate }}
          </CardTitle>
          <CardDescription>
            {{ daySchedules.length }} doctor{{ daySchedules.length !== 1 ? 's' : '' }} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="daySchedules.length === 0" class="text-center py-12">
            <CalendarIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p class="text-gray-500">No schedules for this date</p>
            <Button variant="outline" class="mt-4" @click="dialogOpen = true">
              <Plus class="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="schedule in daySchedules"
              :key="schedule.id"
              :class="[
                'p-4 rounded-lg border-2',
                schedule.isAvailable
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-red-200 bg-red-50/50'
              ]"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3 flex-1">
                  <div :class="['p-2 rounded-lg', schedule.isAvailable ? 'bg-green-100' : 'bg-red-100']">
                    <User :class="['w-5 h-5', schedule.isAvailable ? 'text-green-600' : 'text-red-600']" />
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-gray-900">{{ schedule.doctorName }}</p>
                    <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span class="flex items-center gap-1">
                        <Clock class="w-4 h-4" />
                        {{ schedule.startTime }} - {{ schedule.endTime }}
                      </span>
                      <Badge variant="outline">
                        {{ schedule.slotDuration }} min slots
                      </Badge>
                    </div>
                    <p v-if="!schedule.isAvailable && schedule.reason" class="text-sm text-red-600 mt-2 italic">
                      {{ schedule.reason }}
                    </p>
                  </div>
                </div>
                <Badge :class="schedule.isAvailable ? 'bg-green-600' : 'bg-red-600'">
                  {{ schedule.isAvailable ? 'Available' : 'Blocked' }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- All Doctors Overview -->
    <Card>
      <CardHeader>
        <CardTitle>All Doctors</CardTitle>
        <CardDescription>Current roster and specializations</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="doctor in MOCK_DOCTORS" :key="doctor.id" class="p-4 border border-gray-200 rounded-lg">
            <div class="flex items-start gap-3">
              <div class="p-2 bg-blue-100 rounded-full">
                <User class="w-5 h-5 text-blue-600" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-900">
                  {{ doctor.firstName }} {{ doctor.lastName }}
                </p>
                <p class="text-sm text-gray-600">{{ doctor.specialization }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <Badge variant="outline">{{ doctor.licenseNumber }}</Badge>
                  <span class="text-sm text-gray-500">
                    ${{ doctor.consultationFee }} per visit
                  </span>
                </div>
                <div class="mt-3 text-sm">
                  <span class="text-gray-600">Scheduled days: </span>
                  <span class="font-medium text-gray-900">
                    {{ schedules.filter(s => s.doctorId === doctor.id && s.isAvailable).length }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, Plus, User } from 'lucide-vue-next';
// import { toast } from 'vue-sonner';
import type { DoctorSchedule, Doctor } from '@/types';
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: '2',
    email: 'doctor@clinic.com',
    firstName: 'Dr. Sarah',
    lastName: 'Smith',
    role: 'doctor',
    specialization: 'General Medicine',
    licenseNumber: 'MD12345',
    consultationFee: 100,
  },
  {
    id: '5',
    email: 'doctor2@clinic.com',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    role: 'doctor',
    specialization: 'Cardiology',
    licenseNumber: 'MD12346',
    consultationFee: 150,
  },
];

const MOCK_SCHEDULES: DoctorSchedule[] = [
  {
    id: '1',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-19',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isAvailable: true,
  },
  {
    id: '2',
    doctorId: '5',
    doctorName: 'Dr. Michael Chen',
    date: '2026-04-19',
    startTime: '10:00',
    endTime: '16:00',
    slotDuration: 30,
    isAvailable: true,
  },
  {
    id: '3',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-22',
    startTime: '09:00',
    endTime: '13:00',
    slotDuration: 30,
    isAvailable: false,
    reason: 'Medical Conference',
  },
];

const selectedDate = ref(today(getLocalTimeZone())) as any as import('vue').Ref<DateValue | undefined>;
const schedules = ref(MOCK_SCHEDULES);
const dialogOpen = ref(false);

const newSchedule = ref({
  doctorId: '',
  date: '',
  startTime: '09:00',
  endTime: '17:00',
  slotDuration: '30',
  isAvailable: 'true',
  reason: '',
});

const df = new DateFormatter('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
});

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  return df.format(selectedDate.value.toDate(getLocalTimeZone()));
});

const selectedDateStr = computed(() => {
  if (!selectedDate.value) return '';
  // Convert standard JS Date formatted as YYYY-MM-DD
  return selectedDate.value.toString();
});

const daySchedules = computed(() => {
  return schedules.value.filter(s => s.date === selectedDateStr.value);
});

const handleAddSchedule = () => {
  if (!newSchedule.value.doctorId || !selectedDate.value) {
    // toast.error('Please fill all required fields');
    return;
  }

  const doctor = MOCK_DOCTORS.find(d => d.id === newSchedule.value.doctorId);
  if (!doctor) return;

  const schedule: DoctorSchedule = {
    id: Math.random().toString(36).substr(2, 9),
    doctorId: newSchedule.value.doctorId,
    doctorName: `${doctor.firstName} ${doctor.lastName}`,
    date: selectedDateStr.value,
    startTime: newSchedule.value.startTime,
    endTime: newSchedule.value.endTime,
    slotDuration: parseInt(newSchedule.value.slotDuration, 10),
    isAvailable: newSchedule.value.isAvailable === 'true',
    reason: newSchedule.value.reason || undefined,
  };

  schedules.value.push(schedule);
  dialogOpen.value = false;
  newSchedule.value = {
    doctorId: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: '30',
    isAvailable: 'true',
    reason: '',
  };
  // toast.success('Schedule added successfully');
};
</script>
