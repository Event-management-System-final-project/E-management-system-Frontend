<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  const router = useRouter()
  
  const eventForm = ref({
    title: '',
    type: '',
    startDate: '',
    startTime: '',
    location: '',
    description: '',
    capacity: '',
    price: '',
    image: null
  })
  
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      eventForm.value.image = URL.createObjectURL(file)
    }
  }
  
  const handleSubmit = async () => {
    try {
      // Add your API call here to create the event
      const eventData = {
        title: eventForm.value.title,
        type: eventForm.value.type,
        startDate: eventForm.value.startDate,
        startTime: eventForm.value.startTime,
        location: eventForm.value.location,
        description: eventForm.value.description,
        capacity: eventForm.value.capacity,
        price:eventForm.value.price,
        image:eventForm.value.image,
      }
       await axios.post('http://localhost:8000/api/events', eventData)
  
      console.log('Form submitted:', eventForm.value)
      // Redirect to My Events page after successful creation
      router.push('/organizer/events')
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }
  
  const saveDraft = () => {
    // Add logic to save as draft
    console.log('Saved as draft:', eventForm.value)
  }
  </script>


<template>
    <div>
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p class="text-gray-600">Fill in the details below to create your event.</p>
      </div>
  
      <div class="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Event Details</h2>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Basic Information -->
          <div class="space-y-6">
            <div class="grid gap-6 md:grid-cols-2">
              <!-- Event Title -->
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  id="title"
                  v-model="eventForm.title"
                  type="text"
                  required
                  class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter event title"
                />
              </div>
  
              <!-- Event Type -->
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  id="type"
                  v-model="eventForm.type"
                  required
                  class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="concert">Concert</option>
                  <option value="exhibition">Exhibition</option>
                </select>
              </div>
            </div>
  
            <!-- Date and Time -->
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  id="startDate"
                  v-model="eventForm.startDate"
                  type="date"
                  required
                  class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label for="startTime" class="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  id="startTime"
                  v-model="eventForm.startTime"
                  type="time"
                  required
                  class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
  
            <!-- Location -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
              <input
                id="location"
                v-model="eventForm.location"
                type="text"
                required
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter event location"
              />
            </div>
  
            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="eventForm.description"
                rows="4"
                required
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Describe your event"
              ></textarea>
            </div>
          </div>
  
          <!-- Ticket Information -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Ticket Information</h3>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity</label>
                <input
                  id="capacity"
                  v-model="eventForm.capacity"
                  type="number"
                  min="1"
                  required
                  class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter maximum capacity"
                />
              </div>
              <div>
                <label for="price" class="block text-sm font-medium text-gray-700">Ticket Price ($)</label>
                <input
                  id="price"
                  v-model="eventForm.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter ticket price"
                />
              </div>
            </div>
          </div>
  
          <!-- Event Image -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Event Image</h3>
            <div class="flex items-center space-x-6">
              <div class="shrink-0">
                <img
                  :src="eventForm.image || '/placeholder.svg?height=150&width=150'"
                  alt="Event preview"
                  class="h-32 w-32 object-cover rounded-lg"
                />
              </div>
              <label class="block">
                <span class="sr-only">Choose event image</span>
                <input
                  type="file"
                  @change="handleImageChange"
                  accept="image/*"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            </div>
          </div>
  
          <!-- Submit Buttons -->
          <div class="border-t border-gray-200 pt-6 flex justify-end space-x-4">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="saveDraft"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  
  
  