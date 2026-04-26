import { ref, computed } from "vue";

// Global state using Vue reactivity
const user = ref(null);
const isLoading = ref(true);
const isInitialized = ref(false);

const API_BASE_URL = "/api"; // Set DRF server base URL here

export const getDefaultRouteForRole = (role) => {
  switch (role) {
    case "patient":
      return "/patient/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "receptionist":
      return "/receptionist/queue";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/login";
  }
};

const getDemoRoleFromEmail = (email) => {
  const prefix = email.split("@")[0].toLowerCase();

  if (prefix === "reception") {
    return "receptionist";
  }

  if (["patient", "doctor", "receptionist", "admin"].includes(prefix)) {
    return prefix;
  }

  return null;
};

const getAuthHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("clinic_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const useAuth = () => {
  const isAuthenticated = computed(() => !!user.value);

  const checkSession = async () => {
    isLoading.value = true;
    try {
      const storedUser = localStorage.getItem("clinic_user");
      if (storedUser) {
        user.value = JSON.parse(storedUser);
      }
      // Optional: actually check token validity against DRF
      // const response = await fetch(`${API_BASE_URL}/auth/me/`, { headers: getAuthHeaders() });
      // if (response.ok) {
      //   user.value = await response.json();
      // } else {
      //   logout();
      // }
    } finally {
      isInitialized.value = true;
      isLoading.value = false;
    }
  };

  const login = async (email, password) => {
    try {
      // Real DRF endpoints integration logic
      /*
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Invalid credentials');
      
      const data = await response.json();
      localStorage.setItem('clinic_token', data.access_token);
      user.value = data.user;
      localStorage.setItem('clinic_user', JSON.stringify(data.user));
      */

      // Fallback Demo Logic
      await new Promise((resolve) => setTimeout(resolve, 800));
      const role = getDemoRoleFromEmail(email);

      if (!role) {
        throw new Error("Invalid demo role credentials");
      }

      const mockUser = {
        id: "1",
        email,
        firstName: "Demo",
        lastName: "User",
        role,
        phone: "123",
      };
      user.value = mockUser;
      localStorage.setItem("clinic_user", JSON.stringify(mockUser));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const loginWithSocial = async (provider) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: `${provider}user@example.com`,
      firstName: "Social",
      lastName: "User",
      role: "patient",
    };
    user.value = mockUser;
    localStorage.setItem("clinic_user", JSON.stringify(mockUser));
  };

  const signup = async (data) => {
    /* DRF Integration:
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Signup failed');
    */
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = { ...data, id: Math.random().toString(36).substring(2, 9) };
    user.value = newUser;
    localStorage.setItem("clinic_user", JSON.stringify(newUser));
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem("clinic_user");
    localStorage.removeItem("clinic_token");
    // Optional: await fetch(`${API_BASE_URL}/auth/logout/`, { method: 'POST', headers: getAuthHeaders() });
  };

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated,
    checkSession,
    login,
    loginWithSocial,
    signup,
    logout,
    getAuthHeaders,
  };
};
