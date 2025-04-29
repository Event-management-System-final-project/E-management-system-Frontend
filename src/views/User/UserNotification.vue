<script setup>
import { ref } from 'vue';
import { Bell, Calendar, Users, MessageSquare, AlertCircle, Check } from 'lucide-vue-next';

// Notification data
const notifications = ref([
  {
    id: 1,
    type: 'event_update',
    title: 'Event Updated: Tech Conference 2025',
    message: 'The venue for Tech Conference 2025 has been changed to San Francisco Convention Center.',
    date: '2023-11-28T14:30:00',
    read: false,
    actionUrl: '/events/123',
  },
  {
    id: 2,
    type: 'registration',
    title: 'New Registration',
    message: 'Sarah Williams has registered for your Product Launch Webinar.',
    date: '2023-11-27T09:15:00',
    read: false,
    actionUrl: '/events/456/attendees',
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Event Starting Soon',
    message: 'Your event "Annual Charity Gala" is starting in 24 hours.',
    date: '2023-11-26T18:00:00',
    read: true,
    actionUrl: '/events/789',
  },
]);

// Methods
const markAsRead = (id) => {
  const notification = notifications.value.find((n) => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

const markAllAsRead = () => {
  notifications.value.forEach((notification) => {
    notification.read = true;
  });
};

const clearAllNotifications = () => {
  notifications.value = []; // Clears all notifications
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'event_update':
      return Calendar;
    case 'registration':
      return Users;
    case 'message':
      return MessageSquare;
    case 'reminder':
      return Bell;
    case 'system':
      return AlertCircle;
    default:
      return Bell;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'event_update':
      return 'bg-blue-100 text-blue-600';
    case 'registration':
      return 'bg-green-100 text-green-600';
    case 'message':
      return 'bg-purple-100 text-purple-600';
    case 'reminder':
      return 'bg-yellow-100 text-yellow-600';
    case 'system':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Header -->
        <div class="bg-blue-600 p-6 text-white">
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <Bell class="h-6 w-6 mr-2" />
              <h1 class="text-2xl font-bold">Notifications</h1>
            </div>
            <div class="flex space-x-2">
              <!-- Mark All Read Button -->
              <button
                v-if="notifications.some((n) => !n.read)"
                @click="markAllAsRead"
                class="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-600 inline-flex items-center text-sm"
              >
                <Check class="h-4 w-4 mr-1" />
                Mark All Read
              </button>

              <!-- Clear All Button -->
              <button
                v-if="notifications.length > 0"
                @click="clearAllNotifications"
                class="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-red-600 inline-flex items-center text-sm"
              >
                <AlertCircle class="h-4 w-4 mr-1" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="divide-y divide-gray-200">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Bell class="h-8 w-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
            <p class="text-gray-500">You don't have any notifications yet.</p>
          </div>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="[
              'p-4 hover:bg-gray-50 transition-colors duration-150',
              !notification.read ? 'bg-blue-50' : '',
            ]"
          >
            <div class="flex">
              <!-- Icon -->
              <div class="mr-4">
                <div :class="['p-2 rounded-full', getNotificationColor(notification.type)]">
                  <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <h3 :class="['text-sm font-medium', !notification.read ? 'text-gray-900' : 'text-gray-600']">
                    {{ notification.title }}
                  </h3>
                  <span class="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {{ formatDate(notification.date) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
                <div class="mt-2 flex justify-between items-center">
                  <a
                    :href="notification.actionUrl"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </a>
                  <button
                    v-if="!notification.read"
                    @click="markAsRead(notification.id)"
                    class="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center"
                  >
                    <Check class="h-3 w-3 mr-1" />
                    Mark as read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>