<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <!-- Logo or Title -->
      <RouterLink to="/userview" class="text-2xl text-gray-900"> EventHub </RouterLink>
      <!-- Centered Home Navigation -->
      <div class="flex-1 flex justify-center">
        <RouterLink to="/userview" class="text-gray-500 hover:text-gray-700 font-medium text-xl">
          Home
        </RouterLink>
      </div>
      <div class="flex items-center gap-4">
        <!-- Notification Bell -->
        <button class="relative focus:outline-none" @click="handleNotifications">
          <Bell class="w-7 h-7 text-gray-500 hover:text-gray-700" />
          <span
            v-if="unreadNotifications > 0"
            class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ unreadNotifications }}
          </span>
        </button>

        <!-- Profile Dropdown -->
        <div class="relative" ref="dropdown">
          <button @click="toggleDropdown" class="flex items-center gap-2 focus:outline-none">
            <div
              class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center"
            >
              JS
            </div>
            <ChevronDown class="w-4 h-4 text-gray-500" />
          </button>
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            @click.stop
          >
            <ul class="py-1">
              <li>
                <RouterLink
                  to="/userview/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User class="w-4 h-4 text-gray-500" />
                  Profile
                </RouterLink>
              </li>
              <!-- <li>
                <RouterLink
                  to="/userview/setting"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings class="w-4 h-4 text-gray-500" />
                  Settings
                </RouterLink>
              </li> -->
              <li>
                <RouterLink
                  to="/userview/notification"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Bell class="w-4 h-4 text-gray-500" />
                  Notifications
                </RouterLink>
              </li>
              <li>
                <button
                  @click="signout"
                  class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut class="w-4 h-4 text-gray-500" />
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronDown, LogOut, User, Settings, Bell } from 'lucide-vue-next'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter() // Vue Router instance

// State
const dropdownOpen = ref(false) // Controls the visibility of the dropdown
const unreadNotifications = ref(3) // Example: Number of unread notifications
const dropdown = ref(null) // Reference to the dropdown element

// Methods
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value // Toggles the dropdown visibility
}

const handleNotifications = () => {
  unreadNotifications.value = 0 // Resets unread notifications
  router.push('/userview/notification') // Redirects to the notifications page
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    dropdownOpen.value = false // Closes the dropdown
  }
}

// Add and remove event listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside) // Adds event listener on mount
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside) // Removes event listener on unmount
})

// Logout function
const signout = async () => {
  
  localStorage.removeItem('user') // Removes user data from localStorage
  localStorage.removeItem('token') // Removes token from localStorage
  router.push('/') // Redirects to the home page
}
</script>
