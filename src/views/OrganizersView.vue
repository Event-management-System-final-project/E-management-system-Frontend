<template>
  <div class="min-h-screen bg-gray-50">
    <OrganizerSidebar :is-open="isSidebarOpen" @toggle="toggleSidebar" />
    
    <div class="lg:pl-64">
      <OrganizerHeader @toggle-sidebar="toggleSidebar" />
      
      <main class="p-6">
        <!-- Router view for nested routes -->
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import OrganizerSidebar from '@/components/Organizers/OrganizerSidebar.vue'
import OrganizerHeader from '@/components/Organizers/OrganizerHeader.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

