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
              :src="item.event.image"
              :alt="item.event.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-lg mb-2">{{ item.event.title }}</h3>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="i-lucide-calendar w-4 h-4 mr-1"></i>
              {{ item.event.date }}
            </div>
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <i class="i-lucide-map-pin w-4 h-4 mr-1"></i>
              {{ item.event.location }}
            </div>
            <div class="flex flex-wrap gap-4 mt-2">
              <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                <span class="text-xs text-gray-500">Ticket Type</span>
                <p class="font-medium">{{ item.type }}</p>
              </div>
              <div class="bg-gray-100 px-3 py-1.5 rounded-md">
                <span class="text-xs text-gray-500">Quantity</span>
                <p class="font-medium">{{ item.quantity }}</p>
              </div>
            </div>
          </div>
          <div class="md:w-1/6 flex flex-col justify-between items-end">
            <div class="text-right">
              <span class="text-xs text-gray-500">Total Price</span>
              <p class="font-bold text-primary">ETB {{ item.totalPrice }}</p>
            </div>
            <button
              @click="removeFromCart(index)"
              class="text-red-600 hover:text-red-800 font-medium text-sm flex items-center"
            >
              <i class="i-lucide-trash-2 w-4 h-4 mr-1"></i>
              Remove
            </button>
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

      <!-- Checkout Button -->
      <div v-if="cart.length > 0" class="mt-6 text-right">
        <button
          @click="checkout"
          class="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Cart state (shared across components)
const cart = ref(JSON.parse(localStorage.getItem('cart')) || [])

// Remove an item from the cart
const removeFromCart = (index) => {
  cart.value.splice(index, 1)
  localStorage.setItem('cart', JSON.stringify(cart.value)) // Update localStorage
}

// Checkout function
const checkout = () => {
  alert('Checkout successful!') // Replace with actual checkout logic
  cart.value = [] // Clear the cart
  localStorage.setItem('cart', JSON.stringify(cart.value)) // Update localStorage
}
</script>
