<template>
  <header class="bg-white shadow-sm z-20 relative">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Sidebar toggle button -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="hidden md:block text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <Menu v-if="isSidebarCollapsed" class="h-6 w-6" />
        <ChevronLeft v-else class="h-6 w-6" />
      </button>
      
      <!-- Mobile menu button -->
      <button 
        @click="mobileMenuOpen = !mobileMenuOpen" 
        class="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <Menu class="h-6 w-6" />
      </button>
      
      <!-- Search bar -->
      <div class="hidden md:flex flex-1 max-w-md ml-4">
        <div class="relative w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search events..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <!-- Right side actions -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <button 
          @click="$emit('toggle-notifications')" 
          class="relative p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <Bell class="h-6 w-6" />
          <span 
            v-if="unreadNotificationsCount > 0" 
            class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
          >
            {{ unreadNotificationsCount }}
          </span>
        </button>
        
        <!-- User menu -->
        <div class="relative user-menu-container">
          <button 
            @click.stop="userMenuOpen = !userMenuOpen" 
            class="flex items-center space-x-2 focus:outline-none"
          >
            <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                v-if="user.avatar" 
                :src="user.avatar" 
                alt="User avatar" 
                class="h-full w-full object-cover"
              />
              <User v-else class="h-5 w-5 text-gray-500" />
            </div>
            <span class="hidden md:inline-block text-sm font-medium text-gray-700">Teddy</span>
            <ChevronDown class="hidden md:inline-block h-4 w-4 text-gray-500" />
          </button>
          
          <!-- User dropdown menu -->
          <div 
            v-if="userMenuOpen" 
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
            <div class="border-t border-gray-100"></div>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile search (visible only on mobile) -->
    <div class="md:hidden px-4 pb-3">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search events..." 
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Bell, Search, User, ChevronDown, Menu, ChevronLeft } from 'lucide-vue-next';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  notifications: {
    type: Array,
    default: () => []
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-notifications', 'toggle-sidebar']);

const userMenuOpen = ref(false);
const mobileMenuOpen = ref(false);

const unreadNotificationsCount = computed(() => {
  return props.notifications.filter(n => !n.read).length;
});

// Close menus when clicking outside
const closeMenus = (event) => {
  // Check if the click is outside the user menu
  if (userMenuOpen.value && !event.target.closest('.user-menu-container')) {
    userMenuOpen.value = false;
  }
};

// Add event listener for clicks outside the menu
onMounted(() => {
  document.addEventListener('click', closeMenus);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', closeMenus);
});
</script>

