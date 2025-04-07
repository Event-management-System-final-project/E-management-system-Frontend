<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="mobileMenuOpen = false"
    >
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out w-64 z-30 hidden md:block"
    >
      <!-- Logo and header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <img src="#" alt="Logo" class="w-8 h-8" />
          <span class="text-xl font-bold text-gray-900">EventHub</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <a 
          href="#" 
          @click.prevent="$emit('change-section', 'dashboard')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'dashboard'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <LayoutDashboard class="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="$emit('change-section', 'tickets')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'tickets'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <Ticket class="w-5 h-5 mr-3" />
          <span>My Tickets</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="$emit('change-section', 'events')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'events'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <Calendar class="w-5 h-5 mr-3" />
          <span>My Events</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="$emit('change-section', 'requests')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'requests'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <FileEdit class="w-5 h-5 mr-3" />
          <span>Event Requests</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="$emit('change-section', 'profile')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'profile'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <User class="w-5 h-5 mr-3" />
          <span>Profile</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="$emit('change-section', 'support')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'support'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <HelpCircle class="w-5 h-5 mr-3" />
          <span>Help & Support</span>
        </a>
      </nav>

      <!-- User Profile -->
      <div class="flex items-center p-4 border-t border-gray-200">
        <img
          src="#"
          alt="User avatar"
          class="w-10 h-10 rounded-full"
        />
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">User</p>
          <p class="text-xs text-gray-500">Event Attendee</p>
        </div>
      </div>
    </aside>
    
    <!-- Mobile Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out w-64 z-50 md:hidden transform"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo and close button -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <img src="#" alt="Logo" class="w-8 h-8" />
          <span class="text-xl font-bold text-gray-900">EventHub</span>
        </div>
        <button @click="mobileMenuOpen = false" class="text-gray-500 hover:text-gray-700">
          <X class="h-6 w-6" />
        </button>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <a 
          href="#" 
          @click.prevent="changeMobileSection('dashboard')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'dashboard'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <LayoutDashboard class="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="changeMobileSection('tickets')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'tickets'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <Ticket class="w-5 h-5 mr-3" />
          <span>My Tickets</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="changeMobileSection('events')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'events'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <Calendar class="w-5 h-5 mr-3" />
          <span>My Events</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="changeMobileSection('requests')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'requests'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <FileEdit class="w-5 h-5 mr-3" />
          <span>Event Requests</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="changeMobileSection('profile')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'profile'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <User class="w-5 h-5 mr-3" />
          <span>Profile</span>
        </a>
        
        <a 
          href="#" 
          @click.prevent="changeMobileSection('support')" 
          class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          :class="[
            activeSection === 'support'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          ]"
        >
          <HelpCircle class="w-5 h-5 mr-3" />
          <span>Help & Support</span>
        </a>
      </nav>
      
      <!-- User Profile -->
      <div class="flex items-center p-4 border-t border-gray-200">
        <img
          src="#"
          alt="User avatar"
          class="w-10 h-10 rounded-full"
        />
        <div class="ml-3">
          <p class="text-sm font-medium text-gray-900">User</p>
          <p class="text-xs text-gray-500">Event Attendee</p>
        </div>
      </div>
    </aside>
    
    <!-- Mobile menu button -->
    <button 
      @click="mobileMenuOpen = true" 
      class="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg z-30 md:hidden"
    >
      <Menu class="h-6 w-6" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  LayoutDashboard, 
  Ticket, 
  Calendar, 
  FileEdit, 
  User, 
  HelpCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-vue-next';

const props = defineProps({
  activeSection: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['change-section']);

const mobileMenuOpen = ref(false);

const changeMobileSection = (section) => {
  emit('change-section', section);
  mobileMenuOpen.value = false;
};
</script>

