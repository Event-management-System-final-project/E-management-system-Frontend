<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <header class="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
    <nav class="container mx-auto px-4 flex h-16 items-center justify-between">
      <div>
        <RouterLink to="/" class="px-2 py-2 text-sm text-xl font-medium text-gray-600"
          >Poly Events</RouterLink
        >
      </div>
      <div>
        <ul class="flex space-x-6">
          <li>
            <RouterLink
              to="/"
              class="px-2 py-2 text-sm text-xl font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Home</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/about"
              class="px-2 py-2 text-sm text-xl font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >About Us</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/contact"
              class="px-2 py-2 text-sm text-xl font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Contact Us</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/login"
              class="px-2 py-2 text-sm text-xl font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >Login</RouterLink
            >
          </li>
          <li>
            <RouterLink
              to="/signup"
              class="px-2 py-2 text-sm text-xl font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >Signup</RouterLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
