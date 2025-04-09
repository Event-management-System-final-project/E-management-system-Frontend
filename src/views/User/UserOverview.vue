<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
    
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <Ticket class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-sm font-medium text-gray-500">My Tickets</h2>
            <p class="text-2xl font-semibold text-gray-900">{{ recentTickets.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <Calendar class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-sm font-medium text-gray-500">Upcoming Events</h2>
            <p class="text-2xl font-semibold text-gray-900">{{ upcomingEvents.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <Bell class="h-6 w-6" />
          </div>
          <div class="ml-4">
            <h2 class="text-sm font-medium text-gray-500">Notifications</h2>
            <p class="text-2xl font-semibold text-gray-900">{{ unreadNotifications }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Upcoming Events -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Upcoming Events</h2>
          <router-link to="/user-dashboard/events" class="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </router-link>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div v-if="upcomingEvents.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No upcoming events</p>
        </div>
        
        <div v-for="event in upcomingEvents" :key="event.id" class="p-6 flex items-center">
          <div class="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
            <img :src="event.image" alt="Event" class="h-full w-full object-cover" />
          </div>
          
          <div class="ml-4 flex-1">
            <h3 class="text-base font-medium text-gray-900">{{ event.title }}</h3>
            <div class="mt-1 flex items-center text-sm text-gray-500">
              <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ event.date }}
            </div>
            <div class="mt-1 flex items-center text-sm text-gray-500">
              <Clock class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ event.time }}
            </div>
          </div>
          
          <div class="ml-4">
            <button 
              @click="$emit('view-event', event.id)" 
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Tickets -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Recent Tickets</h2>
          <router-link to="/user-dashboard/tickets" class="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all
          </router-link>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div v-if="recentTickets.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No recent tickets</p>
        </div>
        
        <div v-for="ticket in recentTickets" :key="ticket.id" class="p-6 flex items-center">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Ticket class="h-5 w-5 text-blue-600" />
          </div>
          
          <div class="ml-4 flex-1">
            <h3 class="text-base font-medium text-gray-900">{{ ticket.eventTitle }}</h3>
            <p class="text-sm text-gray-500">{{ ticket.ticketType }} - ${{ ticket.price.toFixed(2) }}</p>
          </div>
          
          <div class="ml-4">
            <span 
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ ticket.status === 'active' ? 'Active' : 'Used' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Notifications -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900">Recent Notifications</h2>
          <button 
            @click="$emit('toggle-notifications')" 
            class="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </button>
        </div>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div v-if="notifications.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No notifications</p>
        </div>
        
        <div 
          v-for="notification in notifications.slice(0, 3)" 
          :key="notification.id" 
          class="p-6 flex items-start"
          :class="{ 'bg-blue-50': !notification.read }"
        >
          <div class="flex-shrink-0">
            <div 
              class="h-10 w-10 rounded-full flex items-center justify-center"
              :class="{
                'bg-blue-100 text-blue-600': notification.type === 'reminder',
                'bg-green-100 text-green-600': notification.type === 'promo',
                'bg-yellow-100 text-yellow-600': notification.type === 'update'
              }"
            >
              <Bell v-if="notification.type === 'reminder'" class="h-5 w-5" />
              <Tag v-else-if="notification.type === 'promo'" class="h-5 w-5" />
              <AlertCircle v-else-if="notification.type === 'update'" class="h-5 w-5" />
            </div>
          </div>
          
          <div class="ml-4 flex-1">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-medium text-gray-900">{{ notification.title }}</h3>
              <p class="text-xs text-gray-500">{{ formatDate(notification.date) }}</p>
            </div>
            <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Ticket, Calendar, Bell, Clock, Tag, AlertCircle } from 'lucide-vue-next';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  upcomingEvents: {
    type: Array,
    default: () => []
  },
  recentTickets: {
    type: Array,
    default: () => []
  },
  notifications: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view-event', 'toggle-notifications']);

// Computed
const unreadNotifications = computed(() => {
  return props.notifications.filter(n => !n.read).length;
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};
</script>

