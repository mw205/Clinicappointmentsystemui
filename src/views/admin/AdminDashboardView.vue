<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-500 mt-1">System overview and analytics</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center justify-between">
            <span>Total Appointments</span>
            <Calendar class="w-4 h-4 text-blue-600" />
          </CardDescription>
          <CardTitle class="text-3xl text-blue-600">{{ totalAppointments }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 text-sm">
            <TrendingUp class="w-4 h-4 text-green-600" />
            <span class="text-green-600">+12.5%</span>
            <span class="text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center justify-between">
            <span>No-Show Rate</span>
            <AlertCircle class="w-4 h-4 text-red-600" />
          </CardDescription>
          <CardTitle class="text-3xl text-red-600">{{ noShowRate }}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 text-sm">
            <TrendingDown class="w-4 h-4 text-green-600" />
            <span class="text-green-600">-2.3%</span>
            <span class="text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center justify-between">
            <span>Completion Rate</span>
            <Users class="w-4 h-4 text-green-600" />
          </CardDescription>
          <CardTitle class="text-3xl text-green-600">{{ completionRate }}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 text-sm">
            <TrendingUp class="w-4 h-4 text-green-600" />
            <span class="text-green-600">+5.2%</span>
            <span class="text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-3">
          <CardDescription class="flex items-center justify-between">
            <span>Total Revenue</span>
            <DollarSign class="w-4 h-4 text-teal-600" />
          </CardDescription>
          <CardTitle class="text-3xl text-teal-600">${{ (totalRevenue / 1000).toFixed(1) }}K</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 text-sm">
            <TrendingUp class="w-4 h-4 text-green-600" />
            <span class="text-green-600">+18.7%</span>
            <span class="text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Peak Hours Analysis</CardTitle>
          <CardDescription>Appointment distribution throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 bg-gray-50">
            <BarChart2 class="w-8 h-8 mb-2 text-gray-400" />
            <p>Chart Placeholder</p>
            <p class="text-xs max-w-xs text-center mt-1">Install @unovis/vue or your preferred Charting library to render the BarChart.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Status Distribution</CardTitle>
          <CardDescription>Breakdown of appointment outcomes</CardDescription>
        </CardHeader>
        <CardContent class="flex items-center justify-center">
          <div class="h-[300px] w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 bg-gray-50">
            <PieChart class="w-8 h-8 mb-2 text-gray-400" />
            <p>Chart Placeholder</p>
            <p class="text-xs max-w-xs text-center mt-1">Requires standard PieChart integration.</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Revenue Trend -->
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Monthly revenue overview (simulation)</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 bg-gray-50">
          <TrendingUp class="w-8 h-8 mb-2 text-gray-400" />
          <p>Chart Placeholder</p>
          <p class="text-xs max-w-xs text-center mt-1">Requires standard LineChart integration.</p>
        </div>
      </CardContent>
    </Card>

    <!-- Stats Summary -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Active Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center">
            <p class="text-4xl font-semibold text-blue-600">8</p>
            <p class="text-sm text-gray-500 mt-2">Across 5 specializations</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center">
            <p class="text-4xl font-semibold text-teal-600">342</p>
            <p class="text-sm text-gray-500 mt-2">+24 this month</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Avg. Wait Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-center">
            <p class="text-4xl font-semibold text-purple-600">12 min</p>
            <p class="text-sm text-gray-500 mt-2">Below 15 min target</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const PEAK_HOURS_DATA = [
  { hour: "9 AM", count: 12 },
  { hour: "10 AM", count: 18 },
  { hour: "11 AM", count: 22 },
  { hour: "12 PM", count: 15 },
  { hour: "1 PM", count: 10 },
  { hour: "2 PM", count: 20 },
  { hour: "3 PM", count: 25 },
  { hour: "4 PM", count: 19 },
  { hour: "5 PM", count: 8 },
];

const APPOINTMENT_STATUS_DATA = [
  { name: "Completed", value: 145, color: "#10b981" },
  { name: "No-Show", value: 23, color: "#ef4444" },
  { name: "Cancelled", value: 18, color: "#f59e0b" },
  { name: "Pending", value: 12, color: "#3b82f6" },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 12500 },
  { month: "Feb", revenue: 15800 },
  { month: "Mar", revenue: 14200 },
  { month: "Apr", revenue: 18900 },
];

// Computed
const totalAppointments = computed(() =>
  APPOINTMENT_STATUS_DATA.reduce((sum, item) => sum + item.value, 0),
);
const noShowRate = computed(() =>
  ((23 / totalAppointments.value) * 100).toFixed(1),
);
const completionRate = computed(() =>
  ((145 / totalAppointments.value) * 100).toFixed(1),
);
const totalRevenue = computed(() =>
  REVENUE_DATA.reduce((sum, item) => sum + item.revenue, 0),
);
</script>
