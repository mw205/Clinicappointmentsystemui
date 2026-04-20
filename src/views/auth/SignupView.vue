<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-teal-50 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1 text-center">
        <div class="flex justify-center mb-4">
          <div class="p-3 bg-teal-600 rounded-xl">
            <Activity class="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle class="text-2xl">Create your account</CardTitle>
        <CardDescription>Enter your details to get started</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <Label for="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                v-model="formData.firstName"
                required
                :disabled="isLoading"
              />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                v-model="formData.lastName"
                required
                :disabled="isLoading"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              v-model="formData.email"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              v-model="formData.phone"
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-2">
            <Label for="role">I am a</Label>
            <Select v-model="formData.role" :disabled="isLoading">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              v-model="formData.password"
              required
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              v-model="formData.confirmPassword"
              required
              :disabled="isLoading"
            />
          </div>

          <Button type="submit" class="w-full bg-teal-600 hover:bg-teal-700" :disabled="isLoading">
            {{ isLoading ? 'Creating account...' : 'Create Account' }}
          </Button>
        </form>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-2 text-gray-500">Or sign up with</span>
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
          <span class="text-gray-500">Already have an account? </span>
          <button
            @click="router.push('/login')"
            class="text-blue-600 hover:underline font-medium"
            :disabled="isLoading"
          >
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getDefaultRouteForRole, useAuth } from '@/composables/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Chrome, Facebook } from 'lucide-vue-next';
import type { UserRole } from '@/types';

const router = useRouter();
const { signup, loginWithSocial, user } = useAuth();

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'patient' as UserRole,
});

const isLoading = ref(false);

const handleSubmit = async () => {
  if (formData.password !== formData.confirmPassword) {
    // toast.error('Passwords do not match');
    return;
  }

  if (formData.password.length < 6) {
    // toast.error('Password must be at least 6 characters');
    return;
  }

  isLoading.value = true;
  try {
    const signupData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: formData.role,
    };
    await signup(signupData);
    // toast.success('Account created successfully!');
    router.push(getDefaultRouteForRole(user.value?.role));
  } catch (error) {
    // toast.error('Signup failed. Please try again.');
  } finally {
    isLoading.value = false;
  }
};

const handleSocialLogin = async (provider: 'google' | 'facebook') => {
  isLoading.value = true;
  try {
    await loginWithSocial(provider);
    // toast.success(`Account created with ${provider}`);
    router.push(getDefaultRouteForRole(user.value?.role));
  } catch (error) {
    // toast.error('Social signup failed');
  } finally {
    isLoading.value = false;
  }
};
</script>
