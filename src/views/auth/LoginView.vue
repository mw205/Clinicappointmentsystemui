<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-teal-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-blue-600 rounded-xl">
            <Activity class="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle class="text-2xl">Welcome to HealthCare Clinic</CardTitle>
        <CardDescription>Sign in to manage your appointments</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              v-model="email"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              v-model="password"
              required
              :disabled="isLoading"
            />
          </div>
          <Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700" :disabled="isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            @click="handleSocialLogin('google')"
            :disabled="isLoading"
          >
            <Chrome class="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            variant="outline"
            @click="handleSocialLogin('facebook')"
            :disabled="isLoading"
          >
            <Facebook class="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </div>

        <div class="text-center text-sm">
          <span class="text-gray-500">Don't have an account? </span>
          <button
            @click="router.push('/signup')"
            class="text-blue-600 hover:underline font-medium"
            :disabled="isLoading"
          >
            Sign up
          </button>
        </div>

        <div class="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
          <p class="font-medium mb-1">Demo Credentials:</p>
          <p>Patient: patient@clinic.com</p>
          <p>Doctor: doctor@clinic.com</p>
          <p>Receptionist: reception@clinic.com</p>
          <p>Admin: admin@clinic.com</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getDefaultRouteForRole, useAuth } from "@/composables/useAuth";
// import { toast } from 'vue-sonner'; // You'll need to install vue-sonner

const router = useRouter();
const { login, loginWithSocial, user } = useAuth();

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    await login(email.value, password.value);
    // toast.success('Welcome back!');
    router.push(getDefaultRouteForRole(user.value?.role));
  } catch (error) {
    // toast.error('Invalid credentials. Try: patient@clinic.com');
  } finally {
    isLoading.value = false;
  }
};

const handleSocialLogin = async (provider) => {
  isLoading.value = true;
  try {
    await loginWithSocial(provider);
    // toast.success(`Logged in with ${provider}`);
    router.push(getDefaultRouteForRole(user.value?.role));
  } catch (error) {
    // toast.error('Social login failed');
  } finally {
    isLoading.value = false;
  }
};
</script>
