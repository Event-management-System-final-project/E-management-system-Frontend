<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { 
    Calendar, 
    MapPin, 
    Users, 
    // Star, 
    // Heart, 
    Share2 
  } from 'lucide-vue-next'
  import axios from "axios"
  import Navbar from '@/components/Navbar.vue'

  const route = useRoute()
  const eventId = route.params.id
  
  // Mock event data - in a real app, you would fetch this from an API
  // const event = ref({
  //   id: eventId,
  //   title: 'Tech Conference 2024',
  //   category: 'Conference',
  //   date: '2024-03-15',
  //   time: '09:00 AM',
  //   venue: 'Moscone Center',
  //   location: 'San Francisco, CA',
  //   price: 299,
  //   status: 'active', // active, upcoming, sold_out, past
  //   attendees: 1500,
  //   availableTickets: 150,
  //   totalTickets: 600,
  //   bannerImage: '/placeholder.svg?height=600&width=1200',
  //   organizer: 'TechEvents Inc.',
  //   organizerAvatar: '/placeholder.svg?height=60&width=60',
  //   organizerDescription: 'TechEvents Inc. is a leading organizer of technology conferences and workshops across the United States. With over 10 years of experience, we bring together the brightest minds in the industry.',
  //   description: `Join us for the premier tech conference of 2024, featuring keynote speakers from leading technology companies, hands-on workshops, networking opportunities, and the latest in tech innovation.
  
  // This three-day event will cover topics including artificial intelligence, blockchain, cloud computing, cybersecurity, and more. Whether you're a developer, executive, entrepreneur, or tech enthusiast, there's something for everyone at Tech Conference 2024.
  
  // Tickets include access to all keynote sessions, workshops, the exhibition hall, networking events, and complimentary meals and refreshments.`,
  //   // Keeping schedule and reviews data in the model for future reference
  //   schedule: [
  //     {
  //       time: '09:00 AM',
  //       title: 'Registration & Breakfast',
  //       description: 'Pick up your badge and enjoy a continental breakfast'
  //     },
  //     {
  //       time: '10:00 AM',
  //       title: 'Opening Keynote',
  //       description: 'Welcome address and keynote speech by industry leader'
  //     },
  //     {
  //       time: '11:30 AM',
  //       title: 'Panel Discussion',
  //       description: 'The Future of AI in Business'
  //     },
  //     {
  //       time: '01:00 PM',
  //       title: 'Lunch Break',
  //       description: 'Networking lunch in the main hall'
  //     },
  //     {
  //       time: '02:00 PM',
  //       title: 'Workshop Sessions',
  //       description: 'Choose from 5 different workshops'
  //     }
  //   ],
  //   rating: 4.8,
  //   reviews: [
  //     {
  //       name: 'John Smith',
  //       avatar: '/placeholder.svg?height=40&width=40',
  //       date: 'February 10, 2024',
  //       rating: 5,
  //       comment: 'Excellent conference! The speakers were top-notch and I learned so much. The networking opportunities were invaluable.'
  //     },
  //     {
  //       name: 'Sarah Johnson',
  //       avatar: '/placeholder.svg?height=40&width=40',
  //       date: 'February 8, 2024',
  //       rating: 4,
  //       comment: 'Great event overall. The workshops were very informative, though the venue was a bit crowded at times.'
  //     },
  //     {
  //       name: 'Michael Brown',
  //       avatar: '/placeholder.svg?height=40&width=40',
  //       date: 'February 5, 2024',
  //       rating: 5,
  //       comment: "One of the best tech conferences I've attended. Well organized with excellent content and speakers."
  //     }
  //   ]
  // })
  
  // Similar events
  const similarEvents = ref([
    {
      id: 2,
      title: 'Digital Marketing Summit',
      date: '2024-04-01',
      time: '10:00 AM',
      image: '/placeholder.svg?height=80&width=80'
    },
    {
      id: 3,
      title: 'AI Workshop Series',
      date: '2024-03-25',
      time: '09:30 AM',
      image: '/placeholder.svg?height=80&width=80'
    },
    {
      id: 4,
      title: 'Blockchain Conference',
      date: '2024-04-15',
      time: '11:00 AM',
      image: '/placeholder.svg?height=80&width=80'
    }
  ])
  
  const event = ref([])
  // In a real app, you would fetch the event data based on the ID
  onMounted( async () => {
    // fetchEventDetails(eventId)
    try{
      const response = await axios.get(`http://localhost:8000/api/events/${eventId}`)
      event.value = response.data
      console.log('Fetching event with ID:', eventId)
    }
    catch(error){
          console.log(error)
    }
    
  })
  
  // Format date
  const formatDate = (date, time, short = false) => {
    if (short) {
      return new Date(`${date} ${time}`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }
    
    return new Date(`${date} ${time}`).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    })
  }
  
  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }
  
  // Format status
  const formatStatus = (status) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'upcoming':
        return 'Upcoming'
      case 'sold_out':
        return 'Sold Out'
      case 'past':
        return 'Past Event'
      default:
        return status
    }
  }
  </script>


<template>
<Navbar/>
    <div class="min-h-screen bg-gray-50">
      <!-- Event Banner Section - Fixed positioning and overlay -->
      <div class="relative w-full h-72 md:h-96 overflow-hidden">
        <!-- Banner Image with proper object-fit -->
        <img 
          :src="event.bannerImage || '/placeholder.svg?height=600&width=1200'" 
          :alt="event.title"
          class="absolute inset-0 w-full h-full object-cover"
        />
        
        <!-- Gradient Overlay - Full coverage with proper opacity -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        
        <!-- Event Title Container - Better positioned with proper padding -->
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div class="container mx-auto">
            <div class="flex items-center gap-2 mb-2">
              <span 
                class="px-3 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-sm text-white"
              >
                {{ formatStatus(event.status) }}
              </span>
              <span class="text-sm text-white/90">{{ event.category }}</span>
            </div>
            <h1 class="text-2xl md:text-4xl font-bold text-white mb-4">{{ event.title }}</h1>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="container mx-auto px-4 py-6">
        <!-- Quick Info Bar -->
        <div class="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-wrap gap-6 justify-between items-center">
          <div class="flex items-center">
            <Calendar class="h-5 w-5 mr-2 text-blue-600" />
            <span class="text-sm md:text-base">{{ formatDate(event.date, event.time) }}</span>
          </div>
          
          <div class="flex items-center">
            <MapPin class="h-5 w-5 mr-2 text-red-600" />
            <span class="text-sm md:text-base">{{ event.venue }}, {{ event.location }}</span>
          </div>
          
          <div class="flex items-center">
            <Users class="h-5 w-5 mr-2 text-green-600" />
            <span class="text-sm md:text-base">{{ event.attendees }} attendees</span>
          </div>
          
          <div class="flex items-center">
            <div class="flex items-center">
              <img 
                :src="event.organizerAvatar || '/placeholder.svg?height=40&width=40'" 
                alt="Organizer"
                class="w-6 h-6 rounded-full mr-2"
              />
              <span class="text-sm md:text-base">
                By <span class="font-medium">{{ event.organizer }}</span>
              </span>
            </div>
          </div>
        </div>
        
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          <!-- Left Column (Main Content) -->
          <div class="lg:col-span-2 space-y-8">
            <!-- About This Event -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div class="prose max-w-none text-gray-700">
                <p>{{ event.description }}</p>
              </div>
            </div>
            
            <!-- Location -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div class="aspect-video bg-gray-200 rounded-lg mb-4">
                <!-- Map would go here -->
                <div class="w-full h-full flex items-center justify-center text-gray-500">
                  Map View
                </div>
              </div>
              <h3 class="font-medium text-gray-900">{{ event.venue }}</h3>
              <p class="text-gray-600">{{ event.location }}</p>
            </div>
            
            <!-- Organizer -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-xl font-bold text-gray-900 mb-4">Organizer</h2>
              <div class="flex items-center mb-4">
                <img 
                  :src="event.organizerAvatar || '/placeholder.svg?height=60&width=60'" 
                  alt="Organizer"
                  class="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 class="font-medium text-gray-900">{{ event.organizer }}</h3>
                  <p class="text-sm text-gray-600">Event Organizer</p>
                </div>
              </div>
              <p class="text-gray-700 mb-4">{{ event.organizerDescription }}</p>
              <button class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View Profile
              </button>
            </div>
          </div>
          
          <!-- Right Column (Ticket & Related) -->
          <div class="space-y-8">
            <!-- Sticky Ticket Purchase -->
            <div class="lg:sticky lg:top-4">
              <!-- Ticket Info -->
              <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div class="mb-4">
                  <div class="text-sm text-gray-500 mb-1">Price</div>
                  <div class="text-3xl font-bold text-gray-900">{{ formatPrice(event.price) }}</div>
                </div>
                
                <div v-if="event.status !== 'past'" class="mb-6">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-500">Available tickets</span>
                    <span class="text-sm font-medium">
                      {{ event.availableTickets }}/{{ event.totalTickets }}
                    </span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-blue-600 h-2 rounded-full" 
                      :style="{ width: `${(event.availableTickets / event.totalTickets) * 100}%` }"
                    ></div>
                  </div>
                </div>
                
                <button 
                  v-if="event.status === 'active'" 
                  class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
                >
                  Get Tickets
                </button>
                <button 
                  v-else-if="event.status === 'upcoming'" 
                  class="w-full py-3 px-4 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors mb-4"
                >
                  Join Waitlist
                </button>
                <button 
                  v-else-if="event.status === 'sold_out'" 
                  class="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-lg font-medium cursor-not-allowed mb-4"
                  disabled
                >
                  Sold Out
                </button>
                <button 
                  v-else
                  class="w-full py-3 px-4 bg-gray-300 text-gray-700 rounded-lg font-medium cursor-not-allowed mb-4"
                  disabled
                >
                  Event Ended
                </button>
                
                <div class="flex items-center justify-center">
                  <button class="flex items-center text-gray-600 hover:text-blue-600">
                    <Share2 class="h-5 w-5 mr-1" />
                    Share
                  </button>
                  
                </div>
              </div>
              
              <!-- Similar Events -->
              <div v-if="similarEvents.length > 0" class="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Similar Events</h2>
                <div class="space-y-4">
                  <div 
                    v-for="similarEvent in similarEvents" 
                    :key="similarEvent.id"
                    class="flex gap-3"
                  >
                    <img 
                      :src="similarEvent.image || '/placeholder.svg?height=80&width=80'" 
                      :alt="similarEvent.title"
                      class="w-20 h-16 rounded-lg object-cover"
                    />
                    <div class="flex-1">
                      <h3 class="font-medium text-gray-900 line-clamp-1">{{ similarEvent.title }}</h3>
                      <p class="text-sm text-gray-600">{{ formatDate(similarEvent.date, similarEvent.time, true) }}</p>
                      <router-link 
                        :to="`/events/${similarEvent.id}`"
                        class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Event
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  