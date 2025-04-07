<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const eventForm = ref({
  title: '',
  type: '',
  startDate: '',
  startTime: '',
  location: '',
  description: '',
  capacity: '',
  price: '',
  image: null,
});

const errors = ref({
  titleError: '',
  typeError: '',
  startDateError: '',
  startTimeError: '',
  locationError: '',
  descriptionError: '',
  capacityError: '',
  priceError: '',
  imageError: '',
});

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    eventForm.value.image = file; // Store the file for API submission
    eventForm.value.imagePreview = URL.createObjectURL(file); // Preview the image
  }
};

const validateForm = () => {
  errors.value = {}; // Reset errors

  if (!eventForm.value.title) {
    errors.value.titleError = 'Event title is required.';
  }
  if (!eventForm.value.type) {
    errors.value.typeError = 'Event type is required.';
  }
  if (!eventForm.value.startDate) {
    errors.value.startDateError = 'Start date is required.';
  }
  if (!eventForm.value.startTime) {
    errors.value.startTimeError = 'Start time is required.';
  }
  if (!eventForm.value.location) {
    errors.value.locationError = 'Location is required.';
  }
  if (!eventForm.value.description) {
    errors.value.descriptionError = 'Description is required.';
  }
  if (!eventForm.value.capacity || isNaN(eventForm.value.capacity) || eventForm.value.capacity <= 0) {
    errors.value.capacityError = 'Capacity must be a positive number.';
  }
  if (!eventForm.value.price || isNaN(eventForm.value.price) || eventForm.value.price < 0) {
    errors.value.priceError = 'Price must be a non-negative number.';
  }
  if (!eventForm.value.image) {
    errors.value.imageError = 'Event image is required.';
  }

  return Object.keys(errors.value).length === 0; // Return true if no errors
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const formData = new FormData();
    formData.append('title', eventForm.value.title);
    formData.append('category', eventForm.value.type);
    formData.append('date', eventForm.value.startDate);
    formData.append('time', eventForm.value.startTime);
    formData.append('location', eventForm.value.location);
    formData.append('description', eventForm.value.description);
    formData.append('attendees', parseInt(eventForm.value.capacity, 10));
    formData.append('price', parseFloat(eventForm.value.price));
    formData.append('image', eventForm.value.image);

    const response = await axios.post('http://localhost:8000/api/events/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log('Event created successfully:', response.data);

    // Redirect to My Events page after successful creation
    router.push('/organizerView/events');
  } catch (error) {
    if (error.response) {
      console.error('Error creating event:', error.response.data);
    } else {
      console.error('Error creating event:', error.message);
    }
  }
};
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

      <form @submit.prevent="handleSubmit" enctype="multipart/form-data" class="p-6 space-y-6">
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
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter event title"
              />
              <p v-if="errors.titleError" class="text-red-500">{{ errors.titleError }}</p>
            </div>

            <!-- Event Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Event Type</label>
              <select
                id="type"
                v-model="eventForm.type"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="concert">Concert</option>
                <option value="exhibition">Exhibition</option>
              </select>
              <p v-if="errors.typeError" class="text-red-500">{{ errors.typeError }}</p>
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
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <p v-if="errors.startDateError" class="text-red-500">{{ errors.startDateError }}</p>
            </div>
            <div>
              <label for="startTime" class="block text-sm font-medium text-gray-700">Start Time</label>
              <input
                id="startTime"
                v-model="eventForm.startTime"
                type="time"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
              <p v-if="errors.startTimeError" class="text-red-500">{{ errors.startTimeError }}</p>
            </div>
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
            <input
              id="location"
              v-model="eventForm.location"
              type="text"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter event location"
            />
            <p v-if="errors.locationError" class="text-red-500">{{ errors.locationError }}</p>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="eventForm.description"
              rows="4"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe your event"
            ></textarea>
            <p v-if="errors.descriptionError" class="text-red-500">{{ errors.descriptionError }}</p>
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
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter maximum capacity"
              />
              <p v-if="errors.capacityError" class="text-red-500">{{ errors.capacityError }}</p>
            </div>
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Ticket Price ($)</label>
              <input
                id="price"
                v-model="eventForm.price"
                type="number"
                min="0"
                step="0.01"
                class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter ticket price"
              />
              <p v-if="errors.priceError" class="text-red-500">{{ errors.priceError }}</p>
            </div>
          </div>
        </div>

        <!-- Event Image -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Event Image</h3>
          <div class="flex items-center space-x-6">
            <div class="shrink-0">
              <img
                :src="eventForm.imagePreview || '/placeholder.svg?height=150&width=150'"
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
          <p v-if="errors.imageError" class="text-red-500">{{ errors.imageError }}</p>
        </div>

        <!-- Submit Buttons -->
        <div class="border-t border-gray-200 pt-6 flex justify-end space-x-4">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
