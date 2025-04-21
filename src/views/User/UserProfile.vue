<script setup>
import { ref, computed } from 'vue';
import { Edit, Upload, Save, X, Lock } from 'lucide-vue-next';

// User data
const user = ref({
  id: '12345',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  avatar: '/placeholder.svg?height=200&width=200',
  role: 'Event Organizer',
});

// Form states
const isEditing = ref(false);
const showSavedMessage = ref(false);
const editedUser = ref({ ...user.value });

// Password change states
const showPasswordForm = ref(false);
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});
const passwordError = ref('');
const passwordSuccess = ref(false);

// Methods
const startEditing = () => {
  editedUser.value = { ...user.value };
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveProfile = () => {
  user.value = { ...editedUser.value };
  isEditing.value = false;
  showSavedMessage.value = true;
  setTimeout(() => {
    showSavedMessage.value = false;
  }, 3000);
};

const togglePasswordForm = () => {
  showPasswordForm.value = !showPasswordForm.value;
  passwordData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  passwordError.value = '';
  passwordSuccess.value = false;
};

const changePassword = () => {
  // Validate passwords
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    passwordError.value = 'New passwords do not match';
    return;
  }

  if (passwordData.value.newPassword.length < 8) {
    passwordError.value = 'Password must be at least 8 characters';
    return;
  }

  // Simulate password change success
  passwordSuccess.value = true;
  passwordError.value = '';

  // Reset form after 3 seconds
  setTimeout(() => {
    passwordSuccess.value = false;
    showPasswordForm.value = false;
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  }, 3000);
};

// Computed
const initials = computed(() => {
  if (!user.value.name) return '';
  return user.value.name
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();
});
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Success Message -->
      <div
        v-if="showSavedMessage"
        class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center justify-between"
      >
        <span>Profile updated successfully!</span>
        <button @click="showSavedMessage = false" class="text-green-700">
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-blue-600 p-6 text-white">
          <div class="flex flex-col sm:flex-row items-center">
            <!-- Avatar -->
            <div class="mb-4 sm:mb-0 sm:mr-6">
              <div v-if="user.avatar" class="w-24 h-24 rounded-full overflow-hidden bg-blue-200">
                <img :src="user.avatar" alt="Profile" class="w-full h-full object-cover" />
              </div>
              <div v-else class="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {{ initials }}
              </div>
            </div>
            <div class="text-center sm:text-left">
              <h1 class="text-2xl font-bold">{{ user.name }}</h1>
               
            </div>
          </div>
        </div>

        <!-- Profile Content -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Profile Information</h2>
            <div class="flex space-x-2">
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
              >
                <Edit class="h-4 w-4 mr-1" />
                Edit Profile
              </button>
              <button
                v-if="!isEditing"
                @click="togglePasswordForm"
                class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center"
              >
                <Lock class="h-4 w-4 mr-1" />
                Change Password
              </button>
            </div>
          </div>

          <!-- View Mode -->
          <div v-if="!isEditing && !showPasswordForm">
            <div class="space-y-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Full Name</h3>
                <p class="mt-1 text-base">{{ user.name }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Email</h3>
                <p class="mt-1 text-base">{{ user.email }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500">Phone</h3>
                <p class="mt-1 text-base">{{ user.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Edit Mode -->
          <div v-if="isEditing">
            <div class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  id="name"
                  v-model="editedUser.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  v-model="editedUser.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  id="phone"
                  v-model="editedUser.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  @click="cancelEditing"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  @click="saveProfile"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                  <Save class="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <!-- Password Change Form -->
          <div v-if="showPasswordForm" class="max-w-md mx-auto">
            <h3 class="text-lg font-medium mb-4">Change Password</h3>

            <div v-if="passwordSuccess" class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
              Password changed successfully!
            </div>

            <div v-if="passwordError" class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {{ passwordError }}
            </div>

            <form @submit.prevent="changePassword" class="space-y-4">
              <div>
                <label for="current-password" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  id="current-password"
                  v-model="passwordData.currentPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="new-password"
                  v-model="passwordData.newPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  id="confirm-password"
                  v-model="passwordData.confirmPassword"
                  type="password"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div class="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  @click="togglePasswordForm"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center"
                >
                  <Save class="h-4 w-4 mr-2" />
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>