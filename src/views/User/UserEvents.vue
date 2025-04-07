<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Events</h1>
        <p class="text-gray-500 mt-1">Browse and manage your events</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search events..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <select 
          v-model="categoryFilter" 
          class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Music">Music</option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
          <option value="Sports">Sports</option>
        </select>
      </div>
    </div>
    
    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="filteredEvents.length === 0" class="md:col-span-2 lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <div class="flex flex-col items-center">
            <Calendar class="h-16 w-16 text-gray-400 mb-4" />
            <p class="text-lg font-medium mb-1">No events found</p>
            <p class="text-sm text-gray-500 mb-4">
              {{ searchQuery || categoryFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "You haven't registered for any events yet" 
              }}
            </p>
            <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Browse Events
            </button>
          </div>
        </div>
      </div>
      
      <div 
        v-for="event in filteredEvents" 
        :key="event.id" 
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <img :src="event.image" alt="Event" class="h-48 w-full object-cover" />
        
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-medium text-gray-900">{{ event.title }}</h3>
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ event.category }}
            </span>
          </div>
          
          <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ event.description }}</p>
          
          <div class="mb-4">
            <div class="flex items-center text-sm text-gray-500 mb-1">
              <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ event.date }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mb-1">
              <Clock class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ event.time }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <MapPin class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ event.venue }}
            </div>
          </div>
          
          <div class="flex justify-between items-center">
            <div class="flex">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="rateEvent(event.id, i)"
                class="text-gray-300 hover:text-yellow-400"
                :class="{ 'text-yellow-400': event.userRating >= i }"
              >
                <Star class="h-5 w-5" />
              </button>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="$emit('share-event', event.id)" 
                class="p-1 rounded-full text-gray-400 hover:text-gray-500"
                title="Share Event"
              >
                <Share2 class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-sm font-medium text-gray-500">From</p>
              <p class="text-sm font-medium text-gray-900">${{ event.pricing[0].price.toFixed(2) }}</p>
            </div>
            
            <button 
              @click="$emit('view-event', event.id)" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {{ event.hasTickets ? 'View Tickets' : 'View Details' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event Details Modal -->
    <div v-if="showEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="relative">
          <img :src="selectedEvent.image" alt="Event" class="w-full h-64 object-cover" />
          <button 
            @click="showEventModal = false" 
            class="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md"
          >
            <X class="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div class="p-6" v-if="selectedEvent">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ selectedEvent.title }}</h2>
              <span class="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ selectedEvent.category }}
              </span>
            </div>
            
            <div class="flex space-x-2">
              <button 
                @click="$emit('share-event', selectedEvent.id)" 
                class="p-2 rounded-full text-gray-400 hover:text-gray-500 border border-gray-200"
                title="Share Event"
              >
                <Share2 class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <p class="text-gray-600 mb-6">{{ selectedEvent.description }}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Event Details</h3>
              
              <div class="space-y-3">
                <div class="flex items-center">
                  <Calendar class="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">Date</p>
                    <p class="text-sm text-gray-500">{{ selectedEvent.date }}</p>
                  </div>
                </div>
                
                <div class="flex items-center">
                  <Clock class="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">Time</p>
                    <p class="text-sm text-gray-500">{{ selectedEvent.time }}</p>
                  </div>
                </div>
                
                <div class="flex items-center">
                  <MapPin class="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">Venue</p>
                    <p class="text-sm text-gray-500">{{ selectedEvent.venue }}</p>
                    <p class="text-sm text-gray-500">{{ selectedEvent.address }}</p>
                  </div>
                </div>
                
                <div class="flex items-center">
                  <User class="flex-shrink-0 mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p class="text-sm font-medium text-gray-900">Organizer</p>
                    <p class="text-sm text-gray-500">{{ selectedEvent.organizer }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">Ticket Information</h3>
              
              <div class="bg-gray-50 rounded-lg p-4 mb-4">
                <div v-for="(price, index) in selectedEvent.pricing" :key="index" class="flex justify-between items-center mb-2 last:mb-0">
                  <p class="text-sm font-medium text-gray-900">{{ price.type }}</p>
                  <p class="text-sm font-medium text-gray-900">${{ price.price.toFixed(2) }}</p>
                </div>
              </div>
              
              <div class="flex justify-center">
                <button 
                  v-if="selectedEvent.hasTickets"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Buy Tickets
                </button>
                <button 
                  v-else
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled
                >
                  Tickets Unavailable
                </button>
              </div>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-3">Rate this event</h3>
            
            <div class="flex items-center space-x-1">
              <button 
                v-for="i in 5" 
                :key="i"
                @click="rateEvent(selectedEvent.id, i)"
                class="p-1 text-gray-300 hover:text-yellow-400"
                :class="{ 'text-yellow-400': selectedEvent.userRating >= i }"
              >
                <Star class="h-6 w-6" />
              </button>
              
              <span class="ml-2 text-sm text-gray-500">
                {{ selectedEvent.userRating > 0 ? `Your rating: ${selectedEvent.userRating}/5` : 'Rate this event' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  Search, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  Share2, 
  X, 
  User 
} from 'lucide-vue-next';

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['view-event', 'share-event', 'rate-event']);

// State
const searchQuery = ref('');
const categoryFilter = ref('all');
const showEventModal = ref(false);
const selectedEvent = ref(null);

// Computed
const filteredEvents = computed(() => {
  let result = [...props.events];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (categoryFilter.value !== 'all') {
    result = result.filter(event => event.category === categoryFilter.value);
  }

  return result;
});

// Methods
const viewEventDetails = (eventId) => {
  const event = props.events.find(e => e.id === eventId);
  if (event) {
    selectedEvent.value = event;
    showEventModal.value = true;
  }
};

const rateEvent = (eventId, rating) => {
  emit('rate-event', eventId, rating);
};
</script>

