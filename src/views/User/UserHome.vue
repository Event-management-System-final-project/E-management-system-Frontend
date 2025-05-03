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
                <span class="text-sm md:text-base">{{ (event.date, event.time) }}</span>
              </div>
              <h3 class="font-bold text-lg mb-2">{{ event.title }}</h3>
              <div class="flex items-center">
                <MapPin class="h-5 w-5 mr-2 text-red-600" />
                <span class="text-sm md:text-base">{{ event.location }}</span>
              </div>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ event.description }}</p>
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
                    :to="`/event-details/${event.id}`"
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
              <div class="flex items-center gap-2">
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
                <button
                  v-if="request.hasUnreadMessages"
                  @click="openChat(request)"
                  class="relative bg-primary text-white px-2 py-1 rounded-full text-xs font-medium flex items-center"
                >
                  <i class="i-lucide-message-circle w-3.5 h-3.5 mr-1"></i>
                  New Messages
                  <span
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {{ request.unreadCount }}
                  </span>
                </button>
              </div>
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
                @click="openChat(request)"
                class="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
              >
                <i class="i-lucide-message-circle w-4 h-4 mr-1"></i>
                Chat with Team
              </button>
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
    </main>

    <!-- Buy Ticket Modal -->
    <!-- <div
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
                <Minus class="w-4 h-4" />
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
                <Plus class="w-4 h-4" />
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
              class="flex-1 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div> -->

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
                placeholder="Location of the event"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                v-model="eventRequest.budget"
                placeholder="Your Budget"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
              <textarea
                v-model="eventRequest.description"
                rows="4"
                placeholder="Please provide some description about your event..."
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                required
              ></textarea>
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
                Your request for "{{ activeChatRequest.eventType }}" has been received. Our team
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
    'fixed top-4 left-1-2 transform-center p-4 rounded shadow-lg flex items-start gap-3 z-50 max-w-md',
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
      <button @click="showToast = false" :class="toastType === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'">
        <i class="i-lucide-x w-4 h-4"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { Minus, Plus, Calendar, Trash, MapPin } from 'lucide-vue-next'
import axios from 'axios'

// State
const activeTab = ref('events')
const searchQuery = ref('')
const selectedEvent = ref(null)
const ticketType = ref('standard')
const ticketQuantity = ref(1)
const showRequestForm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' or 'error'
const newRequirement = ref('')
const eventRequest = ref({
  type: '',
  date: '',
  guests: '',
  location: '',
  budget: '',
  description: '',
  requirements: [],
})

// Cart state (shared with Cart.vue via localStorage)

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
    hasUnreadMessages: true,
    unreadCount: 2,
    messages: [
      {
        sender: 'team',
        text: "Hi there! I'm Sarah, your dedicated event coordinator. I've reviewed your request for a corporate team building event. Could you tell me more about your team's interests and any specific activities you had in mind?",
        time: 'April 11, 2023 • 10:23 AM',
      },
      {
        sender: 'user',
        text: "Hi Sarah! We're a tech company with about 50 employees. We're looking for a mix of outdoor activities and problem-solving challenges.",
        time: 'April 11, 2023 • 11:45 AM',
      },
      {
        sender: 'team',
        text: 'That sounds great! We have several options that would work well for your team. We could organize a scavenger hunt combined with team challenges, or perhaps an adventure course with collaborative problem-solving stations.',
        time: 'April 11, 2023 • 2:15 PM',
      },
      {
        sender: 'team',
        text: 'Would you prefer a full-day event or half-day? And do you have any budget constraints we should be aware of?',
        time: 'April 12, 2023 • 9:30 AM',
      },
    ],
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
    hasUnreadMessages: true,
    unreadCount: 1,
    messages: [
      {
        sender: 'team',
        text: "Hello! I'm Miguel, and I'll be helping you plan this 90s themed birthday party. I love the theme idea! I've already started gathering some decoration and entertainment options for you.",
        time: 'March 6, 2023 • 1:05 PM',
      },
      {
        sender: 'user',
        text: "Thanks Miguel! I'm excited to see what you come up with. The birthday person loves 90s music and TV shows.",
        time: 'March 6, 2023 • 3:30 PM',
      },
      {
        sender: 'team',
        text: "Perfect! I'm thinking we could have a DJ with 90s hits, some iconic TV show decorations, and maybe even hire actors to dress as famous 90s characters for photo ops. How does that sound?",
        time: 'March 7, 2023 • 10:15 AM',
      },
      {
        sender: 'user',
        text: 'That sounds amazing! Especially the character actors. Can we also have some 90s-themed food and drinks?',
        time: 'March 7, 2023 • 11:42 AM',
      },
      {
        sender: 'team',
        text: "We can create a menu with popular 90s snacks and drinks. Think Capri Sun, Surge, Dunkaroos, and other nostalgic treats. We can also have a main course that's more substantial but with 90s-inspired presentation.",
        time: 'March 7, 2023 • 2:20 PM',
      },
      {
        sender: 'team',
        text: "I've put together a preliminary proposal with all these ideas and some venue options. Would you like me to send it over for your review?",
        time: 'Yesterday • 4:15 PM',
      },
    ],
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

// const getTicketPrice = () => {
//   if (!selectedEvent.value) return 0
//   const basePrice = selectedEvent.value.price
//   if (ticketType.value === 'standard') return basePrice
//   if (ticketType.value === 'vip') return basePrice * 2
//   if (ticketType.value === 'premium') return basePrice * 3
//   return basePrice
// }

// const confirmAddToCart = () => {
//   if (!selectedEvent.value) return

//   // Calculate total price with service fee
//   const price = getTicketPrice()
//   const subtotal = price * ticketQuantity.value
//   const serviceFee = subtotal * 0.1
//   const totalPrice = subtotal + serviceFee

//   // Create cart item
//   const cartItem = {
//     id: 'T' + Math.floor(Math.random() * 100000),
//     event: {
//       title: selectedEvent.value.title,
//       date: selectedEvent.value.date,
//       location: selectedEvent.value.location,
//       image: selectedEvent.value.media_url,
//     },
//     type: ticketType.value.charAt(0).toUpperCase() + ticketType.value.slice(1),
//     quantity: ticketQuantity.value,
//     totalPrice: totalPrice.toFixed(2),
//   }

//   // Add to cart and update localStorage
//   cart.value.push(cartItem)
//   localStorage.setItem('cart', JSON.stringify(cart.value))

//   // Show success message and close modal
//   showToast.value = true
//   toastMessage.value = `Added ${ticketQuantity.value} ${ticketType.value} ticket(s) to cart!`
//   selectedEvent.value = null

//   // Reset ticket selection
//   ticketType.value = 'standard'
//   ticketQuantity.value = 1
// }

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

const submitEventRequest = async () => {
  try {
    // Send request to backend
    const response = await axios.post('http://localhost:8000/api/event-requests', {
      event_type: eventRequest.value.type,
      preferred_date: eventRequest.value.date,
      expected_guests: eventRequest.value.guests,
      location: eventRequest.value.location,
      budget: eventRequest.value.budget,
      description: eventRequest.value.description,
      requirements: eventRequest.value.requirements,
    })

    // Add to myRequests
    myRequests.value.push({
      id: response.data.request.id,
      eventType: eventRequest.value.type,
      status: 'Pending',
      dateRequested: new Date().toLocaleDateString(),
      preferredDate: eventRequest.value.date,
      expectedGuests: eventRequest.value.guests,
      description: eventRequest.value.description,
      hasUnreadMessages: false,
      unreadCount: 0,
      messages: [],
    })

    // Reset form and show success
    eventRequest.value = {
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

const openChat = (request) => {
  activeChatRequest.value = request
  const requestIndex = myRequests.value.findIndex((req) => req.id === request.id)
  if (requestIndex !== -1) {
    myRequests.value[requestIndex].hasUnreadMessages = false
    myRequests.value[requestIndex].unreadCount = 0
  }
  nextTick(() => {
    if (chatMessagesContainer.value) {
      chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
    }
  })
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
    const response = await axios.get('http://localhost:8000/api/events')
    events.value = response.data.events || []
  } catch (error) {
    console.error('Error fetching events:', error)
    showToastMessage('Failed to load events. Please try again.', 'error')
  }
}

onMounted(() => {
  fetchEvents()
  setTimeout(() => {
    const requestIndex = Math.floor(Math.random() * myRequests.value.length)
    myRequests.value[requestIndex].hasUnreadMessages = true
    myRequests.value[requestIndex].unreadCount =
      (myRequests.value[requestIndex].unreadCount || 0) + 1
    myRequests.value[requestIndex].messages.push({
      sender: 'team',
      text: 'Hi there! I have some updates regarding your event request. Could we schedule a quick call to discuss the details?',
      time: 'Just now',
    })
  }, 60000)
})

// Methods to add to cart
const addToCart = async (eventId) => {
  const event_id = eventId;
  console.log('Event ID:', event_id);

  try {
    const response = await axios.post(
      'http://localhost:8000/api/user/cart/add',
      { event_id },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    console.log('Added to cart:', response.data);
    showToastMessage('Event added to cart successfully!', 'success');
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.error('Conflict error:', error.response.data.message);
      showToastMessage(error.response.data.message || 'Event is already in the cart.', 'error');
    } else {
      console.error('Error adding to cart:', error);
      showToastMessage('Failed to add to cart. Please try again.', 'error');
    }
  }
};

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
</script>
<style scoped>
:root {
  --color-primary: #6366f1;
  --color-primary-dark: #4f46e5;
}

/* Color utilities */
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
.focus-ring-primary:focus {
  --tw-ring-color: var(--color-primary); /* For Tailwind ring compatibility */
  outline: none; /* Prevent default focus outline */
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3); /* Mimic Tailwind ring */
}
.focus-border-primary:focus {
  border-color: var(--color-primary);
  outline: none;
}
.hover-bg-primary-dark:hover {
  background-color: var(--color-primary-dark);
}

/* Bounce animation for typing indicator */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
.animate-bounce {
  animation: bounce 1s infinite;
}

/* Positioning utilities */
.fixed {
  position: fixed;
}
.top-4 {
  top: 1rem;
}
.left-1-2 {
  left: 50%;
}
.transform-center {
  transform: translateX(-50%);
}
.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.rounded {
  border-radius: 0.375rem;
}
.z-50 {
  z-index: 50;
}
</style>
