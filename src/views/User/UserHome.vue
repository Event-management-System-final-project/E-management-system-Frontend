<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Calendar, Trash, MapPin } from 'lucide-vue-next'
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import axios from 'axios'

// State
const activeTab = ref('events')
const searchQuery = ref('')
const showRequestForm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' or 'error'
const newRequirement = ref('')
const token = localStorage.getItem('token')
const eventRequest = ref({
  title: '',
  type: '',
  date: '',
  guests: '',
  location: '',
  budget: '',
  description: '',
  requirements: [],
})

// Chat state
const activeChatRequest = ref(null)
const newMessage = ref('')
const isTeamTyping = ref(false)
const chatMessagesContainer = ref(null)
const unreadMessages = computed(() => {
  return myRequests.value.reduce((total, request) => {
    return total + (request.unreadCount || 0)
  }, 0)
})

// Data
const events = ref([])
const myRequests = ref([])

const myTickets = ref([])


const addRequirement = () => {
  if (newRequirement.value.trim() === '') {
    alert('Please enter a valid requirement.')
    return
  }
  eventRequest.value.requirements.push(newRequirement.value.trim())
  newRequirement.value = ''
}

const removeRequirement = (index) => {
  eventRequest.value.requirements.splice(index, 1)
}

const errorMessage = ref({
  title: '',
  type: '',
  date: '',
  guests: '',
  location: '',
  budget: '',
  description: '',
  requirements: '',
})

const clearError = (field) => {
  errorMessage.value[field] = ''
}

const charCount = computed(() => eventRequest.value.description.length)

// Validating the form
const validateForm = () => {
  if (!eventRequest.value.title) {
    errorMessage.value.title = 'Title is required'
    return false
  }
  if (!eventRequest.value.type) {
    errorMessage.value.type = 'Please select an event type'
    return false
  }
  if (!eventRequest.value.date) {
    errorMessage.value.date = 'Please select a date for your event'
    return false
  }
  if (!eventRequest.value.guests) {
    errorMessage.value.guests = 'Please enter the number of expected guests'
    return false
  }
  if (!eventRequest.value.location) {
    errorMessage.value.location = 'Please enter the location of the event'
    return false
  }
  if (!eventRequest.value.budget) {
    errorMessage.value.budget = 'Please enter your budget'
    return false
  }
  if (!eventRequest.value.description || eventRequest.value.description.length < 200) {
    errorMessage.value.description = 'Description must be at least 200 characters long.'
    return false
  }
  if (eventRequest.value.requirements.length === 0) {
    errorMessage.value.requirements = 'Please add at least one requirement'
    return false
  }
  return true
}

const submitEventRequest = async () => {
  if (!validateForm()) return
  const eventData = {
    title: eventRequest.value.title,
    category: eventRequest.value.type,
    due_date: eventRequest.value.date,
    location: eventRequest.value.location,
    budget: eventRequest.value.budget,
    description: eventRequest.value.description,
    requirements: eventRequest.value.requirements,
    attendees: eventRequest.value.guests,
  }
  try {
    // Send request to backend
    await axios.post('http://localhost:8000/api/user/event/request', eventData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    // Reset form and show success
    eventRequest.value = {
      title: '',
      type: '',
      date: '',
      guests: '',
      location: '',
      budget: '',
      description: '',
      requirements: [],
    }
    showRequestForm.value = false
    showToastMessage('Your event request has been submitted successfully!', 'success')
    activeTab.value = 'requests'
  } catch (error) {
    console.error('Error submitting event request:', error)
    showToastMessage('Failed to submit event request. Please try again.', 'error')
  }
}

// Fetch my requests
const fetchRequests = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/event/request', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    myRequests.value = response.data.events
    console.log('My Requests:', myRequests.value)
  } catch (error) {
    console.error('Error fetching requests:', error)
    showToastMessage('Failed to load requests. Please try again.', 'error')
  }
}
onMounted(() => {
  fetchRequests()
})

const selectedRequest = ref(null)
const showCheckoutModal = ref(false)
const paymentDetails = ref({
  phoneNumber: '',
  first_name:'',
  last_name:'',
  email:'',
  amount:'',
})

const openCheckoutModal = (request) => {
  selectedRequest.value = request


  showCheckoutModal.value = true
  paymentDetails.value.first_name= user.firstName
  paymentDetails.value.last_name= user.lastName
  paymentDetails.value.email= user.email
  paymentDetails.value.amount = selectedRequest.value.budget
}

const closeCheckoutModal = () => {
  showCheckoutModal.value = false
  paymentDetails.value = {
    phoneNumber: ''
  }
}

const user = JSON.parse(localStorage.getItem('user'))


const processPayment = async () => {
  // Validate payment details
  if (!paymentDetails.value.phoneNumber) {
    showToastMessage('Please enter your phone number.', 'error')
    return
  }

const paymentData={
  event_id: selectedRequest.value.id,

  first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    currency: 'ETB',
    amount: selectedRequest.value.budget,
    phone: paymentDetails.value.phoneNumber,

}

  try {
    // Send payment request to Chapa API
    const response = await axios.post('http://localhost:8000/api/initialize/event_request/payment', paymentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

  // Handle the response based on what the backend returns
  if (response.data && typeof response.data === 'string' && response.data.startsWith('http')) {
      // If the response is directly the checkout URL as a string
      console.log('Redirecting to:', response.data);
      window.location.href = response.data;
    } else if (response.data && response.data.checkout_url) {
      // If the response is an object with a checkout_url property
      console.log('Redirecting to:', response.data.checkout_url);
      window.location.href = response.data.checkout_url;
    } else{
    showToastMessage('Failed to Initialize payment. Please try again.', 'error')

    }
  } catch (error) {
    console.error('Error processing payment:', error)
    showToastMessage('Failed to process payment. Please try again.', 'error')
  }
}

const closeChat = () => {
  activeChatRequest.value = null
  newMessage.value = ''
  isTeamTyping.value = false
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  const message = {
    sender: 'user',
    text: newMessage.value,
    time: 'Just now',
  }
  activeChatRequest.value.messages.push(message)
  newMessage.value = ''
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
  isTeamTyping.value = true
  setTimeout(
    () => {
      isTeamTyping.value = false
      let responseText = ''
      if (activeChatRequest.value.eventType.includes('Corporate')) {
        responseText =
          'Thanks for your message! For corporate events, we typically need about 4-6 weeks of planning time. Would that timeline work for your team building event?'
      } else if (activeChatRequest.value.eventType.includes('Birthday')) {
        responseText =
          'Great! For the 90s themed party, we can definitely include those elements. Would you like to schedule a call to discuss the details further?'
      } else {
        responseText =
          "Thank you for your message! I'll review this information and get back to you with some options soon. Is there anything else you'd like to add about your event requirements?"
      }
      activeChatRequest.value.messages.push({
        sender: 'team',
        text: responseText,
        time: 'Just now',
      })
      nextTick(() => {
        if (chatMessagesContainer.value) {
          chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
        }
      })
    },
    2000 + Math.random() * 1000,
  )
}

watch(
  () => activeChatRequest.value?.messages,
  () => {
    nextTick(() => {
      if (chatMessagesContainer.value) {
        chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
      }
    })
  },
  { deep: true },
)

// Fetch events
const fetchEvents = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/events', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    events.value = response.data.events || []
  } catch (error) {
    console.error('Error fetching events:', error)
    showToastMessage('Failed to load events. Please try again.', 'error')
  }
}

onMounted(() => {
  fetchEvents()
})

// Computed properties
const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRequestType = event.request_type === 'organizer'
    return matchesSearch && matchesRequestType
  })
})

// Methods to add to cart
const addToCart = async (eventId) => {
  const event_id = eventId
  console.log('Event ID:', event_id)

  try {
    const response = await axios.post(
      'http://localhost:8000/api/user/cart/add',
      { event_id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    )
    console.log('Added to cart:', response.data)
    showToastMessage('Event added to cart successfully!', 'success')
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error('Conflict error:', error.response.data.message)
      showToastMessage(error.response.data.message || 'Event is already in the cart.', 'error')
    } else {
      console.error('Error adding to cart:', error)
      showToastMessage('Failed to add to cart. Please try again.', 'error')
    }
  }
}

// Function to show toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const truncateDescription = (request) => {
  if (request.description.length > 100 && !request.showFullDescription) {
    return request.description.substring(0, 100)
  }
  return request.description
}

const toggleDescription = (request) => {
  request.showFullDescription = !request.showFullDescription
}

//fetching tickets

const fetchingTickets=async()=>{
  try {
    const response = await axios.get('http://localhost:8000/api/user/tickets',{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    myTickets.value=response.data
    console.log('tickets',response.data)
  } catch (error) {
    console.error('Error',error)
  }
}
fetchingTickets()

// Add this to your component
const qrCodeUrl = ref('');

// Function to generate QR code
const generateQRCode = async (text) => {
  try {
    const url = await QRCode.toDataURL(text, {
      width: 150,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
    return url;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};


const downloadTicket = async (ticket) => {
  try {
    // Get user data from localStorage
    const userData = JSON.parse(localStorage.getItem('user')) || {};
    const user = {
      firstName: userData.firstName || 'Guest',
      lastName: userData.lastName || '',
      email: userData.email || 'No email provided'
    };

    // Create PDF with 10x10 inch dimensions (254 × 254 mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [254, 254] // 10x10 inches in mm
    });

    // Set up colors
    const primaryColor = [33, 150, 243]; // Blue
    const secondaryColor = [255, 255, 255]; // White
    const textColor = [0, 0, 0]; // Black
    const lightGray = [200, 200, 200]; // Light gray

    // Add header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 254, 30, 'F'); // Header rectangle
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("EVENT TICKET", 127, 18, { align: 'center' });

    // Add event name
    doc.setTextColor(...textColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text(ticket.event.title, 127, 40, { align: 'center' });

    // Add ticket details section
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.2);
    doc.line(20, 50, 234, 50); // Horizontal line

    // Left column - Event details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Event Details", 30, 60);

    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(ticket.event.date).toLocaleDateString()}`, 30, 70);
    doc.text(`Time: ${new Date(ticket.event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, 30, 80);
    doc.text(`Location: ${ticket.event.location}`, 30, 90);

    // Right column - Attendee details
    doc.setFont('helvetica', 'bold');
    doc.text("Attendee Information", 140, 60);

    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${user.firstName} ${user.lastName}`, 140, 70);
    doc.text(`Email: ${user.email}`, 140, 80);
    doc.text(`Ticket Type: ${ticket.ticket_type || 'Standard'}`, 140, 90);

    // Add QR code section
    doc.setFont('helvetica', 'bold');
    doc.text("Ticket Verification", 127, 120, { align: 'center' });

    // Generate QR code with ticket information
    const qrCodeData = `Ticket ID: ${ticket.id}\nEvent: ${ticket.event.title}\nDate: ${ticket.event.date}\nAttendee: ${user.firstName} ${user.lastName}\nEmail:${user.email}`;
    const qrCodeUrl = await generateQRCode(qrCodeData);

    // Add QR code to PDF if generated successfully
    if (qrCodeUrl) {
      const qrCodeImg = new Image();
      qrCodeImg.src = qrCodeUrl;

      // Wait for the image to load
      await new Promise((resolve) => {
        qrCodeImg.onload = resolve;
      });

      // Add QR code to PDF (larger size for 10x10 inch)
      doc.addImage(qrCodeImg, 'PNG', 90, 130, 70, 70);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.text("QR Code could not be generated", 127, 160, { align: 'center' });
    }

    // Add footer
    doc.setFillColor(...primaryColor);
    doc.rect(0, 230, 254, 20, 'F'); // Footer rectangle

    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("Thank you for attending!", 127, 238, { align: 'center' });
    doc.text(`Ticket ID: #${ticket.id}`, 127, 244, { align: 'center' });

    // Add some decorative elements
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(20, 220, 234, 220); // Decorative line above footer

    // Save the PDF
    doc.save(`Ticket_${ticket.id}.pdf`);
  } catch (error) {
    console.error("Error downloading ticket:", error);
    alert(`Failed to download the ticket. Please try again. Error: ${error.message}`);
  }
};



</script>
<template>
  <div class="min-h-screen bg-gray-50">
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
            Browse Events
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
            <span
              v-if="unreadMessages > 0"
              class="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
            >
              {{ unreadMessages }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Events Tab -->
      <div v-if="activeTab === 'events'">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Browse Events</h2>
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
              <img :src="event.media_url" :alt="event.title" class="w-full h-full object-cover" />
              <div
                class="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium text-primary"
              >
                {{ event.category }}
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center">
                <Calendar class="h-5 w-5 mr-2 text-blue-600" />
                <span class="text-sm md:text-base">{{ formatDate(event.date) }}</span>
              </div>
              <h3 class="font-bold mt-5 text-lg mb-2">{{ event.title }}</h3>
              <div class="flex mb-5 mt-5 items-center">
                <MapPin class="h-5 w-5 mr-2 text-red-600" />
                <span class="text-sm md:text-base">{{ event.location }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-bold text-blue-600">ETB {{ event.price }}</span>
                <div class="flex gap-2">
                  <!-- Buy Ticket Button -->
                  <button
                    @click="addToCart(event.id)"
                    class="bg-blue-700 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                  <!-- View Event Details Button -->
                  <router-link
                    :to="`/userview/event-details/${event.id}`"
                    class="bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition-colors text-sm"
                  >
                    View Details
                  </router-link>
                </div>
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
                  <p class="font-medium">{{ ticket.ticket_type }}</p>
                </div>
                <!-- <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                  <span class="text-xs text-gray-500">Quantity</span>
                  <p class="font-medium">{{ ticket.quantity }}</p>
                </div> -->
                <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                  <span class="text-xs text-gray-500">Order ID</span>
                  <p class="font-medium">#{{ ticket.id }}</p>
                </div>
              </div>
            </div>
            <div class="md:w-1/6 flex flex-row md:flex-col justify-between items-end">
              <div class="text-right">
                <span class="text-xs text-gray-500">Price</span>
                <p class="font-bold text-blue-900">{{ ticket.event.price }}ETB</p>
              </div>
              <button
              @click="downloadTicket(ticket)"
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
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors"
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
              <h3 class="font-bold text-lg">{{ request.title }}</h3>
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    request.approval_status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.approval_status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ request.approval_status }}
                </span>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div>
                <span class="text-xs text-gray-500">Date Requested</span>
                <p class="font-medium">{{ formatDate(request.created_at) }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500">Preferred Date</span>
                <p class="font-medium">{{ formatDate(request.date) }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500">Expected Guests</span>
                <p class="font-medium">{{ request.attendees }}</p>
              </div>
              <div>
                <span class="text-xs text-gray-500">Budget</span>
                <p class="font-medium">{{ request.budget }}</p>
              </div>
            </div>
            <p class="text-gray-900 text-xs mb-4">Description</p>
            <p class="text-gray-600 mb-4">
              {{ truncateDescription(request) }}
              <span
                v-if="request.description.length > 100"
                class="text-red-500 cursor-pointer"
                @click="toggleDescription(request)"
              >
                {{ request.showFullDescription ? 'Read less...' : 'Read more...' }}
              </span>
            </p>

            <div class="flex justify-end gap-2">
              <button
                v-if="request.approval_status === 'approved'"
                @click="openCheckoutModal(request)"
                class="text-white bg-blue-700 rounded-md px-10 py-2 mr-2 hover:bg-blue-600 font-medium text-sm flex items-center"
              >
                Pay
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
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors"
          >
            New Request
          </button>
        </div>
      </div>
    </main>

    <!-- Request Event Modal -->
    <div
      v-if="showRequestForm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold">Request Custom Event</h3>
            <button @click="showRequestForm = false" class="text-gray-400 hover:text-gray-500">
              <i class="i-lucide-x w-5 h-5"></i>
            </button>
          </div>

          <form @submit.prevent="submitEventRequest" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Event title</label>
              <input
                type="text"
                v-model="eventRequest.title"
                placeholder="Your event title"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                @input="clearError('title')"
              />
              <p class="text-red-500" v-if="errorMessage.title">{{ errorMessage.title }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                v-model="eventRequest.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                @change="clearError('type')"
              >
                <option value="">Select event type</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday Party</option>
                <option value="Conference">Conference</option>
                <option value="Other">Other</option>
              </select>
              <p v-if="errorMessage.type" class="text-red-500">{{ errorMessage.type }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  v-model="eventRequest.date"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  @input="clearError('date')"
                />
                <p v-if="errorMessage.date" class="text-red-500">{{ errorMessage.date }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Expected Guests</label>
                <input
                  type="number"
                  v-model="eventRequest.guests"
                  min="1"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  @input="clearError('guests')"
                />
                <p v-if="errorMessage.guests" class="text-red-500">{{ errorMessage.guests }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                v-model="eventRequest.location"
                placeholder="Location of the event"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                @input="clearError('location')"
              />
              <p v-if="errorMessage.location" class="text-red-500">{{ errorMessage.location }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                v-model="eventRequest.budget"
                placeholder="Your Budget"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                @input="clearError('budget')"
              />
              <p v-if="errorMessage.budget" class="text-red-500">{{ errorMessage.budget }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
              <textarea
                v-model="eventRequest.description"
                rows="4"
                placeholder="Please provide some description about your event..."
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                @input="clearError('description')"
              ></textarea>
              <p class="text-sm text-gray-500 mt-1">Characters: {{ charCount }}/200</p>
              <p v-if="errorMessage.description" class="text-red-500">
                {{ errorMessage.description }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
              <div class="space-y-2">
                <!-- Input Field to Add Requirements -->
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    v-model="newRequirement"
                    placeholder="Enter a requirement (e.g., Catering, Decorations)"
                    class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                  />
                  <button
                    type="button"
                    @click="addRequirement"
                    class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <p v-if="errorMessage.requirements" class="text-red-500">
                  {{ errorMessage.requirements }}
                </p>

                <!-- Display List of Requirements -->
                <ul class="space-y-1">
                  <li
                    v-for="(requirement, index) in eventRequest.requirements"
                    :key="index"
                    class="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                  >
                    <span class="text-gray-700">{{ requirement }}</span>
                    <button
                      type="button"
                      @click="removeRequirement(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <Trash class="w-5 h-5 text-red-600 cursor-pointer" />
                    </button>
                  </li>
                </ul>
              </div>
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
                class="flex-1 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Chat Modal -->
    <div
      v-if="activeChatRequest"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg w-full max-w-2xl h-[80vh] flex flex-col">
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <div class="flex items-center">
            <div class="mr-3">
              <div
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center"
              >
                <i class="i-lucide-users w-5 h-5"></i>
              </div>
            </div>
            <div>
              <h3 class="font-bold">{{ activeChatRequest.eventType }}</h3>
              <div class="flex items-center text-sm text-gray-500">
                <span class="flex items-center mr-2">
                  <span class="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                  Teddy (Event Coordinator)
                </span>
                <span class="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
          <button @click="closeChat" class="text-gray-400 hover:text-gray-500">
            <i class="i-lucide-x w-5 h-5"></i>
          </button>
        </div>

        <!-- Chat Messages -->
        <div class="flex-1 p-4 overflow-y-auto" ref="chatMessagesContainer">
          <div class="space-y-4">
            <!-- System Message -->
            <div class="flex justify-center">
              <div class="bg-gray-100 text-gray-600 text-xs rounded-full px-3 py-1">
                {{ activeChatRequest.dateRequested }}
              </div>
            </div>

            <!-- Welcome Message -->
            <div class="flex justify-center">
              <div
                class="bg-gray-100 text-gray-600 text-sm rounded-lg px-4 py-2 max-w-xs md:max-w-md"
              >
                Your request for event "{{ activeChatRequest.title }}" has been received. Our team
                will assist you with your event planning.
              </div>
            </div>

            <!-- Chat Messages -->
            <div
              v-for="(message, index) in activeChatRequest.messages"
              :key="index"
              class="flex flex-col"
            >
              <div :class="['flex', message.sender === 'user' ? 'justify-end' : 'justify-start']">
                <div class="flex items-end gap-2">
                  <div
                    v-if="message.sender !== 'user'"
                    class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs"
                  >
                    S
                  </div>
                  <div
                    :class="[
                      'rounded-lg px-4 py-2 max-w-xs md:max-w-md',
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ message.text }}
                  </div>
                  <div
                    v-if="message.sender === 'user'"
                    class="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs"
                  >
                    JS
                  </div>
                </div>
              </div>
              <div
                :class="[
                  'text-xs text-gray-400 mt-1',
                  message.sender === 'user' ? 'text-right mr-8' : 'text-left ml-8',
                ]"
              >
                {{ message.time }}
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTeamTyping" class="flex justify-start">
              <div class="flex items-end gap-2">
                <div
                  class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs"
                >
                  S
                </div>
                <div class="bg-gray-100 rounded-lg px-4 py-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style="animation-delay: 0.2s"
                    ></div>
                    <div
                      class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style="animation-delay: 0.4s"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="p-4 border-t border-gray-200">
          <form @submit.prevent="sendMessage" class="flex items-center gap-2">
            <div class="relative flex-1">
              <input
                type="text"
                v-model="newMessage"
                placeholder="Type your message..."
                class="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:ring-primary focus:border-primary"
                @keydown.enter="sendMessage"
              />
              <button
                type="button"
                class="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                <i class="i-lucide-paperclip w-5 h-5"></i>
              </button>
            </div>
            <button
              type="submit"
              class="bg-primary text-white rounded-full p-2 hover:bg-primary-dark transition-colors"
              :disabled="!newMessage.trim()"
            >
              <i class="i-lucide-send w-5 h-5"></i>
            </button>
          </form>

          <!-- Exit Button -->
          <div class="mt-3 text-center">
            <button
              @click="closeChat"
              class="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center mx-auto"
            >
              <i class="i-lucide-x-circle w-4 h-4 mr-1.5"></i>
              Exit Chat
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div
  v-if="showToast"
  v-transition:toast
  :class="[
    'fixed top-4 left-1/2 transform -translate-x-1/2 p-4 rounded shadow-lg flex items-start gap-3 z-50 max-w-md',
    toastType === 'success'
      ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
      : 'bg-red-50 border-l-4 border-red-500 text-red-700',
  ]"
>
  <i
    :class="[
      'w-5 h-5 mt-0.5',
      toastType === 'success' ? 'i-lucide-check-circle' : 'i-lucide-x-circle',
    ]"
  ></i>
  <div>
    <h4 class="font-medium">{{ toastType === 'success' ? 'Success!' : 'Error!' }}</h4>
    <p class="text-sm">{{ toastMessage }}</p>
  </div>
  <button
    @click="showToast = false"
    :class="
      toastType === 'success'
        ? 'text-green-500 hover:text-green-700'
        : 'text-red-500 hover:text-red-700'
    "
  >
    <i class="i-lucide-x w-4 h-4"></i>
  </button>
</div>

    <!--budget payment modal-->
    <div v-if="showCheckoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold">Checkout</h3>
          <button @click="closeCheckoutModal" class="text-gray-400 hover:text-gray-500">
            <i class="i-lucide-x w-5 h-5"></i>
          </button>
        </div>
        <p class="mb-4">Please confirm your payment details below:</p>
        <div class="mb-4">
          <label class="hidden text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" v-model="paymentDetails.first_name" placeholder="Enter your phone number" disabled class="w-full hidden border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary" />
        </div>
        <div class="mb-4">
          <label class="hidden text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" v-model="paymentDetails.last_name" placeholder="Enter your phone number" disabled class="w-full hidden border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary" />
        </div>
        <div class="mb-4">
          <label class="hidden text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="text" v-model="paymentDetails.email" placeholder="Enter your phone number" disabled class="hidden w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input type="text" v-model="paymentDetails.phoneNumber" placeholder="Enter your phone number" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary" />
        </div>
        <div class="flex gap-3">
          <button @click="closeCheckoutModal" class="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="processPayment" class="flex-1 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
