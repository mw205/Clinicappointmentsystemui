<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Queue Management</h1>
      <p class="text-gray-500 mt-1">Monitor waiting room and patient flow</p>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center gap-2">
            <Users class="w-4 h-4" />
            Patients Waiting
          </CardDescription>
          <CardTitle class="text-3xl text-blue-600">{{ checkedInCount }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center gap-2">
            <Timer class="w-4 h-4" />
            Average Wait Time
          </CardDescription>
          <CardTitle class="text-3xl text-teal-600">{{ Math.round(avgWaitTime) }} min</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center gap-2">
            <Clock class="w-4 h-4" />
            Today's Appointments
          </CardDescription>
          <CardTitle class="text-3xl text-purple-600">{{ queue.length }}</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Search -->
    <Card>
      <CardHeader>
        <div class="flex items-center gap-3">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by patient or doctor name..."
              v-model="searchTerm"
              class="pl-10"
            />
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- Queue List -->
    <Card>
      <CardHeader>
        <CardTitle>Waiting Room</CardTitle>
        <CardDescription>Real-time patient queue status</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs default-value="all" class="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Patients ({filteredQueue.length})</TabsTrigger>
            <TabsTrigger value="waiting">
              Checked In ({{ filteredQueue.filter(a => a.status === 'checked-in').length }})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({{ filteredQueue.filter(a => a.status === 'confirmed').length }})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" class="space-y-3">
            <div v-if="filteredQueue.length === 0" class="text-center py-12">
              <Users class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-gray-500">No patients in queue</p>
            </div>
            <template v-else>
              <div
                v-for="apt in filteredQueue"
                :key="apt.id"
                :class="[
                  'p-4 rounded-lg border-2 transition-all',
                  apt.status === 'checked-in'
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-gray-200 bg-white'
                ]"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-4 flex-1">
                    <div :class="['p-2 rounded-lg', apt.status === 'checked-in' ? 'bg-green-100' : 'bg-blue-100']">
                      <Users :class="['w-5 h-5', apt.status === 'checked-in' ? 'text-green-600' : 'text-blue-600']" />
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-3 flex-wrap">
                        <p class="font-medium text-gray-900">{{ apt.patientName }}</p>
                        <Badge variant="outline" class="capitalize">
                          {{ apt.type }}
                        </Badge>
                        <Badge
                          v-if="apt.status === 'checked-in' && calculateWaitTime(apt.checkInTime) > 0"
                          :class="[`${getWaitTimeColor(calculateWaitTime(apt.checkInTime))} bg-transparent border-current`]"
                        >
                          <Timer class="w-3 h-3 mr-1" />
                          Waiting {{ calculateWaitTime(apt.checkInTime) }} min
                        </Badge>
                      </div>
                      <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                        <div class="flex items-center gap-1">
                          <span class="text-gray-500">Doctor:</span>
                          <span class="font-medium">{{ apt.doctorName }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <Clock class="w-4 h-4" />
                          <span>{{ apt.startTime }} - {{ apt.endTime }}</span>
                        </div>
                        <div v-if="apt.checkInTime" class="flex items-center gap-1">
                          <span class="text-gray-500">Checked in:</span>
                          <span>{{ apt.checkInTime }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2 items-end">
                    <Badge v-if="apt.status === 'checked-in'" class="bg-green-600">In Queue</Badge>
                    <Badge v-else variant="outline" class="text-blue-600">Confirmed</Badge>
                  </div>
                </div>
              </div>
            </template>
          </TabsContent>

          <TabsContent value="waiting">
            <template v-for="apt in filteredQueue.filter(a => a.status === 'checked-in')" :key="apt.id">
              <div class="p-4 rounded-lg border-2 border-green-200 bg-green-50/50 mb-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ apt.patientName }}</p>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ apt.doctorName }} &bull; {{ apt.startTime }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p :class="['text-2xl font-semibold', getWaitTimeColor(calculateWaitTime(apt.checkInTime))]">
                      {{ calculateWaitTime(apt.checkInTime) }} min
                    </p>
                    <p class="text-xs text-gray-500">Wait time</p>
                  </div>
                </div>
              </div>
            </template>
          </TabsContent>

          <TabsContent value="upcoming">
            <template v-for="apt in filteredQueue.filter(a => a.status === 'confirmed')" :key="apt.id">
              <div class="p-4 rounded-lg border border-gray-200 mb-3">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900">{{ apt.patientName }}</p>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ apt.doctorName }} &bull; {{ apt.startTime }}
                    </p>
                  </div>
                  <Badge variant="outline" class="text-blue-600">Upcoming</Badge>
                </div>
              </div>
            </template>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// import { Button } from '../../ui/button';

const MOCK_WAITING_ROOM = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "2",
    doctorName: "Dr. Sarah Smith",
    date: "2026-04-19",
    startTime: "09:00",
    endTime: "09:30",
    duration: 30,
    status: "checked-in",
    type: "consultation",
    checkInTime: "08:45",
  },
  {
    id: "2",
    patientId: "3",
    patientName: "Jane Smith",
    doctorId: "2",
    doctorName: "Dr. Sarah Smith",
    date: "2026-04-19",
    startTime: "09:30",
    endTime: "10:00",
    duration: 30,
    status: "confirmed",
    type: "follow-up",
  },
  {
    id: "3",
    patientId: "4",
    patientName: "Robert Johnson",
    doctorId: "5",
    doctorName: "Dr. Michael Chen",
    date: "2026-04-19",
    startTime: "10:00",
    endTime: "10:15",
    duration: 15,
    status: "checked-in",
    type: "consultation",
    checkInTime: "09:50",
  },
];

const queue = ref(MOCK_WAITING_ROOM);
const searchTerm = ref("");

const calculateWaitTime = (checkInTime) => {
  if (!checkInTime) return 0;
  const now = new Date();
  const [hours, minutes] = checkInTime.split(":");
  const checkedIn = new Date();
  checkedIn.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);
  const diffMs = now.getTime() - checkedIn.getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

const getWaitTimeColor = (minutes) => {
  if (minutes < 10) return "text-green-600";
  if (minutes < 20) return "text-yellow-600";
  return "text-red-600";
};

const filteredQueue = computed(() => {
  return queue.value.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.value.toLowerCase()),
  );
});

const checkedInCount = computed(() => {
  return queue.value.filter((a) => a.status === "checked-in").length;
});

const avgWaitTime = computed(() => {
  const waitTimes = queue.value
    .filter((a) => a.checkInTime)
    .map((a) => calculateWaitTime(a.checkInTime));
  if (waitTimes.length === 0) return 0;
  return (
    waitTimes.reduce((acc, curr) => acc + curr, 0) / checkedInCount.value || 0
  );
});
</script>
