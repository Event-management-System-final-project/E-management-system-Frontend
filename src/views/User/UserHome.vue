<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      
  
      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'events'"
              :class="[
                activeTab === 'events'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              ]"
            >
              Upcoming Events
            </button>
            <button
              @click="activeTab = 'myTickets'"
              :class="[
                activeTab === 'myTickets'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              ]"
            >
              My Tickets
            </button>
            <button
              @click="activeTab = 'requests'"
              :class="[
                activeTab === 'requests'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              ]"
            >
              My Requests
            </button>
          </nav>
        </div>
  
        <!-- Events Tab -->
        <div v-if="activeTab === 'events'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <div class="flex gap-2">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  v-model="searchQuery"
                />
                <i class="i-lucide-search absolute left-3 top-2.5 text-gray-400 w-5 h-5"></i>
              </div>
              <button
                @click="showRequestForm = true"
                class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Request Event
              </button>
            </div>
          </div>
  
          <!-- Events Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="event in filteredEvents"
              :key="event.id"
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div class="h-48 bg-gray-200 relative">
                <img :src="event.image" :alt="event.title" class="w-full h-full object-cover" />
                <div
                  class="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium text-primary"
                >
                  {{ event.category }}
                </div>
              </div>
              <div class="p-4">
                <div class="flex items-center text-sm text-gray-500 mb-1">
                  <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
                  {{ event.date }}
                </div>
                <h3 class="font-bold text-lg mb-2">{{ event.title }}</h3>
                <div class="flex items-center text-sm text-gray-500 mb-3">
                  <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
                  {{ event.location }}
                </div>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ event.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="font-bold text-primary">${{ event.price }}</span>
                  <button
                    @click="selectEvent(event)"
                    class="bg-blue-700 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Buy Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredEvents.length === 0" class="text-center py-12">
            <i class="i-lucide-calendar-x w-12 h-12 mx-auto text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p class="text-gray-500">Try adjusting your search or check back later for new events.</p>
          </div>
        </div>
  
        <!-- My Tickets Tab -->
        <div v-if="activeTab === 'myTickets'">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">My Tickets</h2>
  
          <div v-if="myTickets.length > 0" class="space-y-4">
            <div
              v-for="ticket in myTickets"
              :key="ticket.id"
              class="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4"
            >
              <div class="md:w-1/4 h-32 md:h-auto bg-gray-200 rounded overflow-hidden">
                <img
                  :src="ticket.event.image"
                  :alt="ticket.event.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <div class="flex items-center text-sm text-gray-500 mb-1">
                  <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
                  {{ ticket.event.date }}
                </div>
                <h3 class="font-bold text-lg mb-2">{{ ticket.event.title }}</h3>
                <div class="flex items-center text-sm text-gray-500 mb-3">
                  <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
                  {{ ticket.event.location }}
                </div>
                <div class="flex flex-wrap gap-4 mt-2">
                  <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                    <span class="text-xs text-gray-500">Ticket Type</span>
                    <p class="font-medium">{{ ticket.type }}</p>
                  </div>
                  <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                    <span class="text-xs text-gray-500">Quantity</span>
                    <p class="font-medium">{{ ticket.quantity }}</p>
                  </div>
                  <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                    <span class="text-xs text-gray-500">Order ID</span>
                    <p class="font-medium">#{{ ticket.id }}</p>
                  </div>
                </div>
              </div>
              <div class="md:w-1/6 flex flex-row md:flex-col justify-between items-end">
                <div class="text-right">
                  <span class="text-xs text-gray-500">Total Price</span>
                  <p class="font-bold text-primary">${{ ticket.totalPrice }}</p>
                </div>
                <button
                  class="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
                >
                  <i class="i-lucide-download w-4 h-4 mr-1"></i>
                  Download
                </button>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="myTickets.length === 0" class="text-center py-12">
            <i class="i-lucide-ticket w-12 h-12 mx-auto text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No tickets yet</h3>
            <p class="text-gray-500">Browse our events and purchase tickets to see them here.</p>
            <button
              @click="activeTab = 'events'"
              class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Browse Events
            </button>
          </div>
        </div>
  
        <!-- Requests Tab -->
        <div v-if="activeTab === 'requests'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">My Event Requests</h2>
            <button
              @click="showRequestForm = true"
              class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              New Request
            </button>
          </div>
  
          <div v-if="myRequests.length > 0" class="space-y-4">
            <div
              v-for="request in myRequests"
              :key="request.id"
              class="bg-white rounded-lg shadow p-4"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg">{{ request.eventType }}</h3>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    request.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ request.status }}
                </span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span class="text-xs text-gray-500">Date Requested</span>
                  <p class="font-medium">{{ request.dateRequested }}</p>
                </div>
                <div>
                  <span class="text-xs text-gray-500">Preferred Date</span>
                  <p class="font-medium">{{ request.preferredDate }}</p>
                </div>
                <div>
                  <span class="text-xs text-gray-500">Expected Guests</span>
                  <p class="font-medium">{{ request.expectedGuests }}</p>
                </div>
              </div>
              <p class="text-gray-600 mb-4">{{ request.description }}</p>
              <div class="flex justify-end gap-2">
                <button
                  class="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center"
                >
                  <i class="i-lucide-edit w-4 h-4 mr-1"></i>
                  Edit
                </button>
                <button class="text-red-600 hover:text-red-800 font-medium text-sm flex items-center">
                  <i class="i-lucide-trash-2 w-4 h-4 mr-1"></i>
                  Cancel
                </button>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="myRequests.length === 0" class="text-center py-12">
            <i class="i-lucide-file-question w-12 h-12 mx-auto text-gray-400 mb-4"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No event requests</h3>
            <p class="text-gray-500">Submit a request for us to organize a custom event for you.</p>
            <button
              @click="showRequestForm = true"
              class="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Request Event
            </button>
          </div>
        </div>
        <RouterView />
      </main>
  
      <!-- Buy Ticket Modal -->
      <div
        v-if="selectedEvent"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">Buy Tickets</h3>
              <button @click="selectedEvent = null" class="text-gray-400 hover:text-gray-500">
                <i class="i-lucide-x w-5 h-5"></i>
              </button>
            </div>
  
            <div class="mb-6">
              <h4 class="font-bold text-lg">{{ selectedEvent.title }}</h4>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
                {{ selectedEvent.date }}
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
                {{ selectedEvent.location }}
              </div>
            </div>
  
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
              <select
                v-model="ticketType"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
              >
                <option value="standard">Standard - ${{ selectedEvent.price }}</option>
                <option value="vip">VIP - ${{ selectedEvent.price * 2 }}</option>
                <option value="premium">Premium - ${{ selectedEvent.price * 3 }}</option>
              </select>
            </div>
  
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <div class="flex items-center">
                <button
                  @click="ticketQuantity > 1 ? ticketQuantity-- : null"
                  class="border border-gray-300 rounded-l-md px-3 py-2 bg-gray-50 hover:bg-gray-100"
                >
                  <i class="i-lucide-minus w-4 h-4"></i>
                </button>
                <input
                  type="number"
                  v-model="ticketQuantity"
                  min="1"
                  max="10"
                  class="w-16 border-y border-gray-300 py-2 text-center focus:ring-primary focus:border-primary"
                />
                <button
                  @click="ticketQuantity < 10 ? ticketQuantity++ : null"
                  class="border border-gray-300 rounded-r-md px-3 py-2 bg-gray-50 hover:bg-gray-100"
                >
                  <i class="i-lucide-plus w-4 h-4"></i>
                </button>
              </div>
            </div>
  
            <div class="bg-gray-50 p-4 rounded-md mb-6">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Price per ticket</span>
                <span>${{ getTicketPrice() }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Quantity</span>
                <span>{{ ticketQuantity }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Subtotal</span>
                <span>${{ getTicketPrice() * ticketQuantity }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Service fee</span>
                <span>${{ (getTicketPrice() * ticketQuantity * 0.1).toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-200 my-2"></div>
              <div class="flex justify-between font-bold">
                <span>Total</span>
                <span
                  >${{
                    (
                      getTicketPrice() * ticketQuantity +
                      getTicketPrice() * ticketQuantity * 0.1
                    ).toFixed(2)
                  }}</span
                >
              </div>
            </div>
  
            <div class="flex gap-3">
              <button
                @click="selectedEvent = null"
                class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="purchaseTicket"
                class="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Request Event Modal -->
      <div
        v-if="showRequestForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-bold">Request Custom Event</h3>
              <button @click="showRequestForm = null" class="text-gray-400 hover:text-gray-500">
                <i class="i-lucide-x w-5 h-5"></i>
              </button>
            </div>
  
            <form @submit.prevent="submitEventRequest" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select
                  v-model="eventRequest.type"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select event type</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday Party</option>
                  <option value="Conference">Conference</option>
                  <option value="Other">Other</option>
                </select>
              </div>
  
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    v-model="eventRequest.date"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Expected Guests</label>
                  <input
                    type="number"
                    v-model="eventRequest.guests"
                    min="1"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  v-model="eventRequest.location"
                  placeholder="City, State or Online"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
                <select
                  v-model="eventRequest.budget"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000+">$25,000+</option>
                </select>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
                <textarea
                  v-model="eventRequest.description"
                  rows="4"
                  placeholder="Please provide details about your event requirements..."
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  required
                ></textarea>
              </div>
  
              <div class="flex gap-3">
                <button
                  type="button"
                  @click="showRequestForm = false"
                  class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Success Toast -->
      <div
        v-if="showToast"
        class="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start gap-3 z-50 max-w-md"
      >
        <i class="i-lucide-check-circle w-5 h-5 mt-0.5"></i>
        <div>
          <h4 class="font-medium">Success!</h4>
          <p class="text-sm">{{ toastMessage }}</p>
        </div>
        <button @click="showToast = false" class="text-green-500 hover:text-green-700 ml-auto">
          <i class="i-lucide-x w-4 h-4"></i>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { ChevronDown, LogOut, User, Settings, Bell } from 'lucide-vue-next'
  import { RouterLink,useRouter } from 'vue-router'
  import UserHeader from '@/views/User/UserHeader.vue'
  // State
  const router = useRouter()
  const activeTab = ref('events')
  const searchQuery = ref('')
  const selectedEvent = ref(null)
  const ticketType = ref('standard')
  const ticketQuantity = ref(1)
  const showRequestForm = ref(false)
  const showToast = ref(false)
  const toastMessage = ref('')
  const eventRequest = ref({
    type: '',
    date: '',
    guests: '',
    location: '',
    budget: '',
    description: '',
  })
  const dropdownOpen = ref(false)
  const unreadNotifications = ref(3)
  const dropdown = ref(null)
  
  // Sample data
  const events = ref([
    {
      id: 1,
      title: 'Tech Conference 2023',
      date: 'May 15, 2023',
      location: 'San Francisco, CA',
      description:
        'Join us for the biggest tech conference of the year featuring keynotes from industry leaders and hands-on workshops.',
      price: 99,
      category: 'Conference',
      image:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 2,
      title: 'Summer Music Festival',
      date: 'June 10, 2023',
      location: 'Austin, TX',
      description:
        'Three days of amazing music performances across five stages with your favorite artists and bands.',
      price: 149,
      category: 'Festival',
      image:
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 3,
      title: 'Food & Wine Expo',
      date: 'July 22, 2023',
      location: 'Chicago, IL',
      description:
        'Taste exquisite dishes and fine wines from top chefs and wineries around the world.',
      price: 75,
      category: 'Food',
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 4,
      title: 'Business Leadership Summit',
      date: 'August 5, 2023',
      location: 'New York, NY',
      description:
        'Connect with industry leaders and learn strategies to grow your business in this exclusive summit.',
      price: 199,
      category: 'Business',
      image:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 5,
      title: 'Art Exhibition Opening',
      date: 'September 12, 2023',
      location: 'Los Angeles, CA',
      description:
        'Be among the first to experience this groundbreaking exhibition featuring works from emerging artists.',
      price: 25,
      category: 'Art',
      image:
        'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
    {
      id: 6,
      title: 'Wellness Retreat Weekend',
      date: 'October 7-9, 2023',
      location: 'Denver, CO',
      description:
        'Rejuvenate your mind and body with yoga, meditation, and wellness workshops in this weekend retreat.',
      price: 299,
      category: 'Wellness',
      image:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    },
  ])
  
  const myTickets = ref([
    {
      id: 'T12345',
      event: {
        title: 'Tech Conference 2023',
        date: 'May 15, 2023',
        location: 'San Francisco, CA',
        image:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      },
      type: 'Standard',
      quantity: 2,
      totalPrice: 198,
    },
  ])
  
  const myRequests = ref([
    {
      id: 'R7890',
      eventType: 'Corporate Team Building',
      status: 'Pending',
      dateRequested: 'April 10, 2023',
      preferredDate: 'July 15, 2023',
      expectedGuests: 50,
      description:
        'Looking for a team building event for our company retreat. We would like outdoor activities and team challenges.',
    },
    {
      id: 'R7891',
      eventType: 'Birthday Party',
      status: 'Approved',
      dateRequested: 'March 5, 2023',
      preferredDate: 'June 20, 2023',
      expectedGuests: 30,
      description:
        'Planning a surprise 40th birthday party with a 90s theme. Need help with decorations, catering, and entertainment.',
    },
  ])
  
  // Computed properties
  const filteredEvents = computed(() => {
    if (!searchQuery.value) return events.value
    const query = searchQuery.value.toLowerCase()
    return events.value.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query),
    )
  })
  
  // Methods
  const selectEvent = (event) => {
    selectedEvent.value = event
    ticketType.value = 'standard'
    ticketQuantity.value = 1
  }
  
  const getTicketPrice = () => {
    if (!selectedEvent.value) return 0
  
    const basePrice = selectedEvent.value.price
    if (ticketType.value === 'standard') return basePrice
    if (ticketType.value === 'vip') return basePrice * 2
    if (ticketType.value === 'premium') return basePrice * 3
    return basePrice
  }
  
  const purchaseTicket = () => {
    // In a real app, this would call an API to process the purchase
    const price = getTicketPrice()
    const total = price * ticketQuantity.value
    const serviceFee = total * 0.1
    const grandTotal = total + serviceFee
  
    // Add to my tickets
    myTickets.value.push({
      id: 'T' + Math.floor(Math.random() * 100000),
      event: {
        title: selectedEvent.value.title,
        date: selectedEvent.value.date,
        location: selectedEvent.value.location,
        image: selectedEvent.value.image,
      },
      type: ticketType.value.charAt(0).toUpperCase() + ticketType.value.slice(1),
      quantity: ticketQuantity.value,
      totalPrice: grandTotal.toFixed(2),
    })
  
    // Close modal and show success message
    selectedEvent.value = null
    showToast.value = true
    toastMessage.value = `Successfully purchased ${ticketQuantity.value} tickets for ${ticketType.value} admission!`
  
    // Switch to tickets tab
    setTimeout(() => {
      activeTab.value = 'myTickets'
    }, 1000)
  }
  
  const submitEventRequest = () => {
    // In a real app, this would call an API to submit the request
  
    // Add to my requests
    myRequests.value.push({
      id: 'R' + Math.floor(Math.random() * 100000),
      eventType: eventRequest.value.type,
      status: 'Pending',
      dateRequested: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      preferredDate: new Date(eventRequest.value.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      expectedGuests: eventRequest.value.guests,
      description: eventRequest.value.description,
    })
  
    // Reset form and close modal
    eventRequest.value = {
      type: '',
      date: '',
      guests: '',
      location: '',
      budget: '',
      description: '',
    }
  
    showRequestForm.value = false
    showToast.value = true
    toastMessage.value = 'Your event request has been submitted successfully!'
  
    // Switch to requests tab
    setTimeout(() => {
      activeTab.value = 'requests'
    }, 1000)
  }
  
  
  
  </script>
  
  <style>
  :root {
    --color-primary: #6366f1;
    --color-primary-dark: #4f46e5;
  }
  
  .bg-primary {
    background-color: var(--color-primary);
  }
  
  .bg-primary-dark {
    background-color: var(--color-primary-dark);
  }
  
  .text-primary {
    color: var(--color-primary);
  }
  
  .border-primary {
    border-color: var(--color-primary);
  }
  
  .focus\:ring-primary:focus {
    --tw-ring-color: var(--color-primary);
  }
  
  .focus\:border-primary:focus {
    border-color: var(--color-primary);
  }
  
  .hover\:bg-primary-dark:hover {
    background-color: var(--color-primary-dark);
  }
  </style>
  