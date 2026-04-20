<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" @click="handleBack">
        <ArrowLeft class="w-5 h-5" />
      </Button>
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Book Appointment</h1>
        <p class="text-gray-500">Schedule a consultation with our doctors</p>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="flex items-center justify-center gap-2">
      <div v-for="s in [1, 2, 3, 4]" :key="s" class="flex items-center">
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
            s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          ]"
        >
          {{ s }}
        </div>
        <div
          v-if="s < 4"
          :class="['w-12 h-1', s < step ? 'bg-blue-600' : 'bg-gray-200']"
        />
      </div>
    </div>

    <!-- Step 1: Select Doctor -->
    <Card v-if="step === 1">
      <CardHeader>
        <CardTitle>Select a Doctor</CardTitle>
        <CardDescription>Choose from our available specialists</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <div
          v-for="doctor in MOCK_DOCTORS"
          :key="doctor.id"
          @click="selectDoctor(doctor)"
          :class="[
            'p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
            selectedDoctor?.id === doctor.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          ]"
        >
          <div class="flex items-start justify-between">
            <div class="flex gap-3">
              <div class="p-2 bg-blue-100 rounded-full">
                <User class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p class="font-medium text-gray-900">
                  {{ doctor.firstName }} {{ doctor.lastName }}
                </p>
                <p class="text-sm text-gray-600">{{ doctor.specialization }}</p>
                <Badge variant="secondary" class="mt-2">
                  License: {{ doctor.licenseNumber }}
                </Badge>
              </div>
            </div>
            <div class="text-right">
              <p class="text-lg font-semibold text-gray-900">${{ doctor.consultationFee }}</p>
              <p class="text-xs text-gray-500">Consultation Fee</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Step 2: Select Slot Duration -->
    <Card v-if="step === 2">
      <CardHeader>
        <CardTitle>Select Consultation Duration</CardTitle>
        <CardDescription>Choose your appointment length</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid gap-3 md:grid-cols-2">
          <div
            @click="selectDuration(15)"
            :class="[
              'p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
              slotDuration === 15 ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            ]"
          >
            <div class="text-center">
              <Clock class="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p class="font-semibold text-gray-900">15 Minutes</p>
              <p class="text-sm text-gray-500 mt-1">Quick consultation</p>
            </div>
          </div>
          <div
            @click="selectDuration(30)"
            :class="[
              'p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md',
              slotDuration === 30 ? 'border-teal-600 bg-teal-50' : 'border-gray-200'
            ]"
          >
            <div class="text-center">
              <Clock class="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p class="font-semibold text-gray-900">30 Minutes</p>
              <p class="text-sm text-gray-500 mt-1">Standard consultation</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Step 3: Select Date -->
    <Card v-if="step === 3">
      <CardHeader>
        <CardTitle>Select Date</CardTitle>
        <CardDescription>Choose an available date</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex justify-center">
          <Calendar
            mode="single"
            v-model="selectedDate"
            :disabled="isDateDisabled"
            @update:model-value="onDateSelect"
            class="rounded-md border"
          />
        </div>
      </CardContent>
    </Card>

    <!-- Step 4: Select Time Slot -->
    <Card v-if="step === 4 && selectedDate">
      <CardHeader>
        <CardTitle>Select Time Slot</CardTitle>
        <CardDescription>
          Available {{ slotDuration }}-minute slots on {{ formattedSelectedDate }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
          <Button
            v-for="slot in timeSlots"
            :key="slot.time"
            :variant="selectedSlot === slot.time ? 'default' : 'outline'"
            :disabled="!slot.available"
            @click="selectedSlot = slot.time"
            class="h-auto py-3"
          >
            {{ slot.time }}
          </Button>
        </div>

        <div v-if="selectedSlot" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 class="font-medium text-gray-900 mb-3">Booking Summary</h3>
          <div class="space-y-2 text-sm">
            <p><span class="text-gray-600">Doctor:</span> {{ selectedDoctor?.firstName }} {{ selectedDoctor?.lastName }}</p>
            <p><span class="text-gray-600">Specialization:</span> {{ selectedDoctor?.specialization }}</p>
            <p><span class="text-gray-600">Date:</span> {{ formattedSelectedDate }}</p>
            <p><span class="text-gray-600">Time:</span> {{ selectedSlot }}</p>
            <p><span class="text-gray-600">Duration:</span> {{ slotDuration }} minutes</p>
            <p><span class="text-gray-600">Fee:</span> ${{ selectedDoctor?.consultationFee }}</p>
          </div>
          <Button @click="handleBooking" class="w-full mt-4 bg-blue-600 hover:bg-blue-700">
            Confirm Booking
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User } from 'lucide-vue-next';
import type { Doctor, TimeSlot } from '@/types';
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today,
  CalendarDate,
  getDayOfWeek
} from '@internationalized/date';

const router = useRouter();

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
  {
    id: '6',
    email: 'doctor3@clinic.com',
    firstName: 'Dr. Emily',
    lastName: 'Rodriguez',
    role: 'doctor',
    specialization: 'Pediatrics',
    licenseNumber: 'MD12347',
    consultationFee: 120,
  },
];

const generateTimeSlots = (duration: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 17;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time,
        available: Math.random() > 0.3,
      });
    }
  }

  return slots;
};

const step = ref(1);
const selectedDoctor = ref<Doctor | null>(null);
const selectedDate = ref<DateValue | undefined>();
const selectedSlot = ref<string | null>(null);
const slotDuration = ref<number>(30);

const timeSlots = computed(() => {
  return selectedDate.value ? generateTimeSlots(slotDuration.value) : [];
});

const df = new DateFormatter('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric'
});

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  return df.format(selectedDate.value.toDate(getLocalTimeZone()));
});

// We disable past dates and Sundays based on standard UI Calendar practices
const isDateDisabled = (date: DateValue) => {
  if (date.compare(today(getLocalTimeZone())) < 0) {
    return true; // past date
  }
  // Disable Sunday (0 == Sunday in standard, but for internationalized/date getDayOfWeek returns 0 for Sunday in some locales, let's use week identifier)
  if (getDayOfWeek(date, 'en-US') === 0) {
    return true; // Sunday
  }
  return false;
};

const selectDoctor = (doctor: Doctor) => {
  selectedDoctor.value = doctor;
  step.value = 2;
};

const selectDuration = (duration: number) => {
  slotDuration.value = duration;
  step.value = 3;
};

const onDateSelect = (val: DateValue | undefined) => {
  selectedDate.value = val;
  if (val) {
    step.value = 4;
  }
};

const handleNavigate = (path: string) => {
  router.push(`/patient/${path}`);
};

const handleBack = () => {
  if (step.value > 1) {
    step.value--;
  } else {
    handleNavigate('dashboard');
  }
};

const handleBooking = () => {
  if (!selectedDoctor.value || !selectedDate.value || !selectedSlot.value) {
    // toast.error('Please complete all steps');
    return;
  }

  // toast.success('Appointment booked successfully!');
  setTimeout(() => {
    handleNavigate('dashboard');
  }, 1500);
};
</script>
