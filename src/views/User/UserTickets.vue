<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Tickets</h1>
        <p class="text-gray-500 mt-1">Manage your event tickets</p>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search tickets..." 
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        
        <select 
          v-model="statusFilter" 
          class="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Tickets</option>
          <option value="active">Active</option>
          <option value="used">Used</option>
        </select>
      </div>
    </div>
    
    <!-- Tickets Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="filteredTickets.length === 0" class="md:col-span-2 lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <div class="flex flex-col items-center">
            <Ticket class="h-16 w-16 text-gray-400 mb-4" />
            <p class="text-lg font-medium mb-1">No tickets found</p>
            <p class="text-sm text-gray-500 mb-4">
              {{ searchQuery || statusFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "You haven't purchased any tickets yet" 
              }}
            </p>
            <button class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Browse Events
            </button>
          </div>
        </div>
      </div>
      
      <div 
        v-for="ticket in filteredTickets" 
        :key="ticket.id" 
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-medium text-gray-900">{{ ticket.eventTitle }}</h3>
            <span 
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="ticket.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
            >
              {{ ticket.status === 'active' ? 'Active' : 'Used' }}
            </span>
          </div>
          
          <div class="mb-4">
            <div class="flex items-center text-sm text-gray-500 mb-1">
              <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ ticket.date }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mb-1">
              <Clock class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ ticket.time }}
            </div>
            <div class="flex items-center text-sm text-gray-500">
              <MapPin class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {{ ticket.venue }}
            </div>
          </div>
          
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Ticket Type</p>
              <p class="text-sm font-medium text-gray-900">{{ ticket.ticketType }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-500">Price</p>
              <p class="text-sm font-medium text-gray-900">${{ ticket.price.toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between">
              <button 
                @click="$emit('download-ticket', ticket.id)" 
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download class="h-4 w-4 mr-1" />
                Download
              </button>
              
              <button 
                v-if="ticket.status === 'active'"
                @click="showRefundConfirmation(ticket)" 
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCcw class="h-4 w-4 mr-1" />
                Refund
              </button>
            </div>
          </div>
        </div>
        
        <div 
          class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center"
          @click="showTicketDetails(ticket)"
        >
          <div class="flex items-center cursor-pointer">
            <QrCode class="h-5 w-5 text-gray-400 mr-2" />
            <span class="text-sm font-medium text-gray-700">View QR Code</span>
          </div>
          <ChevronRight class="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
    
    <!-- Ticket Details Modal -->
    <div v-if="showTicketModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Ticket Details
            </h3>
            <button @click="showTicketModal = false" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectedTicket">
          <div class="flex flex-col items-center mb-6">
            <div class="bg-white p-4 rounded-lg shadow-inner border border-gray-200 mb-4">
              <QrCode class="h-48 w-48 text-gray-900" />
            </div>
            <p class="text-sm font-medium text-gray-500">{{ selectedTicket.qrCode }}</p>
          </div>
          
          <div class="space-y-4">
            <div>
              <h4 class="text-lg font-medium text-gray-900">{{ selectedTicket.eventTitle }}</h4>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {{ selectedTicket.date }}
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <Clock class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {{ selectedTicket.time }}
              </div>
              <div class="flex items-center text-sm text-gray-500 mt-1">
                <MapPin class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                {{ selectedTicket.venue }}
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Ticket Type</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedTicket.ticketType }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Price</p>
                <p class="text-sm font-medium text-gray-900">${{ selectedTicket.price.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Attendee</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedTicket.attendee }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Seat</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedTicket.seat }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
          <button
            @click="$emit('download-ticket', selectedTicket.id)"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download class="h-4 w-4 mr-2" />
            Download
          </button>
          <button
            v-if="selectedTicket && selectedTicket.status === 'active'"
            @click="showRefundConfirmation(selectedTicket)"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCcw class="h-4 w-4 mr-2" />
            Request Refund
          </button>
        </div>
      </div>
    </div>
    
    <!-- Refund Confirmation Modal -->
    <div v-if="showRefundModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mb-2">
            Request Refund
          </h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to request a refund for this ticket? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="showRefundModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="confirmRefund"
            >
              Request Refund
            </button>
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
  Download, 
  RefreshCcw, 
  QrCode, 
  ChevronRight, 
  X, 
  AlertCircle 
} from 'lucide-vue-next';

const props = defineProps({
  tickets: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['download-ticket', 'request-refund']);

// State
const searchQuery = ref('');
const statusFilter = ref('all');
const showTicketModal = ref(false);
const showRefundModal = ref(false);
const selectedTicket = ref(null);
const ticketToRefund = ref(null);

// Computed
const filteredTickets = computed(() => {
  let result = [...props.tickets];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(ticket => 
      ticket.eventTitle.toLowerCase().includes(query) || 
      ticket.venue.toLowerCase().includes(query) ||
      ticket.ticketType.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter(ticket => ticket.status === statusFilter.value);
  }
  
  return result;
});

// Methods
const showTicketDetails = (ticket) => {
  selectedTicket.value = ticket;
  showTicketModal.value = true;
};

const showRefundConfirmation = (ticket) => {
  ticketToRefund.value = ticket;
  showRefundModal.value = true;
  showTicketModal.value = false; // Close ticket modal if open
};

const confirmRefund = () => {
  if (ticketToRefund.value) {
    emit('request-refund', ticketToRefund.value.id);
    showRefundModal.value = false;
  }
};
</script>

