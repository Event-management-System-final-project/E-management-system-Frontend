<script setup>
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-vue-next'
// import tech from '@/assets/Images/tech.jpg'
import { onMounted ,ref } from 'vue'
import axios from 'axios'

const upcomingEvents = ref([])
// const eventMedia = ref([])  


onMounted(async () =>{
  const response = await axios.get('http://localhost:8000/api/events')
  upcomingEvents.value = response.data.events
  // console.log('Upcoming Events:', response.data)
  
})

</script>

<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="flex justify-between items-center mb-12">
        <div>
          <h2 class="text-3xl font-bold text-gray-900">Upcoming Events</h2>
          <p class="mt-2 text-gray-600">Discover and join amazing events near you</p>
        </div>
        <RouterLink
        to="/publicEvents"
          class="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all events
          <ChevronRight class="ml-1 h-4 w-4" />
        </RouterLink>
      </div>

      <!-- Events Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
        >
          <!-- Event Image -->
          <div class="relative h-48 overflow-hidden">
            <div
              class="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {{ event.category }}
            </div>
            <img
              :src="event.image"
              :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>

          <!-- Event Content -->
          <div class="p-5">
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <Calendar class="h-4 w-4 mr-1" />
              {{ event.date }}
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ event.title }}
            </h3>

            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm text-gray-500">
                <MapPin class="h-4 w-4 mr-1" />
                {{ event.location }}
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <Users class="h-4 w-4 mr-1" />
                {{ event.attendees }}
              </div>
            </div>

            <!-- Action Button -->
            <RouterLink
            :to="`/events/${event.id}`"
              class="w-full mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              View Details
              <ChevronRight class="ml-1 h-4 w-4" />
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Mobile View All Button -->
      <div class="mt-8 text-center md:hidden">
        <button
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all events
          <ChevronRight class="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>
  </section>
</template>


// Sample data - replace with your actual events data
// const events = [
//   {
//     id: 1,
//     title: 'Tech Conference 2024',
//     date: 'Mar 15, 2024',
//     location: 'San Francisco, CA',
//     attendees: 250,
//     image: '/placeholder.svg?height=400&width=600',
//     category: 'Technology',
//   },
//   {
//     id: 2,
//     title: 'Music Festival',
//     date: 'Apr 2, 2024',
//     location: 'Austin, TX',
//     attendees: 500,
//     image: '/placeholder.svg?height=400&width=600',
//     category: 'Entertainment',
//   },
//   {
//     id: 3,
//     title: 'Business Summit',
//     date: 'Apr 15, 2024',
//     location: 'New York, NY',
//     attendees: 300,
//     image: '/placeholder.svg?height=400&width=600',
//     category: 'Business',
//   },
//   {
//     id: 4,
//     title: 'Food & Wine Festival',
//     date: 'May 1, 2024',
//     location: 'Chicago, IL',
//     attendees: 400,
//     image: '/placeholder.svg?height=400&width=600',
//     category: 'Food & Drink',
//   },
// ]