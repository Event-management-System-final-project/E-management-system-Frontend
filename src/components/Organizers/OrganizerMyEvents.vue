<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Events</h1>
        <p class="text-gray-600">Manage and monitor all your events.</p>
      </div>
      <router-link
        to="/organizerView/events/create"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
      >
        <PlusCircle class="w-4 h-4 mr-2" />
        Create Event
      </router-link>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-3 py-1.5 text-sm font-medium rounded-lg"
          :class="[
            activeFilter === filter.value
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Events Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="event in filteredEvents"
        :key="event.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <img
          :src="event.image"
          :alt="event.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ event.title }}</h3>
              <p class="mt-1 text-sm text-gray-600">{{ event.location }}</p>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 text-green-600': event.status === 'active',
                'bg-yellow-100 text-yellow-600': event.status === 'draft',
                'bg-gray-100 text-gray-600': event.status === 'past'
              }"
            >
              {{ event.status }}
            </span>
          </div>

          <div class="mt-4 space-y-2">
            <div class="flex items-center text-sm text-gray-600">
              <Calendar class="w-4 h-4 mr-2" />
              {{ formatDate(event.date) }}
            </div>
            <div class="flex items-center text-sm text-gray-600">
              <Ticket class="w-4 h-4 mr-2" />
              {{ event.ticketsSold }}/{{ event.totalTickets }} tickets sold
            </div>
          </div>

          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full"
                :style="{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <router-link
              :to="`/organizer/events/${event.id}`"
              class="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Details
            </router-link>
            <button
              @click="showEventMenu(event)"
              class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
            >
              <MoreVertical class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Calendar, Ticket, PlusCircle, MoreVertical } from 'lucide-vue-next'

const activeFilter = ref('all')

const filters = [
  { label: 'All Events', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Past', value: 'past' }
]

// Sample data - replace with your API call
const events = ref([
  {
    id: 1,
    title: 'Tech Conference 2024',
    location: 'San Francisco Convention Center',
    date: '2024-03-15T09:00:00',
    status: 'active',
    ticketsSold: 450,
    totalTickets: 600,
    image: '/placeholder.svg?height=300&width=400'
  },
  {
    id: 2,
    title: 'Digital Marketing Summit',
    location: 'New York Business Center',
    date: '2024-04-01T10:00:00',
    status: 'draft',
    ticketsSold: 0,
    totalTickets: 400,
    image: '/placeholder.svg?height=300&width=400'
  },
  {
    id: 3,
    title: 'AI Workshop',
    location: 'Virtual Event',
    date: '2024-02-01T14:00:00',
    status: 'past',
    ticketsSold: 200,
    totalTickets: 200,
    image: '/placeholder.svg?height=300&width=400'
  }
])

const filteredEvents = computed(() => {
  if (activeFilter.value === 'all') return events.value
  return events.value.filter(event => event.status === activeFilter.value)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

const showEventMenu = (event) => {
  // Add your menu logic here
  console.log('Show menu for event:', event.id)
}
</script>

