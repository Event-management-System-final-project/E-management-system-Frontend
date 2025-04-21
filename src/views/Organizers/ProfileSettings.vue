<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Organizer Profile</h2>
        <button @click="openEditModal" class="text-blue-600 hover:text-blue-900">
          <Edit class="h-5 w-5 inline-block mr-2" />
          Edit Profile
        </button>
      </div>
  
      <div class="mt-6">
        <div class="bg-gray-50 p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold text-gray-800">Profile Information</h3>
          <div class="mt-4">
            <p class="text-gray-700"><strong>Name:</strong> {{ organizer.name }}</p>
            <p class="text-gray-700"><strong>Email:</strong> {{ organizer.email }}</p>
            <p class="text-gray-700"><strong>Phone Number:</strong> {{ organizer.phone }}</p>
          </div>
        </div>
      </div>
  
      <!-- Edit Profile Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Edit Profile</h3>
              <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500">
                <X class="h-5 w-5" />
              </button>
            </div>
          </div>
          <div class="p-6">
            <form @submit.prevent="saveProfile">
              <div class="mb-4">
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="editedOrganizer.name"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="editedOrganizer.email"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  v-model="editedOrganizer.phone"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="closeEditModal"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <ChangePassword/>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { Edit, X } from 'lucide-vue-next';
  import ChangePassword from '@/components/ChangePassword.vue';
  
  const organizer = ref({
    name: '',
    email: '',
    phone: ''
  });
  
  const editedOrganizer = ref({
    name: '',
    email: '',
    phone: ''
  });
  
  const showEditModal = ref(false);
  
  const fetchOrganizerProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/organizer/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      organizer.value = response.data;
      editedOrganizer.value = { ...response.data }; // Copy data for editing
    } catch (error) {
      console.error('Error fetching organizer profile:', error);
    }
  };
  
  const openEditModal = () => {
    showEditModal.value = true;
  };
  
  const closeEditModal = () => {
    showEditModal.value = false;
    editedOrganizer.value = { ...organizer.value }; // Reset edited data
  };
  
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8000/api/organizer/profile', editedOrganizer.value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      organizer.value = { ...editedOrganizer.value }; // Update local state
      closeEditModal();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  
  onMounted(() => {
    fetchOrganizerProfile();
  });
  </script>
  
  <style scoped>
  .bg-white {
    background-color: #ffffff;
  }
  .bg-gray-50 {
    background-color: #f9fafb;
  }
  .text-gray-800 {
    color: #2d3748;
  }
  .text-gray-700 {
    color: #4a5568;
  }
  .text-gray-600 {
    color: #718096;
  }
  .text-blue-600 {
    color: #2563eb;
  }
  .text-blue-900 {
    color: #1d4ed8;
  }
  .text-red-600 {
    color: #e53e3e;
  }
  .text-red-900 {
    color: #c53030;
  }
  .hover\:text-blue-900:hover {
    color: #1d4ed8;
  }
  .hover\:text-red-900:hover {
    color: #c53030;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  .p-6 {
    padding: 1.5rem;
  }
  .mt-6 {
    margin-top: 1.5rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .border-b {
    border-bottom-width: 1px;
  }
  .border-gray-200 {
    border-color: #e2e8f0;
  }
  .flex {
    display: flex;
  }
  .items-center {
    align-items: center;
  }
  .justify-between {
    justify-content: space-between;
  }
  .gap-4 {
    gap: 1rem;
  }
  .space-x-2 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.5rem;
  }
  </style>
  