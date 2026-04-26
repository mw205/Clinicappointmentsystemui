<template>
  <div v-if="user" class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="flex flex-col h-full">
        <!-- Logo -->

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <div class="space-y-1">
            <button v-for="item in visibleNavItems" :key="item.path" @click="handleNavigate(item.path)" :class="[
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActivePath(item.path)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            ]">
              <component :is="item.icon" class="w-5 h-5" />
              {{ item.label }}
            </button>
          </div>
        </nav>

        <!-- User Profile -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50">
            <Avatar class="h-9 w-9">
              <AvatarFallback class="bg-blue-600 text-white text-sm">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user.firstName }} {{ user.lastName }}
              </p>
              <p class="text-xs text-gray-500 capitalize">{{ user.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { useAuth } from "@/composables/useAuth";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  LayoutDashboard,
  Users,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "dashboard",
    roles: ["patient", "doctor", "receptionist", "admin"],
  },
  {
    label: "Appointments",
    icon: Calendar,
    path: "appointments",
    roles: ["patient", "doctor", "receptionist"],
  },
  {
    label: "Medical Records",
    icon: FileText,
    path: "records",
    roles: ["patient", "doctor"],
  },
  {
    label: "Queue Management",
    icon: Clock,
    path: "queue",
    roles: ["receptionist", "doctor"],
  },
  {
    label: "Doctor Schedules",
    icon: ClipboardList,
    path: "schedules",
    roles: ["receptionist", "admin", "doctor"],
  },
  { label: "Analytics", icon: BarChart3, path: "analytics", roles: ["admin"] },
  { label: "User Management", icon: Users, path: "users", roles: ["admin"] },
];

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();
const sidebarOpen = ref(false);

const userInitials = computed(() => {
  if (!user.value) return "";
  return `${user.value.firstName[0]}${user.value.lastName[0]}`;
});

const visibleNavItems = computed(() => {
  if (!user.value) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(user.value.role));
});

const routeNameFormatted = computed(() => {
  if (route.name && typeof route.name === "string") {
    return route.name.replace(/-/g, " ");
  }
  return "Dashboard";
});

const isActivePath = (path) => {
  if (route.path.includes(path)) return true;
  return route.name?.toString().includes(path);
};

const handleNavigate = (path) => {
  sidebarOpen.value = false;
  if (!user.value) return;
  const role = user.value.role;
  // Based on current routing setup, prefix path with role
  if (path === "profile") {
    // Handle profile specifically if needed
  } else {
    // Attempt standard navigation
    router.push(`/${role}/${path}`);
  }
};

const handleLogout = () => {
  logout();
  router.push("/login");
};
</script>
