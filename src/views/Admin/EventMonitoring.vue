<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Event Monitoring</h1>
        <p class="text-gray-500 mt-1">Monitor and manage all events on the platform</p>
      </div>
    </div>

    <!-- Event Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div 
        v-for="(status, index) in eventStatusCounts" 
        :key="index"
        class="bg-white rounded-lg shadow p-6"
      >
        <p class="text-sm font-medium text-gray-500">{{ status.label }}</p>
        <p class="text-2xl font-bold mt-1" :class="status.textColor">{{ status.count }}</p>
      </div>
    </div>

    <!-- Event Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="statusFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <select
            v-model="typeFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Types</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="festival">Festival</option>
            <option value="corporate">Corporate</option>
            <option value="fundraiser">Fundraiser</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Organizer
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendees
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                <div class="text-xs text-gray-500">{{ event.location }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {{ getInitials(event.organizer) }}
                  </div>
                  <div class="ml-3 text-sm text-gray-900">{{ event.organizer }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800"
                >
                  {{ event.type.charAt(0).toUpperCase() + event.type.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-blue-100 text-blue-800': event.status === 'upcoming',
                    'bg-green-100 text-green-800': event.status === 'live',
                    'bg-gray-100 text-gray-800': event.status === 'completed',
                    'bg-red-100 text-red-800': event.status === 'canceled'
                  }"
                >
                  {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.attendees }} / {{ event.capacity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button 
                    @click="viewEvent(event)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    <Eye class="h-5 w-5" />
                  </button>
                  <button 
                    v-if="event.status === 'upcoming'"
                    @click="cancelEvent(event.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Cancel Event"
                  >
                    <XCircle class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ events.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600">
                2
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- View Event Modal -->
    <div v-if="showEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Event Details
            </h3>
            <button @click="closeEventModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectedEvent">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left column: Event details -->
            <div class="md:col-span-2 space-y-6">
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ selectedEvent.title }}</h2>
                <p class="text-sm text-gray-500 mt-1">{{ selectedEvent.location }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p class="text-sm text-gray-900">{{ selectedEvent.description }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Event Type</h3>
                  <p class="text-sm text-gray-900">{{ selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1) }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Capacity</h3>
                  <p class="text-sm text-gray-900">{{ selectedEvent.capacity }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Date</h3>
                  <p class="text-sm text-gray-900">{{ selectedEvent.date }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                  <p class="text-sm text-gray-900">{{ selectedEvent.duration }}</p>
                </div>
              </div>
              
              <!-- Attendance Stats -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Attendance</h3>
                <div class="bg-gray-100 rounded-md p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-700">{{ selectedEvent.attendees }} / {{ selectedEvent.capacity }} attendees</span>
                    <span class="text-sm text-gray-700">{{ Math.round((selectedEvent.attendees / selectedEvent.capacity) * 100) }}% capacity</span>
                  </div>
                  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full rounded-full bg-indigo-600" 
                      :style="{ width: `${Math.min((selectedEvent.attendees / selectedEvent.capacity) * 100, 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              
              <!-- Ticket Sales -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Ticket Sales</h3>
                <div class="bg-gray-100 rounded-md p-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs text-gray-500">Total Revenue</p>
                      <p class="text-lg font-bold text-gray-900">${{ selectedEvent.revenue.toLocaleString() }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Tickets Sold</p>
                      <p class="text-lg font-bold text-gray-900">{{ selectedEvent.ticketsSold }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right column: Organizer details and actions -->
            <div class="space-y-6">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Organizer</h3>
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {{ getInitials(selectedEvent.organizer) }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ selectedEvent.organizer }}</p>
                    <p class="text-xs text-gray-500">{{ selectedEvent.organizerEmail }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Event Status</h3>
                <div class="flex items-center">
                  <span 
                    class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-blue-100 text-blue-800': selectedEvent.status === 'upcoming',
                      'bg-green-100 text-green-800': selectedEvent.status === 'live',
                      'bg-gray-100 text-gray-800': selectedEvent.status === 'completed',
                      'bg-red-100 text-red-800': selectedEvent.status === 'canceled'
                    }"
                  >
                    {{ selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1) }}
                  </span>
                </div>
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Assigned Teams</h3>
                <div v-if="selectedEvent.teams && selectedEvent.teams.length > 0">
                  <div 
                    v-for="team in selectedEvent.teams" 
                    :key="team.id"
                    class="flex items-center mb-2 last:mb-0"
                  >
                    <div class="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {{ team.name.charAt(0) }}
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ team.name }}</p>
                      <p class="text-xs text-gray-500">{{ team.specialization }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-500">
                  No teams assigned
                </div>
              </div>
              
              <div class="space-y-3">
                <button
                  v-if="selectedEvent.status === 'upcoming'"
                  @click="cancelEventFromModal(selectedEvent.id)"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle class="h-4 w-4 mr-2" />
                  Cancel Event
                </button>
                <button
                  v-if="selectedEvent.status === 'upcoming'"
                  @click="assignTeamFromModal(selectedEvent)"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <UserPlus class="h-4 w-4 mr-2" />
                  Assign Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Search, 
  Eye, 
  XCircle, 
  X, 
  ChevronLeft, 
  ChevronRight,
  UserPlus
} from 'lucide-vue-next';

const router = useRouter();

// Sample data
const eventStatusCounts = [
  { label: 'Upcoming', count: 28, textColor: 'text-blue-600' },
  { label: 'Live', count: 14, textColor: 'text-green-600' },
  { label: 'Completed', count: 156, textColor: 'text-gray-600' },
  { label: 'Canceled', count: 7, textColor: 'text-red-600' }
];

const events = ref([
  {
    id: 1,
    title: 'Tech Conference 2023',
    description: 'A three-day conference featuring the latest in technology trends, with keynote speakers from leading tech companies.',
    type: 'conference',
    organizer: 'John Doe',
    organizerEmail: 'john.doe@example.com',
    location: 'San Francisco, CA',
    date: 'Nov 15-17, 2023',
    duration: '3 days',
    status: 'upcoming',
    attendees: 0,
    capacity: 500,
    ticketsSold: 350,
    revenue: 52500,
    teams: [
      { id: 1, name: 'Alpha Team', specialization: 'Technical Support' },
      { id: 3, name: 'Gamma Team', specialization: 'Audio/Visual' }
    ]
  },
  {
    id: 2,
    title: 'Music Festival',
    description: 'An outdoor music festival featuring local and international artists across multiple genres.',
    type: 'festival',
    organizer: 'Sarah Johnson',
    organizerEmail: 'sarah.johnson@example.com',
    location: 'Austin, TX',
    date: 'Dec 10-12, 2023',
    duration: '3 days',
    status: 'upcoming',
    attendees: 0,
    capacity: 2000,
    ticketsSold: 1200,
    revenue: 120000,
    teams: []
  },
  {
    id: 3,
    title: 'Product Launch',
    description: 'A corporate event to launch our new product line with demonstrations and networking opportunities.',
    type: 'corporate',
    organizer: 'Michael Brown',
    organizerEmail: 'michael.brown@example.com',
    location: 'New York, NY',
    date: 'Oct 25, 2023',
    duration: '1 day',
    status: 'live',
    attendees: 120,
    capacity: 150,
    ticketsSold: 150,
    revenue: 15000,
    teams: [
      { id: 2, name: 'Beta Team', specialization: 'Event Coordination' }
    ]
  },
  {
    id: 4,
    title: 'Design Workshop',
    description: 'An interactive workshop focused on UX/UI design principles and practices.',
    type: 'workshop',
    organizer: 'Emily Davis',
    organizerEmail: 'emily.davis@example.com',
    location: 'Chicago, IL',
    date: 'Oct 5, 2023',
    duration: '1 day',
    status: 'completed',
    attendees: 45,
    capacity: 50,
    ticketsSold: 48,
    revenue: 4800,
    teams: []
  },
  {
    id: 5,
    title: 'Charity Gala',
    description: 'An annual fundraising gala to support local education initiatives.',
    type: 'fundraiser',
    organizer: 'Robert Wilson',
    organizerEmail: 'robert.wilson@example.com',
    location: 'Los Angeles, CA',
    date: 'Sep 30, 2023',
    duration: '1 evening',
    status: 'canceled',
    attendees: 0,
    capacity: 300,
    ticketsSold: 0,
    revenue: 0,
    teams: []
  }
]);

// State variables
const searchQuery = ref('');
const statusFilter = ref('all');
const typeFilter = ref('all');
const showEventModal = ref(false);
const selectedEvent = ref(null);

// Computed properties
const filteredEvents = computed(() => {
  let result = [...events.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.organizer.toLowerCase().includes(query) ||
      event.type.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(event => event.status === statusFilter.value);
  }
  
  // Apply type filter
  if (typeFilter.value !== 'all') {
    result = result.filter(event => event.type === typeFilter.value);
  }
  
  return result;
});

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Action functions
const viewEvent = (event) => {
  selectedEvent.value = event;
  showEventModal.value = true;
};

const closeEventModal = () => {
  showEventModal.value = false;
  selectedEvent.value = null;
};

const cancelEvent = (eventId) => {
  const index = events.value.findIndex(e => e.id === eventId);
  if (index !== -1) {
    events.value[index].status = 'canceled';
    
    // Update event status counts
    eventStatusCounts[0].count--; // Decrease upcoming count
    eventStatusCounts[3].count++; // Increase canceled count
  }
};

const cancelEventFromModal = (eventId) => {
  cancelEvent(eventId);
  closeEventModal();
};

const assignTeamFromModal = (event) => {
  // Navigate to team assignment page with the event ID
  router.push(`/admin/team-assignment?eventId=${event.id}`);
};
</script>

