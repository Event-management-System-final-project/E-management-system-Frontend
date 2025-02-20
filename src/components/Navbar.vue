<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
    <nav class="container mx-auto px-4 flex h-16 items-center justify-between">
      <!-- Logo -->
      <div>
        <RouterLink to="/" class="px-2 py-2 text-sm sm:text-xl font-medium text-gray-600"
          >Poly Events</RouterLink
        >
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="lg:hidden">
        <button
          @click="isOpen = !isOpen"
          class="text-gray-600 hover:text-blue-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden lg:flex space-x-6">
        <ul class="flex space-x-6">
          <li>
            <RouterLink
              to="/"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/about"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >About Us</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/contact"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Contact Us</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/login"
              class="px-2 py-2 text-sm sm:text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Login</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/signup"
              class="px-2 py-2 text-sm sm:text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >Signup</RouterLink
            >
          </li>
        </ul>
      </div>

      <!-- Mobile Menu (Toggle Visibility) -->
      <div
        v-if="isOpen"
        class="lg:hidden absolute top-16 left-0 w-full bg-white border-b shadow-md"
      >
        <ul class="space-y-4 py-4 text-center">
          <li>
            <RouterLink
              to="/"
              class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/about"
              class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >About Us</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/contact"
              class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Contact Us</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/login"
              class="block px-4 py-2 text-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Login</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/signup"
              class="block px-4 py-2 text-lg font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >Signup</RouterLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
