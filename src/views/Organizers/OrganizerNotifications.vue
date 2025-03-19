<template>
    <div class="relative">
      <button
        type="button"
        class="p-1 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
        @click="toggleNotifications"
      >
        <Bell class="w-6 h-6" />
        <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      
      <!-- Notifications dropdown -->
      <div
        v-if="showNotifications"
        class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="p-4 border-b border-gray-200 hover:bg-gray-50"
          >
            <p class="text-sm text-gray-900">{{ notification.message }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ notification.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Bell } from 'lucide-vue-next'
  
  const showNotifications = ref(false)
  const notifications = ref([
    {
      id: 1,
      message: 'New ticket purchased for Tech Conference 2024',
      time: '2 minutes ago'
    },
    {
      id: 2,
      message: 'Event "Digital Marketing Summit" is starting soon',
      time: '1 hour ago'
    },
    {
      id: 3,
      message: 'New review received for AI Workshop',
      time: '3 hours ago'
    }
  ])
  
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value
  }
  </script>
  
  