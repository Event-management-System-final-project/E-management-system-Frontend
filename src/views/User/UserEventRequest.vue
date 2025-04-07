<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Event Requests</h1>
        <p class="text-gray-500 mt-1">Request new events and track their status</p>
      </div>
      
      <button 
        @click="showNewRequestModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Plus class="h-4 w-4 mr-2" />
        New Request
      </button>
    </div>
    
    <!-- Status filters -->
    <div class="flex flex-wrap gap-2">
      <button 
        @click="statusFilter = 'all'"
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="statusFilter === 'all' 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
      >
        All Requests
      </button>
      <button 
        @click="statusFilter = 'pending'"
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="statusFilter === 'pending' 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
      >
        Pending
      </button>
      <button 
        @click="statusFilter = 'approved'"
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="statusFilter === 'approved' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
      >
        Approved
      </button>
      <button 
        @click="statusFilter = 'rejected'"
        class="px-3 py-1 rounded-full text-sm font-medium"
        :class="statusFilter === 'rejected' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
      >
        Rejected
      </button>
    </div>
    
    <!-- Requests List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="filteredRequests.length === 0" class="p-12 text-center">
        <div class="flex flex-col items-center">
          <FileEdit class="h-16 w-16 text-gray-400 mb-4" />
          <p class="text-lg font-medium mb-1">No event requests found</p>
          <p class="text-sm text-gray-500 mb-4">
            {{ statusFilter !== 'all' 
              ? `You don't have any ${statusFilter} requests` 
              : "You haven't made any event requests yet" 
            }}
          </p>
          <button 
            @click="showNewRequestModal = true"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus class="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>
      </div>
      
      <div v-else class="divide-y divide-gray-200">
        <div 
          v-for="request in filteredRequests" 
          :key="request.id" 
          class="p-6 hover:bg-gray-50 transition-colors duration-150"
          @click="viewRequestDetails(request)"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div class="flex items-center">
                <h3 class="text-lg font-medium text-gray-900">{{ request.title }}</h3>
                <span 
                  class="ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': request.status === 'pending',
                    'bg-green-100 text-green-800': request.status === 'approved',
                    'bg-red-100 text-red-800': request.status === 'rejected'
                  }"
                >
                  {{ capitalizeFirstLetter(request.status) }}
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ request.description }}</p>
              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <div class="flex items-center">
                  <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  Proposed: {{ request.proposedDate }}
                </div>
                <div class="flex items-center">
                  <Users class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {{ request.expectedAttendees }} attendees
                </div>
                <div class="flex items-center">
                  <Tag class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {{ request.category }}
                </div>
                <div class="flex items-center">
                  <Clock class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  Requested: {{ formatDate(request.requestDate) }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center">
              <ChevronRight class="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Request Details Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Event Request Details
            </h3>
            <button @click="showRequestModal = false" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6" v-if="selectedRequest">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900">{{ selectedRequest.title }}</h2>
            <span 
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': selectedRequest.status === 'pending',
                'bg-green-100 text-green-800': selectedRequest.status === 'approved',
                'bg-red-100 text-red-800': selectedRequest.status === 'rejected'
              }"
            >
              {{ capitalizeFirstLetter(selectedRequest.status) }}
            </span>
          </div>
          
          <div class="space-y-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Description</h4>
              <p class="text-sm text-gray-900">{{ selectedRequest.description }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Proposed Date</h4>
                <p class="text-sm text-gray-900">{{ selectedRequest.proposedDate }}</p>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Expected Attendees</h4>
                <p class="text-sm text-gray-900">{{ selectedRequest.expectedAttendees }}</p>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Category</h4>
                <p class="text-sm text-gray-900">{{ selectedRequest.category }}</p>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Budget</h4>
                <p class="text-sm text-gray-900">${{ selectedRequest.budget.toFixed(2) }}</p>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Request Date</h4>
                <p class="text-sm text-gray-900">{{ formatDate(selectedRequest.requestDate) }}</p>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-1">Status</h4>
                <p class="text-sm text-gray-900">{{ capitalizeFirstLetter(selectedRequest.status) }}</p>
              </div>
            </div>
            
            <div v-if="selectedRequest.notes">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Additional Notes</h4>
              <p class="text-sm text-gray-900">{{ selectedRequest.notes }}</p>
            </div>
            
            <div v-if="selectedRequest.status === 'rejected' && selectedRequest.rejectionReason" class="bg-red-50 p-4 rounded-md">
              <h4 class="text-sm font-medium text-red-800 mb-1">Rejection Reason</h4>
              <p class="text-sm text-red-700">{{ selectedRequest.rejectionReason }}</p>
            </div>
          </div>
        </div>
        <div class="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            @click="showRequestModal = false"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    
    <!-- New Request Modal -->
    <div v-if="showNewRequestModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              New Event Request
            </h3>
            <button @click="showNewRequestModal = false" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="submitNewRequest" class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">
                Event Title *
              </label>
              <input
                id="title"
                v-model="newRequestForm.title"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter event title"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                v-model="newRequestForm.description"
                rows="3"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe your event"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="proposedDate" class="block text-sm font-medium text-gray-700">
                  Proposed Date *
                </label>
                <input
                  id="proposedDate"
                  v-model="newRequestForm.proposedDate"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label for="expectedAttendees" class="block text-sm font-medium text-gray-700">
                  Expected Attendees *
                </label>
                <input
                  id="expectedAttendees"
                  v-model="newRequestForm.expectedAttendees"
                  type="number"
                  min="1"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Number of attendees"
                />
              </div>
              
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  v-model="newRequestForm.category"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  <option value="Technology">Technology</option>
                  <option value="Music">Music</option>
                  <option value="Education">Education</option>
                  <option value="Business">Business</option>
                  <option value="Sports">Sports</option>
                  <option value="Art">Art</option>
                  <option value="Charity">Charity</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label for="budget" class="block text-sm font-medium text-gray-700">
                  Budget ($) *
                </label>
                <input
                  id="budget"
                  v-model="newRequestForm.budget"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                id="notes"
                v-model="newRequestForm.notes"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Any additional information or requirements"
              ></textarea>
            </div>
            
            <div class="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="showNewRequestModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  Plus, 
  Calendar, 
  Users, 
  Tag, 
  Clock, 
  ChevronRight, 
  X, 
  FileEdit 
} from 'lucide-vue-next';

const props = defineProps({
  requests: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['new-request']);

// State
const statusFilter = ref('all');
const showRequestModal = ref(false);
const showNewRequestModal = ref(false);
const selectedRequest = ref(null);
const newRequestForm = ref({
  title: '',
  description: '',
  proposedDate: '',
  expectedAttendees: '',
  category: '',
  budget: '',
  notes: ''
});

// Computed
const filteredRequests = computed(() => {
  if (statusFilter.value === 'all') {
    return props.requests;
  }
  return props.requests.filter(request => request.status === statusFilter.value);
});

// Methods
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const viewRequestDetails = (request) => {
  selectedRequest.value = request;
  showRequestModal.value = true;
};

const submitNewRequest = () => {
  const requestData = {
    title: newRequestForm.value.title,
    description: newRequestForm.value.description,
    proposedDate: newRequestForm.value.proposedDate,
    expectedAttendees: parseInt(newRequestForm.value.expectedAttendees),
    category: newRequestForm.value.category,
    budget: parseFloat(newRequestForm.value.budget),
    notes: newRequestForm.value.notes,
  };

  emit('new-request', requestData);

  // Reset the form and close the modal
  newRequestForm.value = {
    title: '',
    description: '',
    proposedDate: '',
    expectedAttendees: '',
    category: '',
    budget: '',
    notes: '',
  };
  showNewRequestModal.value = false;
};
</script>
