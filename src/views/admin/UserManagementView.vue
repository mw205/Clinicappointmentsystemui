<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">User Management</h1>
        <p class="text-gray-500 mt-1">Manage all system users and roles</p>
      </div>
      <Button class="bg-blue-600 hover:bg-blue-700" @click="handleOpenDialog()">
        <Plus class="w-4 h-4 mr-2" />
        Add User
      </Button>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Total Users</CardDescription>
          <CardTitle class="text-2xl">{{ roleStats.total }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Admins</CardDescription>
          <CardTitle class="text-2xl text-purple-600">{{ roleStats.admin }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Doctors</CardDescription>
          <CardTitle class="text-2xl text-blue-600">{{ roleStats.doctor }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Receptionists</CardDescription>
          <CardTitle class="text-2xl text-teal-600">{{ roleStats.receptionist }}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader class="pb-3">
          <CardDescription>Patients</CardDescription>
          <CardTitle class="text-2xl text-gray-600">{{ roleStats.patient }}</CardTitle>
        </CardHeader>
      </Card>
    </div>

    <!-- Filters and Actions -->
    <Card>
      <CardHeader>
        <div class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              v-model="searchTerm"
              class="pl-10"
            />
          </div>
          <div class="flex gap-3">
            <Select v-model="filterRole">
              <SelectTrigger class="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" @click="handleExportCSV">
              <Download class="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-if="filteredUsers.length === 0">
                <TableCell colspan="5" class="text-center py-12 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
              <template v-else>
                <TableRow v-for="user in filteredUsers" :key="user.id">
                  <TableCell class="font-medium">
                    {{ user.firstName }} {{ user.lastName }}
                  </TableCell>
                  <TableCell>{{ user.email }}</TableCell>
                  <TableCell>{{ user.phone || '-' }}</TableCell>
                  <TableCell>
                    <Badge :class="getRoleBadgeColor(user.role)" variant="secondary">
                      {{ user.role }}
                    </Badge>
                  </TableCell>
                  <TableCell class="text-right">
                    <div class="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="handleOpenDialog(user)"
                      >
                        <Edit class="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        @click="() => { userToDelete = user.id; deleteDialogOpen = true; }"
                      >
                        <Trash2 class="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>{{ editingUser ? 'Edit User' : 'Add New User' }}</DialogTitle>
          <DialogDescription>
            {{ editingUser ? 'Update user information' : 'Create a new user account' }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <Label>First Name *</Label>
              <Input
                v-model="formData.firstName"
                placeholder="John"
              />
            </div>
            <div class="space-y-2">
              <Label>Last Name *</Label>
              <Input
                v-model="formData.lastName"
                placeholder="Doe"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              v-model="formData.email"
              placeholder="user@example.com"
            />
          </div>

          <div class="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              v-model="formData.phone"
              placeholder="+1 234 567 8900"
            />
          </div>

          <div class="space-y-2">
            <Label>Role *</Label>
            <Select v-model="formData.role">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <Button variant="outline" @click="dialogOpen = false">Cancel</Button>
          <Button @click="handleSaveUser">
            {{ editingUser ? 'Update User' : 'Create User' }}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="deleteDialogOpen = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleDeleteUser" class="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
// import { toast } from 'vue-sonner';

const MOCK_USERS = [
  {
    id: "1",
    email: "patient@clinic.com",
    firstName: "John",
    lastName: "Doe",
    role: "patient",
    phone: "+1234567890",
  },
  {
    id: "2",
    email: "doctor@clinic.com",
    firstName: "Dr. Sarah",
    lastName: "Smith",
    role: "doctor",
    phone: "+1234567891",
  },
  {
    id: "3",
    email: "reception@clinic.com",
    firstName: "Emily",
    lastName: "Johnson",
    role: "receptionist",
    phone: "+1234567892",
  },
  {
    id: "4",
    email: "admin@clinic.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    phone: "+1234567893",
  },
  {
    id: "5",
    email: "jane.patient@example.com",
    firstName: "Jane",
    lastName: "Wilson",
    role: "patient",
    phone: "+1234567894",
  },
  {
    id: "6",
    email: "dr.chen@clinic.com",
    firstName: "Dr. Michael",
    lastName: "Chen",
    role: "doctor",
    phone: "+1234567895",
  },
];

const users = ref(MOCK_USERS);
const searchTerm = ref("");
const filterRole = ref("all");
const dialogOpen = ref(false);
const editingUser = ref(null);
const deleteDialogOpen = ref(false);
const userToDelete = ref(null);

const formData = ref({
  email: "",
  firstName: "",
  lastName: "",
  role: "patient",
  phone: "",
});

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesRole =
      filterRole.value === "all" || user.role === filterRole.value;

    return matchesSearch && matchesRole;
  });
});

const handleOpenDialog = (user) => {
  if (user) {
    editingUser.value = user;
    formData.value = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone || "",
    };
  } else {
    editingUser.value = null;
    formData.value = {
      email: "",
      firstName: "",
      lastName: "",
      role: "patient",
      phone: "",
    };
  }
  dialogOpen.value = true;
};

const handleSaveUser = () => {
  if (
    !formData.value.email ||
    !formData.value.firstName ||
    !formData.value.lastName
  ) {
    // toast.error('Please fill all required fields');
    return;
  }

  if (editingUser.value) {
    users.value = users.value.map((u) =>
      u.id === editingUser.value.id ? { ...u, ...formData.value } : u,
    );
    // toast.success('User updated successfully');
  } else {
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData.value,
    };
    users.value = [...users.value, newUser];
    // toast.success('User created successfully');
  }

  dialogOpen.value = false;
  editingUser.value = null;
};

const handleDeleteUser = () => {
  if (userToDelete.value) {
    users.value = users.value.filter((u) => u.id !== userToDelete.value);
    // toast.success('User deleted successfully');
    deleteDialogOpen.value = false;
    userToDelete.value = null;
  }
};

const handleExportCSV = () => {
  const headers = ["ID", "First Name", "Last Name", "Email", "Role", "Phone"];
  const rows = filteredUsers.value.map((u) => [
    u.id,
    u.firstName,
    u.lastName,
    u.email,
    u.role,
    u.phone || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);

  // toast.success('CSV exported successfully');
};

const getRoleBadgeColor = (role) => {
  const colors = {
    admin: "bg-purple-100 text-purple-700",
    doctor: "bg-blue-100 text-blue-700",
    receptionist: "bg-teal-100 text-teal-700",
    patient: "bg-gray-100 text-gray-700",
  };
  return colors[role];
};

const roleStats = computed(() => {
  return {
    total: users.value.length,
    admin: users.value.filter((u) => u.role === "admin").length,
    doctor: users.value.filter((u) => u.role === "doctor").length,
    receptionist: users.value.filter((u) => u.role === "receptionist").length,
    patient: users.value.filter((u) => u.role === "patient").length,
  };
});
</script>
