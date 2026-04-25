<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Doctor Schedules</h1>
        <p class="text-gray-500 mt-1">Manage weekly availability and date-specific exceptions</p>
      </div>
      <div class="flex gap-2">
        <Dialog v-model:open="weeklyDialogOpen">
          <DialogTrigger as-child>
            <Button variant="outline">
              <Clock class="w-4 h-4 mr-2" />
              Manage Weekly Patterns
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Weekly Availability Patterns</DialogTitle>
              <DialogDescription>Set recurring working hours for doctors</DialogDescription>
            </DialogHeader>
            
            <div class="space-y-6 py-4">
              <div class="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div class="flex-1 space-y-2">
                  <Label>Select Doctor</Label>
                  <Select v-model="selectedWeeklyDoctorId">
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="doctor in MOCK_DOCTORS" :key="doctor.id" :value="doctor.id">
                        {{ doctor.firstName }} {{ doctor.lastName }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div v-if="selectedWeeklyDoctorId" class="grid gap-4">
                <div 
                  v-for="day in DAYS" 
                  :key="day.value"
                  class="flex items-center gap-4 p-3 border rounded-lg"
                >
                  <div class="w-32 font-medium">{{ day.label }}</div>
                  
                  <template v-if="getWeeklyForDay(day.value)">
                    <div class="flex-1 grid grid-cols-3 gap-3">
                      <Input type="time" v-model="getWeeklyForDay(day.value)!.startTime" size="sm" />
                      <Input type="time" v-model="getWeeklyForDay(day.value)!.endTime" size="sm" />
                      <Select v-model="getWeeklyForDay(day.value)!.slotDuration">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 min</SelectItem>
                          <SelectItem value="30">30 min</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      @click="removeWeeklyDay(day.value)"
                      class="text-red-500"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </template>
                  
                  <Button v-else variant="outline" size="sm" @click="addWeeklyDay(day.value)">
                    <Plus class="w-3 h-3 mr-1" /> Add Hours
                  </Button>
                </div>
              </div>
              <div v-else class="text-center py-12 text-gray-500 border-2 border-dashed rounded-xl">
                Select a doctor to manage their recurring weekly schedule
              </div>
            </div>
            
            <DialogFooter>
              <Button @click="weeklyDialogOpen = false">Save Patterns</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog v-model:open="exceptionDialogOpen">
          <DialogTrigger as-child>
            <Button class="bg-blue-600 hover:bg-blue-700">
              <Plus class="w-4 h-4 mr-2" />
              Add Exception
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Schedule Exception</DialogTitle>
              <DialogDescription>Block time or add one-off availability</DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label>Doctor</Label>
                <Select v-model="newException.doctorId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="doctor in MOCK_DOCTORS" :key="doctor.id" :value="doctor.id">
                      {{ doctor.firstName }} {{ doctor.lastName }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-2">
                  <Label>Start Time</Label>
                  <Input type="time" v-model="newException.startTime" />
                </div>
                <div class="space-y-2">
                  <Label>End Time</Label>
                  <Input type="time" v-model="newException.endTime" />
                </div>
              </div>

              <div class="space-y-2">
                <Label>Status</Label>
                <Select v-model="newException.isAvailable">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Available (Extra Shift)</SelectItem>
                    <SelectItem value="false">Blocked (Vacation/Off)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  placeholder="e.g., Vacation, Medical Leave"
                  v-model="newException.reason"
                  :rows="2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="exceptionDialogOpen = false">Cancel</Button>
              <Button @click="handleAddException">Add Exception</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <Tabs default-value="daily" class="space-y-6">
      <TabsList>
        <TabsTrigger value="daily">Daily Schedule Viewer</TabsTrigger>
        <TabsTrigger value="overview">Staff Overview</TabsTrigger>
      </TabsList>

      <TabsContent value="daily" class="grid gap-6 lg:grid-cols-3">
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
              Showing weekly patterns and exceptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="combinedDaySchedules.length === 0" class="text-center py-12">
              <CalendarIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">No doctors scheduled for this date</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="schedule in combinedDaySchedules"
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
                      <div class="flex items-center gap-2">
                        <p class="font-medium text-gray-900">{{ schedule.doctorName }}</p>
                        <Badge v-if="schedule.isException" variant="outline" class="text-[10px] h-4">Exception</Badge>
                      </div>
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
                  <div class="flex flex-col items-end gap-2">
                    <Badge :class="schedule.isAvailable ? 'bg-green-600' : 'bg-red-600'">
                      {{ schedule.isAvailable ? 'Available' : 'Blocked' }}
                    </Badge>
                    <Button 
                      v-if="schedule.isException" 
                      variant="ghost" 
                      size="icon" 
                      class="h-8 w-8 text-gray-400 hover:text-red-500"
                      @click="removeException(schedule.id)"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="overview">
        <!-- All Doctors Overview -->
        <Card>
          <CardHeader>
            <CardTitle>Doctor Availability Summary</CardTitle>
            <CardDescription>Weekly commitment and active exceptions</CardDescription>
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
                    
                    <div class="mt-3">
                      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weekly Patterns</p>
                      <div class="flex flex-wrap gap-1 mt-1">
                        <Badge 
                          v-for="pattern in weeklySchedules.filter(s => s.doctorId === doctor.id)" 
                          :key="pattern.id"
                          variant="secondary"
                          class="text-[10px]"
                        >
                          {{ DAYS[pattern.dayOfWeek].label.substring(0, 3) }}: {{ pattern.startTime }}
                        </Badge>
                        <span v-if="!weeklySchedules.some(s => s.doctorId === doctor.id)" class="text-xs text-gray-400">None set</span>
                      </div>
                    </div>

                    <div class="mt-3">
                      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Upcoming Exceptions</p>
                      <div class="space-y-1 mt-1">
                        <div 
                          v-for="exc in exceptions.filter(s => s.doctorId === doctor.id).slice(0, 2)" 
                          :key="exc.id"
                          class="text-xs flex items-center justify-between"
                        >
                          <span :class="exc.isAvailable ? 'text-green-600' : 'text-red-600'">
                            {{ exc.date }}: {{ exc.isAvailable ? 'Extra' : 'Off' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, Plus, User, Trash2, CalendarDays } from 'lucide-vue-next';
import type { DoctorSchedule, WeeklySchedule, Doctor } from '@/types';
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

const DAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

// State
const selectedDate = ref(today(getLocalTimeZone())) as any as import('vue').Ref<DateValue | undefined>;
const weeklyDialogOpen = ref(false);
const exceptionDialogOpen = ref(false);
const selectedWeeklyDoctorId = ref('');

const weeklySchedules = ref<WeeklySchedule[]>([
  { id: 'w1', doctorId: '2', dayOfWeek: 1, startTime: '09:00', endTime: '17:00', slotDuration: 30, isActive: true },
  { id: 'w2', doctorId: '2', dayOfWeek: 3, startTime: '09:00', endTime: '17:00', slotDuration: 30, isActive: true },
  { id: 'w3', doctorId: '5', dayOfWeek: 2, startTime: '10:00', endTime: '18:00', slotDuration: 30, isActive: true },
]);

const exceptions = ref<DoctorSchedule[]>([
  {
    id: 'e1',
    doctorId: '2',
    doctorName: 'Dr. Sarah Smith',
    date: '2026-04-22',
    startTime: '09:00',
    endTime: '13:00',
    slotDuration: 30,
    isAvailable: false,
    reason: 'Medical Conference',
  },
]);

const newException = ref({
  doctorId: '',
  startTime: '09:00',
  endTime: '17:00',
  isAvailable: 'false',
  reason: '',
});

// Helpers
const df = new DateFormatter('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  return df.format(selectedDate.value.toDate(getLocalTimeZone()));
});

const selectedDateStr = computed(() => selectedDate.value?.toString() || '');

const combinedDaySchedules = computed(() => {
  if (!selectedDate.value) return [];
  
  const jsDate = selectedDate.value.toDate(getLocalTimeZone());
  const dayOfWeek = jsDate.getDay();
  const dateStr = selectedDateStr.value;

  // 1. Get weekly patterns for this day
  const dailyFromWeekly = weeklySchedules.value
    .filter(ws => ws.dayOfWeek === dayOfWeek && ws.isActive)
    .map(ws => {
      const doctor = MOCK_DOCTORS.find(d => d.id === ws.doctorId);
      return {
        id: `w-${ws.id}`,
        doctorId: ws.doctorId,
        doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown',
        startTime: ws.startTime,
        endTime: ws.endTime,
        slotDuration: ws.slotDuration,
        isAvailable: true,
        isException: false,
        reason: undefined as string | undefined
      };
    });

  // 2. Get exceptions for this day
  const dailyExceptions = exceptions.value.filter(e => e.date === dateStr);

  // 3. Merge: Exceptions override weekly patterns for the same doctor
  const finalSchedules = [...dailyFromWeekly];
  
  dailyExceptions.forEach(exc => {
    const existingIdx = finalSchedules.findIndex(s => s.doctorId === exc.doctorId);
    if (existingIdx !== -1) {
      // If exception is "Available" (Extra Shift), we might keep both or override. 
      // For simplicity, exceptions override. If it's blocked, it removes availability.
      if (!exc.isAvailable) {
        finalSchedules[existingIdx] = { ...exc, isException: true };
      } else {
        // One-off extra shift
        finalSchedules.push({ ...exc, isException: true });
      }
    } else {
      finalSchedules.push({ ...exc, isException: true });
    }
  });

  return finalSchedules;
});

// Weekly Methods
const getWeeklyForDay = (dayValue: number) => {
  return weeklySchedules.value.find(s => s.doctorId === selectedWeeklyDoctorId.value && s.dayOfWeek === dayValue);
};

const addWeeklyDay = (dayValue: number) => {
  weeklySchedules.value.push({
    id: Math.random().toString(36).substr(2, 9),
    doctorId: selectedWeeklyDoctorId.value,
    dayOfWeek: dayValue,
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isActive: true
  });
};

const removeWeeklyDay = (dayValue: number) => {
  const index = weeklySchedules.value.findIndex(s => s.doctorId === selectedWeeklyDoctorId.value && s.dayOfWeek === dayValue);
  if (index !== -1) weeklySchedules.value.splice(index, 1);
};

// Exception Methods
const handleAddException = () => {
  const doctor = MOCK_DOCTORS.find(d => d.id === newException.value.doctorId);
  if (!doctor || !selectedDate.value) return;

  exceptions.value.push({
    id: Math.random().toString(36).substr(2, 9),
    doctorId: newException.value.doctorId,
    doctorName: `${doctor.firstName} ${doctor.lastName}`,
    date: selectedDateStr.value,
    startTime: newException.value.startTime,
    endTime: newException.value.endTime,
    slotDuration: 30, // Default for exceptions
    isAvailable: newException.value.isAvailable === 'true',
    reason: newException.value.reason,
  });

  exceptionDialogOpen.value = false;
  newException.value = { doctorId: '', startTime: '09:00', endTime: '17:00', isAvailable: 'false', reason: '' };
};

const removeException = (id: string) => {
  exceptions.value = exceptions.value.filter(e => e.id !== id);
};
</script>
