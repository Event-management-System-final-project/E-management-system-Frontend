<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar 
      :isOpen="isOpen" 
      class="flex-shrink-0"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header 
        :user="user" 
        @toggle-notifications="toggleNotifications"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '@/views/User/UserSidebar.vue';
import Header from '@/views/User/UserHeader.vue';

// State
const isOpen = ref(true); // Sidebar open state

// Mock user data
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/images/avatar.jpg',
});

// Methods
const toggleNotifications = () => {
  // Handle notifications toggle
};

const toggleSidebar = () => {
  isOpen.value = !isOpen.value; // Toggle sidebar state
};
</script>

