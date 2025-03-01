<script setup>
import { ref } from 'vue'
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight, Clock, Ticket } from 'lucide-vue-next'
import tech from '@/assets/Images/tech.jpg'
import { RouterLink } from 'vue-router'

const events = [
  {
    id: 1,
    title: 'International Tech Summit 2024',
    description:
      'Join us for the biggest tech conference of the year. Network with industry leaders, attend workshops, and discover the latest innovations in technology.',
    date: 'March 15-17, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Convention Center, San Francisco, CA',
    attendees: 1500,
    price: '$299',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Technology',
  },
  {
    id: 2,
    title: 'Music & Arts Festival',
    description:
      'Experience three days of amazing performances, art installations, and cultural celebrations. Features top artists and emerging talents.',
    date: 'April 5-7, 2024',
    time: '11:00 AM - 11:00 PM',
    location: 'Central Park, New York, NY',
    attendees: 2500,
    price: '$199',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Entertainment',
  },
  {
    id: 3,
    title: 'Business Summit',
    description:
      'Connect with business leaders and entrepreneurs from around the world. Gain insights into the future of business and innovation.',
    date: 'May 20-22, 2024',
    time: '8:00 AM - 5:00 PM',
    location: 'Business Center, London, UK',
    attendees: 1200,
    price: '$399',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Business',
  },
  {
    id: 4,
    title: 'Food & Wine Festival',
    description:
      'Savor exceptional cuisines and wines from renowned chefs and wineries. Enjoy cooking demonstrations, tastings, and culinary workshops.',
    date: 'June 1-3, 2024',
    time: '10:00 AM - 8:00 PM',
    location: 'Riverfront Plaza, Chicago, IL',
    attendees: 1800,
    price: '$249',
    image: '/placeholder.svg?height=400&width=600',
    category: 'Food & Drink',
  },
]

const currentIndex = ref(0)
const direction = ref('right')

const next = () => {
  direction.value = 'right'
  currentIndex.value = (currentIndex.value + 1) % events.length
}

const prev = () => {
  direction.value = 'left'
  currentIndex.value = (currentIndex.value - 1 + events.length) % events.length
}

const goToSlide = (index) => {
  direction.value = index > currentIndex.value ? 'right' : 'left'
  currentIndex.value = index
}
</script>

<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900">Featured Events</h2>
        <p class="mt-2 text-gray-600">Don't miss out on our highlighted events of the month</p>
      </div>

      <!-- Carousel Container -->
      <div class="relative">
        <!-- Featured Event Card -->
        <div class="relative overflow-hidden">
          <Transition :name="direction === 'right' ? 'slide-right' : 'slide-left'" mode="out-in">
            <div
              :key="currentIndex"
              class="bg-gray-50 from-blue-50 to-white rounded-2xl overflow-hidden border border-blue-100 shadow-lg"
            >
              <div class="grid lg:grid-cols-2 gap-8">
                <!-- Image Section -->
                <div class="relative h-[200px] lg:h-[500px]">
                  <div
                    class="absolute top-4 left-4 z-10 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {{ events[currentIndex].category }}
                  </div>
                  <img
                    :src="tech"
                    :alt="events[currentIndex].title"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Content Section -->
                <div class="p-8">
                  <h3 class="text-2xl font-bold text-gray-900 mb-3">
                    {{ events[currentIndex].title }}
                  </h3>

                  <p class="text-gray-600 mb-6 leading-relaxed">
                    {{ events[currentIndex].description }}
                  </p>

                  <!-- Event Details -->
                  <div class="space-y-4 mb-8">
                    <div class="flex items-center text-gray-600">
                      <Calendar class="h-5 w-5 mr-3 text-blue-600" />
                      <span>{{ events[currentIndex].date }}</span>
                    </div>

                    <div class="flex items-center text-gray-600">
                      <Clock class="h-5 w-5 mr-3 text-blue-600" />
                      <span>{{ events[currentIndex].time }}</span>
                    </div>

                    <div class="flex items-center text-gray-600">
                      <MapPin class="h-5 w-5 mr-3 text-blue-600" />
                      <span>{{ events[currentIndex].location }}</span>
                    </div>

                    <div class="flex items-center text-gray-600">
                      <Users class="h-5 w-5 mr-3 text-blue-600" />
                      <span>{{ events[currentIndex].attendees }} Attendees Expected</span>
                    </div>

                    <div class="flex items-center text-gray-600">
                      <Ticket class="h-5 w-5 mr-3 text-blue-600" />
                      <span>Starting from {{ events[currentIndex].price }}</span>
                    </div>
                  </div>

                  <!-- Compact Register Button -->
                 <RouterLink to="/login"
                class="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 inline-flex items-center justify-center"
              >
                Registor Now
                 </RouterLink>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Navigation Arrows -->
        <button
          @click="prev"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
        >
          <ChevronLeft class="h-6 w-6" />
        </button>
        <button
          @click="next"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
        >
          <ChevronRight class="h-6 w-6" />
        </button>

        <!-- Carousel Indicators -->
        <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <button
            v-for="(_, index) in events"
            :key="index"
            @click="goToSlide(index)"
            :class="[
              'w-2.5 h-2.5 rounded-full transition-all duration-200',
              currentIndex === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400',
            ]"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Right direction transitions */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-in-out; /* Decreased from 0.5s to 0.3s */
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Left direction transitions */
.slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Ensure the container doesn't collapse during animation */
.relative.overflow-hidden {
  min-height: 300px;
}

@media (min-width: 1024px) {
  .relative.overflow-hidden {
    min-height: 500px;
  }
}
</style>
