<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-500 mt-1">Manage platform settings and configurations</p>
      </div>
    </div>
    
    <!-- Placeholder content -->
    <div class="bg-white rounded-lg shadow p-12 text-center">
      <div class="flex flex-col items-center">
        <Settings class="h-16 w-16 text-gray-400 mb-4" />
        <p class="text-lg font-medium mb-1">Settings</p>
        <p class="text-sm text-gray-500 mb-4">This feature is coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Settings } from 'lucide-vue-next';
</script>

