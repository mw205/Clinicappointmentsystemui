<template>
  <div v-if="user" class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
          <div class="p-2 bg-blue-600 rounded-lg">
            <Activity class="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 class="font-semibold text-gray-900">HealthCare</h1>
            <p class="text-xs text-gray-500">Clinic System</p>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <div class="space-y-1">
            <button
              v-for="item in visibleNavItems"
              :key="item.path"
              @click="handleNavigate(item.path)"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActivePath(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
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

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Header -->
      <header class="sticky top-0 z-40 h-16 bg-white border-b border-gray-200">
        <div class="h-full px-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              class="lg:hidden"
              @click="sidebarOpen = !sidebarOpen"
            >
              <X v-if="sidebarOpen" class="h-5 w-5" />
              <Menu v-else class="h-5 w-5" />
            </Button>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 capitalize">
                {{ routeNameFormatted }}
              </h2>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="ghost" size="icon" class="relative">
              <Bell class="h-5 w-5" />
              <span class="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="gap-2">
                  <Avatar class="h-8 w-8">
                    <AvatarFallback class="bg-blue-600 text-white text-xs">
                      {{ userInitials }}
                    </AvatarFallback>
                  </Avatar>
                  <span class="hidden md:inline text-sm">
                    {{ user.firstName }} {{ user.lastName }}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p class="font-medium">{{ user.firstName }} {{ user.lastName }}</p>
                    <p class="text-xs font-normal text-gray-500">{{ user.email }}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleNavigate('profile')">
                  <Settings class="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout" class="text-red-600">
                  <LogOut class="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 md:p-6 lg:p-8">
        <router-view />      
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Activity,
  Calendar,
  ClipboardList,
  Users,
  LayoutDashboard,
  LogOut,
  Bell,
  Menu,
  X,
  Settings,
  FileText,
  Clock,
  BarChart3,
} from 'lucide-vue-next';

interface NavItem {
  label: string;
  icon: any;
  path: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard', roles: ['patient', 'doctor', 'receptionist', 'admin'] },
  { label: 'Appointments', icon: Calendar, path: 'appointments', roles: ['patient', 'doctor', 'receptionist'] },
  { label: 'Medical Records', icon: FileText, path: 'records', roles: ['patient', 'doctor'] },
  { label: 'Queue Management', icon: Clock, path: 'queue', roles: ['receptionist', 'doctor'] },
  { label: 'Doctor Schedules', icon: ClipboardList, path: 'schedules', roles: ['receptionist', 'admin', 'doctor'] },
  { label: 'Analytics', icon: BarChart3, path: 'analytics', roles: ['admin'] },
  { label: 'User Management', icon: Users, path: 'users', roles: ['admin'] },
];

const router = useRouter();
const route = useRoute();
const { user, logout } = useAuth();
const sidebarOpen = ref(false);

const userInitials = computed(() => {
  if (!user.value) return '';
  return `${user.value.firstName[0]}${user.value.lastName[0]}`;
});

const visibleNavItems = computed(() => {
  if (!user.value) return [];
  return NAV_ITEMS.filter((item) => item.roles.includes(user.value!.role));
});

const routeNameFormatted = computed(() => {
  if (route.name && typeof route.name === 'string') {
    return route.name.replace(/-/g, ' ');
  }
  return 'Dashboard';
});

const isActivePath = (path: string) => {
  if (route.path.includes(path)) return true;
  return route.name?.toString().includes(path);
};

const handleNavigate = (path: string) => {
  sidebarOpen.value = false;
  if (!user.value) return;
  const role = user.value.role;
  // Based on current routing setup, prefix path with role
  if (path === 'profile') {
    // Handle profile specifically if needed
  } else {
    // Attempt standard navigation
    router.push(`/${role}/${path}`);
  }
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
