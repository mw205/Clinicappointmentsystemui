<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Doctor Dashboard</h1>
      <p class="text-gray-500 mt-1">Manage your daily schedule and patient consultations</p>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Total Today</CardDescription>
          <CardTitle class="text-3xl text-blue-600">{{ stats.total }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Confirmed</CardDescription>
          <CardTitle class="text-3xl text-teal-600">{{ stats.confirmed }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Checked In</CardDescription>
          <CardTitle class="text-3xl text-green-600">{{ stats.checkedIn }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Completed</CardDescription>
          <CardTitle class="text-3xl text-gray-600">{{ stats.completed }}</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Today's Queue -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Saturday, April 19, 2026</CardDescription>
          </div>
          <Button variant="outline" @click="handleNavigate('schedules')">
            View Calendar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs default-value="all" class="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({{ queue.length }})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({{ queue.filter(a => a.status === 'pending').length }})</TabsTrigger>
            <TabsTrigger value="checked-in">Checked In ({{ stats.checkedIn }})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" class="space-y-3">
            <div
              v-for="apt in queue"
              :key="apt.id"
              class="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-4 flex-1">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <Users class="w-5 h-5 text-blue-600" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <p class="font-medium text-gray-900">{{ apt.patientName }}</p>
                      <Badge :class="getStatusColor(apt.status)" variant="secondary">
                        {{ apt.status }}
                      </Badge>
                      <Badge
                        v-if="calculateWaitTime(apt.checkInTime) !== null && calculateWaitTime(apt.checkInTime)! > 0"
                        variant="outline"
                        class="text-orange-600"
                      >
                        Waiting {{ calculateWaitTime(apt.checkInTime) }} min
                      </Badge>
                    </div>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span class="flex items-center gap-1">
                        <Clock class="w-4 h-4" />
                        {{ apt.startTime }} - {{ apt.endTime }}
                      </span>
                      <span class="capitalize">{{ apt.type }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex gap-2 flex-shrink-0">
                  <template v-if="apt.status === 'pending'">
                    <Button size="sm" variant="outline" @click="handleConfirm(apt.id)">
                      <CheckCircle class="w-4 h-4 mr-1" /> Confirm
                    </Button>
                    <Button size="sm" variant="outline" @click="handleDecline(apt.id)">
                      <XCircle class="w-4 h-4 mr-1" /> Decline
                    </Button>
                  </template>

                  <Button
                    v-if="apt.status === 'confirmed'"
                    size="sm"
                    variant="outline"
                    @click="handleCheckIn(apt.id)"
                  >
                    <UserCheck class="w-4 h-4 mr-1" /> Check In
                  </Button>

                  <template v-if="apt.status === 'checked-in'">
                    <Button
                      size="sm"
                      class="bg-green-600 hover:bg-green-700"
                      @click="handleComplete(apt.id)"
                    >
                      Start Consultation
                    </Button>
                    <Button size="sm" variant="outline" @click="handleNoShow(apt.id)">
                      No Show
                    </Button>
                  </template>

                  <Button
                    v-if="apt.status === 'completed'"
                    size="sm"
                    variant="outline"
                    @click="handleNavigate('records')"
                  >
                    View Record
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div
              v-for="apt in queue.filter(a => a.status === 'pending')"
              :key="apt.id"
              class="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50 mb-3"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ apt.patientName }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ apt.startTime }} - {{ apt.endTime }}</p>
                </div>
                <div class="flex gap-2">
                  <Button size="sm" @click="handleConfirm(apt.id)">Confirm</Button>
                  <Button size="sm" variant="outline" @click="handleDecline(apt.id)">Decline</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checked-in">
            <div
              v-for="apt in queue.filter(a => a.status === 'checked-in')"
              :key="apt.id"
              class="p-4 rounded-lg border border-green-200 bg-green-50/50 mb-3"
            >
              <div class="flex items-start justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ apt.patientName }}</p>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ apt.startTime }} - {{ apt.endTime }}
                    <span v-if="apt.checkInTime"> &bull; Checked in at {{ apt.checkInTime }}</span>
                  </p>
                </div>
                <Button size="sm" class="bg-green-600" @click="handleComplete(apt.id)">
                  Start Consultation
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
// import { toast } from 'vue-sonner';

const router = useRouter();

const MOCK_TODAY_QUEUE = [
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
    checkInTime: "08:55",
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
    doctorId: "2",
    doctorName: "Dr. Sarah Smith",
    date: "2026-04-19",
    startTime: "10:00",
    endTime: "10:15",
    duration: 15,
    status: "confirmed",
    type: "consultation",
  },
  {
    id: "4",
    patientId: "5",
    patientName: "Maria Garcia",
    doctorId: "2",
    doctorName: "Dr. Sarah Smith",
    date: "2026-04-19",
    startTime: "10:15",
    endTime: "10:45",
    duration: 30,
    status: "pending",
    type: "consultation",
  },
];

const queue = ref(MOCK_TODAY_QUEUE);

const handleCheckIn = (id) => {
  queue.value = queue.value.map((apt) =>
    apt.id === id
      ? {
          ...apt,
          status: "checked-in",
          checkInTime: new Date().toLocaleTimeString(),
        }
      : apt,
  );
  // toast.success('Patient checked in');
};

const handleComplete = (id) => {
  handleNavigate("emr-form");
};

const handleNoShow = (id) => {
  queue.value = queue.value.map((apt) =>
    apt.id === id ? { ...apt, status: "no-show" } : apt,
  );
  // toast.info('Marked as no-show');
};

const handleConfirm = (id) => {
  queue.value = queue.value.map((apt) =>
    apt.id === id ? { ...apt, status: "confirmed" } : apt,
  );
  // toast.success('Appointment confirmed');
};

const handleDecline = (id) => {
  queue.value = queue.value.map((apt) =>
    apt.id === id
      ? { ...apt, status: "cancelled", cancelReason: "Declined by doctor" }
      : apt,
  );
  // toast.error('Appointment declined');
};

const getStatusColor = (status) => {
  const colors = {
    "checked-in": "bg-green-100 text-green-700",
    confirmed: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-gray-100 text-gray-700",
    cancelled: "bg-red-100 text-red-700",
    "no-show": "bg-orange-100 text-orange-700",
  };
  return colors[status] || colors.pending;
};

const calculateWaitTime = (checkInTime) => {
  if (!checkInTime) return null;
  const now = new Date();
  const checkedIn = new Date(`2026-04-19 ${checkInTime}`);
  const diffMs = now.getTime() - checkedIn.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins;
};

const stats = computed(() => ({
  total: queue.value.length,
  confirmed: queue.value.filter((a) => a.status === "confirmed").length,
  checkedIn: queue.value.filter((a) => a.status === "checked-in").length,
  completed: queue.value.filter((a) => a.status === "completed").length,
}));

const handleNavigate = (path) => {
  router.push(`/doctor/${path}`);
};
</script>
