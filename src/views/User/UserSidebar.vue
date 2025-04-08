<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 lg:hidden"
      @click="$emit('toggle')"
    >
      <div class="absolute inset-0 bg-gray-600 opacity-75"></div>
    </div>

    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-20'
      ]"
      class="h-full"
    >
      <!-- Sidebar content -->
      <div class="flex flex-col h-full">
        <!-- Logo and Collapse Button -->
        <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <router-link to="/user-dashboard" class="flex items-center space-x-2">
            <img src="#" alt="Logo" class="w-8 h-8" />
            <span v-if="isOpen" class="text-xl font-bold text-gray-900">EventPro</span>
          </router-link>
          <button 
            @click="$emit('toggle-sidebar')" 
            class="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 focus:outline-none"
          >
            <ChevronLeft v-if="isOpen" class="w-5 h-5 text-gray-500" />
            <ChevronRight v-else class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in navigation"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="[ 
              $route.path.startsWith(item.to) 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50',
              isOpen ? '' : 'justify-center'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" :class="isOpen ? 'mr-3' : ''" />
            <span v-if="isOpen">{{ item.name }}</span>
          </router-link>
        </nav>

        <!-- User Profile -->
        <div 
          class="flex items-center p-4 border-t border-gray-200"
          :class="{ 'justify-center': !isOpen }"
        >
          <img src="#" alt="User avatar" class="w-10 h-10 rounded-full" />
          <div v-if="isOpen" class="ml-3">
            <p class="text-sm font-medium text-gray-900">Teddy</p>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Calendar,
  UsersRound,
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const navigation = [
  { name: 'Dashboard', to: '/user-dashboard', icon: LayoutDashboard },
  { name: 'My Events', to: '/user-dashboard/events', icon: Users },
  { name: 'Event Requests', to: '/user-dashboard/event-request', icon: Calendar },
  { name: 'My Tickets', to: '/user-dashboard/tickets', icon: UsersRound },
];
</script>

