<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Assignment</h1>
        <p class="text-gray-500 mt-1">Assign teams to upcoming events</p>
      </div>
    </div>

    <!-- Event Selection -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Select Event</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="event-select" class="block text-sm font-medium text-gray-700 mb-1">
            Event
          </label>
          <select
            id="event-select"
            v-model="selectedEventId"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select an event</option>
            <option v-for="event in upcomingEvents" :key="event.id" :value="event.id">
              {{ event.title }} ({{ event.date }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="selectedEventId">
      <!-- Event Details -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-800">{{ selectedEvent.title }}</h2>
            <p class="text-gray-500 mt-1">
              {{ selectedEvent.location }} • {{ selectedEvent.date }}
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
            >
              {{ selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1) }}
            </span>
            <span class="text-sm text-gray-500"
              >{{ selectedEvent.expectedAttendees }} attendees</span
            >
          </div>
        </div>
      </div>

      <!-- Team Assignment -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Assign Teams</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Available Teams -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Available Teams</h3>
              <div class="border border-gray-200 rounded-md overflow-hidden">
                <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-gray-500">Team Leader Name</span>
                    <!-- <span class="text-xs font-medium text-gray-500">Members</span> -->
                  </div>
                </div>
                <div class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                  <div
                    v-for="team in availableTeams"
                    :key="team.id"
                    class="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    @click="selectTeam(team)"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="flex items-center justify-center font-medium">
                          <div
                            class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-green-600 font-medium"
                          ></div>
                        </div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            {{ team.firstName }} {{ team.lastName }}
                          </p>
                          <p class="text-xs text-gray-500">{{ team.role }}</p>
                        </div>
                      </div>
                      <!-- <div class="text-sm text-gray-500">{{ team.teamMembers.length }}</div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Assigned Teams -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-3">Assigned Teams</h3>
              <div class="border border-gray-200 rounded-md overflow-hidden">
                <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-gray-500">Team Name</span>
                    <span class="text-xs font-medium text-gray-500">Actions</span>
                  </div>
                </div>
                <div class="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                  <div
                    v-if="assignedTeams.length === 0"
                    class="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No teams assigned yet
                  </div>
                  <div v-for="team in assignedTeams" :key="team.id" class="px-4 py-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div
                          class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-green-600 font-medium"
                        ></div>
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            {{ team.firstName }} {{ team.lastName }}
                          </p>
                          <p class="text-xs text-gray-500">{{ team.role }}</p>
                        </div>
                      </div>
                      <button
                        @click="removeTeam(team)"
                        class="text-red-600 hover:text-red-900"
                        title="Remove Team"
                      >
                        <X class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Details -->
          <div v-if="selectedTeam" class="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div class="flex items-center justify-between mb-4">
              <!-- <h3 class="text-sm font-medium text-gray-900">{{ selectedTeam.firstName }} {{ selectedTeam.lastName }} Details</h3> -->
              <button
                @click="assignTeam(selectedTeam)"
                class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <UserPlus class="h-4 w-4 mr-1" />
                Assign to Event
              </button>
            </div>
         
           
          </div>

          <!-- Save Button -->
          <div class="mt-6 flex justify-end">
            <button
              @click="saveAssignments"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { UserPlus, X } from 'lucide-vue-next'
import axios from 'axios'
const route = useRoute()

// State variables
const selectedEventId = ref('')
const selectedTeam = ref(null)
const assignedTeams = ref([])

// Sample data
const upcomingEvents = ref([
])




const teams = ref([])

// Fetch team members from API
const fetchTeamMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/team', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    // Map the API response to flatten the user data
    teams.value = response.data.teamMembers

    console.log('Mapped team members:', teams.value) // Debugging log
  } catch (error) {
    console.error('Error fetching team members:', error)
  }
}
fetchTeamMembers()

// Computed properties
const selectedEvent = computed(() => {
  return upcomingEvents.value.find((event) => event.id === parseInt(selectedEventId.value)) || null
})

const availableTeams = computed(() => {
  const assignedTeamIds = assignedTeams.value.map((team) => team.id)
  return teams.value.filter((team) => !assignedTeamIds.includes(team.id))
})

// Helper functions
// const getInitials = (name) => {
//   return name
//     .split(' ')
//     .map((part) => part.charAt(0))
//     .join('')
//     .toUpperCase()
//     .substring(0, 2)
// }

// Action functions
const selectTeam = (team) => {
  selectedTeam.value = team
}

const assignTeam = (team) => {
  if (!assignedTeams.value.some((t) => t.id === team.id)) {
    assignedTeams.value.push(team)
    selectedTeam.value = null
  }
}

const removeTeam = (team) => {
  assignedTeams.value = assignedTeams.value.filter((t) => t.id !== team.id)
}

const saveAssignments = () => {
  // In a real app, this would send the assignments to the server
const payload = {
  event_id: selectedEventId.value,
  team_member_id: assignedTeams.value.map((team) => team.id),
}
console.log('team Id:',payload.team_member_id)

  console.log(
    `Assigned teams ${assignedTeams.value.map((t) => t.name).join(', ')} to event ${selectedEvent.value.title}`,
  )
  
}

// Check if we have a team ID from the route query
onMounted(() => {
  const eventId = route.query.eventId
  const teamId = route.query.teamId

  if (eventId) {
    selectedEventId.value = eventId
  }

  if (teamId) {
    // If a team ID is provided, pre-select that team for assignment
    const team = teams.value.find((t) => t.id === parseInt(teamId))
    if (team) {
      selectedTeam.value = team
    }
  }
})

// Watch for changes in selectedEventId to reset the form when it changes
watch(selectedEventId, () => {
  assignedTeams.value = []
  selectedTeam.value = null
})
</script>
