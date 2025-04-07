<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Navigation -->
    <Sidebar :active-section="activeSection" @change-section="changeSection" />
    
    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header :user="user" @toggle-notifications="toggleNotifications" />
      
      <!-- Main Content - Loaded via Router -->
      <main class="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/views/User/UserSidebar.vue';
import Header from '@/views/User/UserHeader.vue';

// Router setup
const router = useRouter();

// State
const activeSection = ref('dashboard');

// Mock data for header and notifications
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/images/avatar.jpg'
});

// Methods
const changeSection = (section) => {
  activeSection.value = section;
  router.push({ name: `user.${section}` });
};

const toggleNotifications = () => {
};

onMounted(() => {
  // Initial route setup
  if (router.currentRoute.value.name === 'user') {
    router.push({ name: 'user.dashboard' });
  }
});
</script>

