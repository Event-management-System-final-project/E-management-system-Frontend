<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <svg
            class="h-6 w-6 text-blue-600 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1 class="text-xl font-semibold text-gray-800">TaskFlow</h1>
        </div>
        <div class="flex items-center">
          <div class="mr-4 text-right">
            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
            <div class="text-xs text-gray-500">{{ user.email }}</div>
          </div>
          <img
            :src="user.avatar || '/placeholder.svg?height=40&width=40'"
            :alt="user.name"
            class="h-10 w-10 rounded-full"
          />
          <button class="ml-4 flex items-center text-sm text-gray-600 hover:text-gray-900">
            <LogOut class="h-4 w-4 mr-1" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800">Welcome back, {{ user.name }}</h2>
        <p class="text-gray-600">Here are all your assigned tasks across various events.</p>
      </div>

      <!-- Pending Tasks -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="task in pendingTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div class="p-4 pb-2 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Calendar
                    class="w-5 h-5 mr-2"
                    :class="{
                      'text-yellow-500': task.category === 'Product Launch',
                      'text-blue-500': task.category === 'Annual Conference',
                      'text-green-500': task.category === 'Team Building',
                    }"
                  />
                  <span class="text-sm font-medium">{{ task.category }}</span>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-blue-100 text-blue-800': task.priority === 'low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="mb-1">
                <span
                  class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full mb-2"
                >
                  pending
                </span>
              </div>
              <h4 class="text-base font-medium mb-2">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <Clock class="h-4 w-4 mr-1" />
                  <span>Due: {{ task.dueDate }}</span>
                </div>
                <button class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View details
                  <ArrowRight class="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- In Progress -->
      <section class="mb-10">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">In Progress</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="task in inProgressTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div class="p-4 pb-2 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Calendar
                    class="w-5 h-5 mr-2"
                    :class="{
                      'text-yellow-500': task.category === 'Product Launch',
                      'text-blue-500': task.category === 'Annual Conference',
                      'text-green-500': task.category === 'Team Building',
                    }"
                  />
                  <span class="text-sm font-medium">{{ task.category }}</span>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-blue-100 text-blue-800': task.priority === 'low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="mb-1">
                <span
                  class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mb-2"
                >
                  in progress
                </span>
              </div>
              <h4 class="text-base font-medium mb-2">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <Clock class="h-4 w-4 mr-1" />
                  <span>Due: {{ task.dueDate }}</span>
                </div>
                <button class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View details
                  <ArrowRight class="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Completed -->
      <section>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Completed</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="task in completedTasks"
            :key="task.id"
            class="bg-white rounded-lg shadow overflow-hidden border border-gray-200"
          >
            <div class="p-4 pb-2 border-b border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <Calendar
                    class="w-5 h-5 mr-2"
                    :class="{
                      'text-yellow-500': task.category === 'Product Launch',
                      'text-blue-500': task.category === 'Annual Conference',
                      'text-green-500': task.category === 'Team Building',
                    }"
                  />
                  <span class="text-sm font-medium">{{ task.category }}</span>
                </div>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="{
                    'bg-red-100 text-red-800': task.priority === 'high',
                    'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                    'bg-blue-100 text-blue-800': task.priority === 'low',
                  }"
                >
                  {{ task.priority }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <div class="mb-1">
                <span
                  class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mb-2"
                >
                  completed
                </span>
              </div>
              <h4 class="text-base font-medium mb-2">{{ task.title }}</h4>
              <p class="text-sm text-gray-600 mb-4">{{ task.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                  <CheckCircle class="h-4 w-4 mr-1" />
                  <span>Completed</span>
                </div>
                <button class="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View details
                  <ArrowRight class="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Calendar, CheckCircle, Clock, ArrowRight, LogOut } from 'lucide-vue-next'

// User data
const user = ref({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder.svg?height=40&width=40',
})

// Task data
const pendingTasks = ref([
  {
    id: 1,
    title: 'Prepare demonstration setup',
    description: 'Set up product demo stations with all necessary equipment and materials',
    dueDate: 'Jul 8, 2025',
    priority: 'high',
    category: 'Product Launch',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Update website with event details',
    description:
      'Add all event information, schedule, and registration forms to the company website',
    dueDate: 'May 30, 2025',
    priority: 'low',
    category: 'Annual Conference',
    status: 'pending',
  },
])

const inProgressTasks = ref([
  {
    id: 3,
    title: 'Prepare presentation slides',
    description:
      'Create slide deck for the keynote presentation covering the new features and roadmap',
    dueDate: 'Jun 10, 2025',
    priority: 'high',
    category: 'Annual Conference',
    status: 'in progress',
  },
])

const completedTasks = ref([
  {
    id: 4,
    title: 'Prepare team building activities',
    description: 'Organize team building exercises and activities for the quarterly retreat',
    dueDate: 'Jun 1, 2025',
    priority: 'medium',
    category: 'Team Building',
    status: 'completed',
  },
])
</script>

<style>
/* You can add any additional custom styles here if needed */
</style>
