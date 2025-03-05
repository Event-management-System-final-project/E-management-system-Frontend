<script setup>
import { Calendar, Lock } from 'lucide-vue-next'
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo -->
        <div class="flex justify-center">
          <div class="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
            <Calendar class="h-6 w-6 text-white" />
          </div>
        </div>
        
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Create a new password for your account
        </p>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <!-- Form -->
          <form class="space-y-6">
            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                New password
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                 
                </div>
              </div>
            </div>
  
            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  required
                  class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  
                </div>
              </div>
            </div>
  
            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset password
              </button>
            </div>
          </form>
  
          <!-- Back to login -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Remember your password?
                </span>
              </div>
            </div>
  
            <div class="mt-6 text-center">
              <a 
                href="#" 
                class="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
 