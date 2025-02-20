<script setup></script>

<template>
  <section class="relative overflow-hidden bg-white">
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"
    ></div>

    <div class="container mx-auto px-4">
      <div class="relative pt-20 pb-24 md:pt-32 md:pb-32">
        <!-- Main Content -->
        <div class="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <!-- Left Column -->
          <div class="max-w-2xl">
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900"
            >
              Create Unforgettable
              <span class="text-blue-600">Events</span>
              With Ease
            </h1>
            <p class="mt-6 text-base sm:text-lg md:text-xl leading-8 text-gray-600">
              Your all-in-one platform for planning, managing, and hosting successful events. From
              registration to ticketing, we've got everything you need to make your event a success.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                class="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 inline-flex items-center justify-center"
              >
                Create Event
                <CalendarPlus class="ml-2 h-4 w-4" />
              </button>
              <button
                class="w-full sm:w-auto rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-all hover:bg-blue-50 border-2 border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 inline-flex items-center justify-center"
              >
                Browse Events
                <Search class="ml-2 h-4 w-4" />
              </button>
            </div>
            <!-- Stats -->
            <dl class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div class="flex flex-col">
                <dt class="text-sm font-medium leading-6 text-gray-600">Events Hosted</dt>
                <dd class="text-2xl font-bold leading-10 tracking-tight text-blue-600">50K+</dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-sm font-medium leading-6 text-gray-600">Total Attendees</dt>
                <dd class="text-2xl font-bold leading-10 tracking-tight text-blue-600">1M+</dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-sm font-medium leading-6 text-gray-600">Event Organizers</dt>
                <dd class="text-2xl font-bold leading-10 tracking-tight text-blue-600">10K+</dd>
              </div>
            </dl>
          </div>

          <!-- Right Column - Event Dashboard Preview -->
          <div class="relative lg:ml-4">
            <div class="relative mx-auto w-full max-w-lg lg:max-w-none">
              <!-- Main Image -->
              <div class="relative">
                <div
                  class="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-600/5 p-8"
                >
                  <div
                    class="relative h-full w-full rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden"
                  >
                    <!-- Event Dashboard Preview -->
                    <div class="p-4">
                      <!-- Event Header -->
                      <div class="mb-6">
                        <div class="h-4 w-32 bg-blue-600/10 rounded mb-2"></div>
                        <div class="h-8 w-64 bg-gray-100 rounded"></div>
                      </div>
                      <!-- Event Stats -->
                      <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="h-16 bg-blue-50 rounded p-2">
                          <div class="h-3 w-16 bg-blue-600/20 rounded mb-2"></div>
                          <div class="h-4 w-12 bg-blue-600/30 rounded"></div>
                        </div>
                        <div class="h-16 bg-blue-50 rounded p-2">
                          <div class="h-3 w-16 bg-blue-600/20 rounded mb-2"></div>
                          <div class="h-4 w-12 bg-blue-600/30 rounded"></div>
                        </div>
                        <div class="h-16 bg-blue-50 rounded p-2">
                          <div class="h-3 w-16 bg-blue-600/20 rounded mb-2"></div>
                          <div class="h-4 w-12 bg-blue-600/30 rounded"></div>
                        </div>
                      </div>
                      <!-- Event List -->
                      <div class="space-y-3">
                        <div class="h-12 bg-gray-50 rounded"></div>
                        <div class="h-12 bg-gray-50 rounded"></div>
                        <div class="h-12 bg-gray-50 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Decorative Elements -->
                <div
                  class="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl"
                ></div>
                <div
                  class="absolute -top-12 -right-12 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-grid-slate-100 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.6)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>
