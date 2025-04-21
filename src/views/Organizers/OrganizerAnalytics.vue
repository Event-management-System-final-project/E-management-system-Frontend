<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Organizer Analytics</h1>
      <p class="text-gray-500 mt-1">Track and analyze your event performance</p>
    </div>

    <!-- Analytics Overview -->
    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Events -->
      <div class="bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-medium">Total Events</h3>
        <p class="text-3xl font-bold mt-2">{{ analytics.totalEvents }}</p>
      </div>

      <!-- Total Registrations -->
      <div class="bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-medium">Total Registrations</h3>
        <p class="text-3xl font-bold mt-2">{{ analytics.totalRegistrations }}</p>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-medium">Total Revenue</h3>
        <p class="text-3xl font-bold mt-2">${{ analytics.totalRevenue.toFixed(2) }}</p>
      </div>

      <!-- Average Revenue per Event -->
      <div class="bg-white text-gray-800 p-6 rounded-lg shadow-md border border-gray-200">
        <h3 class="text-lg font-medium">Average Revenue per Event</h3>
        <p class="text-3xl font-bold mt-2">${{ analytics.averageRevenuePerEvent.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Event Performance Table -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Event Performance</h3>
      <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6 text-left">Event</th>
            <th class="py-3 px-6 text-left">Registrations</th>
            <th class="py-3 px-6 text-left">Revenue</th>
            <th class="py-3 px-6 text-left">Completion Rate</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr
            v-for="event in analytics.events"
            :key="event.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="py-3 px-6 text-left whitespace-nowrap">
              <span class="font-medium">{{ event.title }}</span>
            </td>
            <td class="py-3 px-6 text-left">{{ event.registrations }}</td>
            <td class="py-3 px-6 text-left">${{ event.revenue.toFixed(2) }}</td>
            <td class="py-3 px-6 text-left">{{ event.completionRate }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Revenue Over Time Chart -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Revenue Over Time</h3>
      <canvas id="revenueChart" width="400" height="200"></canvas>
    </div>

    <!-- Registrations Over Time Chart -->
    <div class="mt-8 bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Registrations Over Time</h3>
      <canvas id="registrationsChart" width="400" height="200"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const analytics = ref({
  totalEvents: 0,
  totalRegistrations: 0,
  totalRevenue: 0,
  averageRevenuePerEvent: 0,
  events: [],
});

const revenueChart = ref(null);
const registrationsChart = ref(null);

const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8000/api/organizer/analytics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    analytics.value = response.data;
    createCharts();
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};

const createCharts = () => {
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  const registrationsCtx = document.getElementById('registrationsChart').getContext('2d');

  revenueChart.value = new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: analytics.value.events.map((event) => event.title),
      datasets: [
        {
          label: 'Revenue Over Time',
          data: analytics.value.events.map((event) => event.revenue),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  registrationsChart.value = new Chart(registrationsCtx, {
    type: 'line',
    data: {
      labels: analytics.value.events.map((event) => event.title),
      datasets: [
        {
          label: 'Registrations Over Time',
          data: analytics.value.events.map((event) => event.registrations),
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

onMounted(() => {
  fetchAnalytics();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.bg-white {
  background-color: #ffffff;
}
.text-gray-900 {
  color: #1a202c;
}
.text-gray-500 {
  color: #718096;
}
.text-gray-600 {
  color: #4a5568;
}
.text-gray-800 {
  color: #2d3748;
}
.text-lg {
  font-size: 1.125rem;
}
.text-3xl {
  font-size: 1.875rem;
}
.font-medium {
  font-weight: 500;
}
.font-bold {
  font-weight: 700;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.border {
  border-width: 1px;
}
.border-gray-200 {
  border-color: #e2e8f0;
}
.grid {
  display: grid;
}
.grid-cols-1 {
  grid-template-columns: 1fr;
}
.md\:grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.lg\:grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.gap-6 {
  gap: 1.5rem;
}
.min-w-full {
  min-width: 100%;
}
.uppercase {
  text-transform: uppercase;
}
.leading-normal {
  line-height: 1.5;
}
.text-left {
  text-align: left;
}
.whitespace-nowrap {
  white-space: nowrap;
}
</style>