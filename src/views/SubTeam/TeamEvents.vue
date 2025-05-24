<template>
    <div class="min-h-screen bg-gray-50 p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">My Events</h1>
  
      <div v-if="events.length === 0" class="text-center text-gray-500">
        No events assigned yet.
      </div>
  
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in events"
          :key="event.id"
          class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
        >
          <div class="p-4">
            <h2 class="text-lg font-bold text-gray-800">{{ event.title }}</h2>
            <p class="text-sm text-gray-500 mt-1">
              <strong>Date:</strong> {{ formatDate(event.date) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              <strong>Location:</strong> {{ event.location }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              <strong>Status:</strong>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  event.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' :
                  event.status === 'Completed' ? 'bg-green-100 text-green-600' :
                  event.status === 'Canceled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ event.status }}
              </span>
            </p>
          </div>
          <div class="bg-gray-100 px-4 py-2 text-right">
            <button
              class="text-sm text-blue-600 hover:underline"
              @click="openModal(event)"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
  
      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg w-96 p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ selectedEvent.title }}</h2>
          <p class="text-sm text-gray-500 mb-2">
            <strong>Date:</strong> {{ formatDate(selectedEvent.date) }}
          </p>
          <p class="text-sm text-gray-500 mb-2">
            <strong>Location:</strong> {{ selectedEvent.location }}
          </p>
          <p class="text-sm text-gray-500 mb-2">
            <strong>Status:</strong>
            <span
              :class="[
                'px-2 py-1 rounded text-xs font-medium',
                selectedEvent.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' :
                selectedEvent.status === 'Completed' ? 'bg-green-100 text-green-600' :
                selectedEvent.status === 'Canceled' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              ]"
            >
              {{ selectedEvent.status }}
            </span>
          </p>
          <p class="text-sm text-gray-500 mb-2">
            <strong>Budget:</strong> ${{ selectedEvent.budget }}
          </p>
          <p class="text-sm text-gray-500 mb-2">
            <strong>Expected Guests:</strong> {{ selectedEvent.expectedGuests }}
          </p>
          <p class="text-sm text-gray-500 mb-2">
            <strong>Requirements:</strong>
            <ul class="list-disc list-inside mt-2">
              <li v-for="requirement in selectedEvent.requirements" :key="requirement">
                {{ requirement }}
              </li>
            </ul>
          </p>
          <div class="text-right mt-4">
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Dummy data for events
  const events = ref([
    {
      id: 1,
      title: 'Corporate Team Building',
      date: '2025-06-15',
      location: 'Hilton Hotel',
      status: 'Upcoming',
      budget: 5000,
      expectedGuests: 50,
      requirements: ['Projector', 'Team-building materials', 'Snacks and drinks'],
    },
    {
      id: 2,
      title: 'Birthday Celebration',
      date: '2025-06-20',
      location: 'City Park',
      status: 'Completed',
      budget: 1000,
      expectedGuests: 20,
      requirements: ['Birthday cake', 'Decorations', 'Music system'],
    },
    {
      id: 3,
      title: 'Wedding Reception',
      date: '2025-07-10',
      location: 'Grand Ballroom',
      status: 'Canceled',
      budget: 10000,
      expectedGuests: 200,
      requirements: ['Catering service', 'Flower arrangements', 'Stage setup'],
    },
    {
      id: 4,
      title: 'Product Launch',
      date: '2025-08-05',
      location: 'Tech Hub',
      status: 'Upcoming',
      budget: 8000,
      expectedGuests: 100,
      requirements: ['Presentation slides', 'Demo products', 'Media coverage'],
    },
  ]);
  
  // State for modal
  const showModal = ref(false);
  const selectedEvent = ref({});
  
  // Format date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  
  // Open modal and set selected event
  const openModal = (event) => {
    selectedEvent.value = event;
    showModal.value = true;
  };
  
  // Close modal
  const closeModal = () => {
    showModal.value = false;
  };
  </script>
  
  <style>
  /* Add any custom styles here */
  </style>