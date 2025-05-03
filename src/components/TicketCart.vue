<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div v-if="cart.length > 0" class="space-y-4">
        <div
          v-for="(item, index) in cart"
          :key="item.id"
          class="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4"
        >
          <div class="md:w-1/4 h-32 md:h-auto bg-gray-200 rounded overflow-hidden">
            <img
              :src="item.event.media_url"
              :alt="item.event.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-2">{{ item.event.title }}</h3>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
              Date: {{ item.event.date }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
              Location: {{ item.event.location }}
            </div>
           
          </div>
          <div class="md:w-1/6 flex flex-col justify-between items-end">
            <div class="text-right">
              <span class="text-xs text-gray-500">Total Price</span>
              <p class="font-bold text-primary">ETB {{ item.event.price }}</p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="removeFromCart(item.event.id)"
                class="text-red-600 hover:text-red-800 mr-5 font-medium text-sm flex items-center"
              >
                <i class="i-lucide-trash-2 w-4 h-4 mr-1"></i>
                Remove
              </button>
              <button
                @click="openCheckoutModal(item.event)"
                class="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
              >
              Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <i class="i-lucide-shopping-cart w-12 h-12 mx-auto text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
        <p class="text-gray-500">Browse events and add tickets to your cart.</p>

        <div class="mt-8">
          <router-link
            to="/userview"
            class="mt-4 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Events
          </router-link>
        </div>
      </div>
    </div>

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
             Date: {{ selectedEvent.date }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mt-1">
              <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
              Location: {{ selectedEvent.location }}
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ticket Type</label>
            <select
              v-model="ticketType"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
            >
              <option value="standard">Standard - ETB {{ selectedEvent.price }}</option>
              <option value="vip">VIP - ETB {{ selectedEvent.price * 2 }}</option>
              <option value="premium">Premium - ETB {{ selectedEvent.price * 3 }}</option>
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
              <span>ETB {{ getTicketPrice() }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Quantity</span>
              <span>{{ ticketQuantity }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Subtotal</span>
              <span>ETB {{ getTicketPrice() * ticketQuantity }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Service fee</span>
              <span>ETB {{ (getTicketPrice() * ticketQuantity * 0.1).toFixed(2) }}</span>
            </div>
            <div class="border-t border-gray-200 my-2"></div>
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span
                >ETB {{
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Minus,MinusIcon,Plus } from 'lucide-vue-next'
const cart = ref([])
const token = localStorage.getItem('token')
const selectedEvent = ref(null)
const ticketType = ref('standard')
const ticketQuantity = ref(1)

// Fetching cart items from the API
const fetchCart = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/user/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    cart.value = response.data.cart_items
    console.log('Cart items:', cart.value)
  } catch (error) {
    console.error('Error fetching cart:', error)
  }
}

onMounted(() => {
  fetchCart()
})

// Function to remove an item from the cart
const removeFromCart = async (eventId) => {
  const event_id = eventId
  console.log('token:', token)
  console.log('Removing item with ID:', event_id)
  try {
    const response = await axios.delete(
      'http://localhost:8000/api/user/cart/remove',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: { event_id }, // Pass data here
      }
    )
    console.log('Item removed:', response.data)
    // Update the cart locally by filtering out the removed item
    cart.value = cart.value.filter(item => item.event.id !== eventId)
  } catch (error) {
    console.error('Error removing item from cart:', error)
  }
}

// Function to open the checkout modal
const openCheckoutModal = (event) => {
  selectedEvent.value = event
  ticketType.value = 'standard'
  ticketQuantity.value = 1
}

// Function to get the ticket price based on the selected ticket type
const getTicketPrice = () => {
  if (ticketType.value === 'standard') {
    return selectedEvent.value.price
  } else if (ticketType.value === 'vip') {
    return selectedEvent.value.price * 2
  } else if (ticketType.value === 'premium') {
    return selectedEvent.value.price * 3
  }
  return 0
}

// Function to handle the purchase ticket action
const purchaseTicket = () => {
  // Implement your purchase logic here
  console.log('Purchasing ticket:', {
    event: selectedEvent.value,
    ticketType: ticketType.value,
    ticketQuantity: ticketQuantity.value,
    totalPrice: getTicketPrice() * ticketQuantity.value + getTicketPrice() * ticketQuantity.value * 0.1
  })
  selectedEvent.value = null
}
</script>
