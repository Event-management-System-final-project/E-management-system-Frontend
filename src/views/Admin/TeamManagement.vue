<template>
<div class="space-y-6">
  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Team Management</h1>
      <p class="text-gray-500 mt-1">Create and manage teams for event assignments</p>
    </div>
    <button 
      @click="showCreateTeamModal = true"
      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <UserPlus class="h-4 w-4 mr-2" />
      Create New Team
    </button>
  </div>

  <!-- Team Stats -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-sm font-medium text-gray-500">Total Teams</p>
      <p class="text-2xl font-bold text-gray-900 mt-1">{{ teams.length }}</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-sm font-medium text-gray-500">Total Members</p>
      <p class="text-2xl font-bold text-blue-600 mt-1">{{ totalTeamMembers }}</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-sm font-medium text-gray-500">Assigned Teams</p>
      <p class="text-2xl font-bold text-green-600 mt-1">{{ assignedTeamsCount }}</p>
    </div>
    <div class="bg-white rounded-lg shadow p-6">
      <p class="text-sm font-medium text-gray-500">Available Teams</p>
      <p class="text-2xl font-bold text-yellow-600 mt-1">{{ availableTeamsCount }}</p>
    </div>
  </div>

  <!-- Team Filters and Search -->
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex flex-col md:flex-row md:items-center gap-4">
      <div class="relative flex-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search teams by name or specialization..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="flex flex-wrap gap-3">
        <select
          v-model="specializationFilter"
          class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Specializations</option>
          <option value="Technical Support">Technical Support</option>
          <option value="Event Coordination">Event Coordination</option>
          <option value="Audio/Visual">Audio/Visual</option>
          <option value="Hospitality">Hospitality</option>
          <option value="Security">Security</option>
        </select>
        <select
          v-model="availabilityFilter"
          class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="all">All Availability</option>
          <option value="Weekdays and Weekends">Weekdays and Weekends</option>
          <option value="Weekdays Only">Weekdays Only</option>
          <option value="Weekends Only">Weekends Only</option>
          <option value="Flexible">Flexible</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Teams List -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-for="team in filteredTeams" :key="team.id" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
              {{ team.name.charAt(0) }}
            </div>
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900">{{ team.name }}</h3>
              <p class="text-sm text-gray-500">{{ team.specialization }}</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <button 
              @click="editTeam(team)"
              class="p-1 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none"
              title="Edit Team"
            >
              <Edit class="h-5 w-5" />
            </button>
            <button 
              @click="confirmDeleteTeam(team)"
              class="p-1 rounded-full text-red-600 hover:text-red-800 focus:outline-none"
              title="Delete Team"
            >
              <Trash2 class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-gray-500">Availability</span>
            <span class="text-xs font-medium text-gray-900">{{ team.availability }}</span>
          </div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-medium text-gray-500">Members</span>
            <span class="text-xs font-medium text-gray-900">{{ team.members.length }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-500">Status</span>
            <span 
              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              :class="team.isAssigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
            >
              {{ team.isAssigned ? 'Assigned' : 'Available' }}
            </span>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="member in team.members" :key="member.id" class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                  {{ getInitials(member.name) }}
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-gray-500">{{ member.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button 
            @click="viewTeamDetails(team)"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create/Edit Team Modal -->
  <div v-if="showCreateTeamModal || showEditTeamModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
      <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            {{ showEditTeamModal ? 'Edit Team' : 'Create New Team' }}
          </h3>
          <button @click="closeTeamModal" class="text-gray-400 hover:text-gray-500">
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="p-6 max-h-[70vh] overflow-y-auto">
        <form id="team-form" @submit.prevent="saveTeam" class="space-y-4">
          <div>
            <label for="team-name" class="block text-sm font-medium text-gray-700">
              Team Name *
            </label>
            <input
              id="team-name"
              type="text"
              v-model="teamForm.name"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter team name"
            />
          </div>
          
          <div>
            <label for="specialization" class="block text-sm font-medium text-gray-700">
              Specialization *
            </label>
            <select
              id="specialization"
              v-model="teamForm.specialization"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Technical Support">Technical Support</option>
              <option value="Event Coordination">Event Coordination</option>
              <option value="Audio/Visual">Audio/Visual</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Security">Security</option>
            </select>
          </div>
          
          <div>
            <label for="availability" class="block text-sm font-medium text-gray-700">
              Availability *
            </label>
            <select
              id="availability"
              v-model="teamForm.availability"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Weekdays and Weekends">Weekdays and Weekends</option>
              <option value="Weekdays Only">Weekdays Only</option>
              <option value="Weekends Only">Weekends Only</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Team Members
            </label>
            <div class="border border-gray-300 rounded-md p-4 space-y-4">
              <div v-if="teamForm.members.length === 0" class="text-center py-4 text-gray-500">
                No team members added yet
              </div>
              
              <div v-for="(member, index) in teamForm.members" :key="index" class="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {{ getInitials(member.name) }}
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                    <p class="text-xs text-gray-500">{{ member.role }}</p>
                  </div>
                </div>
                <button 
                  type="button"
                  @click="removeMember(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>
              
              <div class="border-t border-gray-200 pt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Add New Member</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="member-name" class="block text-xs font-medium text-gray-500">
                      Name
                    </label>
                    <input
                      id="member-name"
                      type="text"
                      v-model="newMember.name"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter member name"
                    />
                  </div>
                  <div>
                    <label for="member-role" class="block text-xs font-medium text-gray-500">
                      Role
                    </label>
                    <input
                      id="member-role"
                      type="text"
                      v-model="newMember.role"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter member role"
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  @click="addMember"
                  class="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  :disabled="!newMember.name || !newMember.role"
                >
                  <UserPlus class="h-4 w-4 mr-2" />
                  Add Member
                </button>
              </div>
            </div>
          </div>
          
        </form>
      </div>
      <div class="p-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="closeTeamModal"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="team-form"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {{ showEditTeamModal ? 'Update Team' : 'Create Team' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Team Details Modal -->
  <div v-if="showTeamDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col">
      <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">
            Team Details
          </h3>
          <button @click="closeTeamDetailsModal" class="text-gray-400 hover:text-gray-500">
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>
      <div class="p-6 overflow-y-auto" v-if="selectedTeam">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Left column: Team details -->
          <div class="md:col-span-2 space-y-6">
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
                {{ selectedTeam.name.charAt(0) }}
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-bold text-gray-900">{{ selectedTeam.name }}</h2>
                <p class="text-sm text-gray-500">{{ selectedTeam.specialization }}</p>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Availability</h3>
                <p class="text-sm text-gray-900">{{ selectedTeam.availability }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="selectedTeam.isAssigned ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                >
                  {{ selectedTeam.isAssigned ? 'Assigned' : 'Available' }}
                </span>
              </div>
            </div>
            
            <!-- Team Members -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">Team Members</h3>
              <div class="bg-gray-50 rounded-md p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="member in selectedTeam.members" 
                    :key="member.id"
                    class="flex items-center p-3 bg-white rounded-md border border-gray-200"
                  >
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {{ getInitials(member.name) }}
                    </div>
                    <div class="ml-3">
                      <p class="text-sm font-medium text-gray-900">{{ member.name }}</p>
                      <p class="text-xs text-gray-500">{{ member.role }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Assigned Events -->
            <div v-if="selectedTeam.assignedEvents && selectedTeam.assignedEvents.length > 0">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Assigned Events</h3>
              <div class="bg-gray-50 rounded-md p-4">
                <div class="space-y-3">
                  <div 
                    v-for="event in selectedTeam.assignedEvents" 
                    :key="event.id"
                    class="p-3 bg-white rounded-md border border-gray-200"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                        <p class="text-xs text-gray-500">{{ event.date }} • {{ event.location }}</p>
                      </div>
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-blue-100 text-blue-800': event.status === 'upcoming',
                          'bg-green-100 text-green-800': event.status === 'live',
                          'bg-gray-100 text-gray-800': event.status === 'completed'
                        }"
                      >
                        {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right column: Actions -->
          <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Team Actions</h3>
              <div class="space-y-3">
                <button
                  @click="editTeamFromDetails(selectedTeam)"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit class="h-4 w-4 mr-2" />
                  Edit Team
                </button>
                <button
                  v-if="!selectedTeam.isAssigned"
                  @click="assignTeamToEvent(selectedTeam)"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Calendar class="h-4 w-4 mr-2" />
                  Assign to Event
                </button>
              </div>
            </div>
            
            <!-- Team Performance (if applicable) -->
            <div v-if="selectedTeam.performance" class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Team Performance</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Events Completed</span>
                  <span class="text-sm font-medium text-gray-900">{{ selectedTeam.performance.eventsCompleted }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500">Average Rating</span>
                  <div class="flex items-center">
                    <Star class="h-4 w-4 text-yellow-400" />
                    <span class="ml-1 text-sm font-medium text-gray-900">{{ selectedTeam.performance.averageRating }}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
      <div class="p-6">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle class="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h3 class="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Team
        </h3>
        <p class="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete the team "{{ teamToDelete?.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-center space-x-3">
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="showDeleteModal = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            @click="deleteTeam"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Search, 
  Edit, 
  Trash2, 
  X, 
  UserPlus,
  Calendar,
  AlertCircle,
  Star
} from 'lucide-vue-next';

const router = useRouter();

// Sample data
const teams = ref([
  {
    id: 1,
    name: 'Alpha Team',
    specialization: 'Technical Support',
    availability: 'Weekdays and Weekends',
    isAssigned: true,
    members: [
      { id: 1, name: 'John Smith', role: 'Team Lead' },
      { id: 2, name: 'Emily Johnson', role: 'Technical Specialist' },
      { id: 3, name: 'Michael Brown', role: 'Support Staff' }
    ],
    assignedEvents: [
      { 
        id: 1, 
        title: 'Tech Conference 2023', 
        date: 'Nov 15-17, 2023', 
        location: 'San Francisco, CA',
        status: 'upcoming'
      }
    ],
    performance: {
      eventsCompleted: 12,
      averageRating: 4.8
    }
  },
  {
    id: 2,
    name: 'Beta Team',
    specialization: 'Event Coordination',
    availability: 'Weekends Only',
    isAssigned: true,
    members: [
      { id: 4, name: 'Sarah Davis', role: 'Coordinator' },
      { id: 5, name: 'Robert Wilson', role: 'Assistant' },
      { id: 6, name: 'Jessica Martinez', role: 'Logistics' }
    ],
    assignedEvents: [
      { 
        id: 3, 
        title: 'Product Launch', 
        date: 'Oct 25, 2023', 
        location: 'New York, NY',
        status: 'live'
      }
    ],
    performance: {
      eventsCompleted: 8,
      averageRating: 4.5
    }
  },
  {
    id: 3,
    name: 'Gamma Team',
    specialization: 'Audio/Visual',
    availability: 'Flexible',
    isAssigned: true,
    members: [
      { id: 7, name: 'David Taylor', role: 'A/V Lead' },
      { id: 8, name: 'Amanda White', role: 'Technician' },
      { id: 9, name: 'James Anderson', role: 'Assistant' }
    ],
    assignedEvents: [
      { 
        id: 1, 
        title: 'Tech Conference 2023', 
        date: 'Nov 15-17, 2023', 
        location: 'San Francisco, CA',
        status: 'upcoming'
      }
    ],
    performance: {
      eventsCompleted: 15,
      averageRating: 4.9
    }
  },
  {
    id: 4,
    name: 'Delta Team',
    specialization: 'Hospitality',
    availability: 'Weekdays Only',
    isAssigned: false,
    members: [
      { id: 10, name: 'Lisa Thomas', role: 'Hospitality Lead' },
      { id: 11, name: 'Kevin Harris', role: 'Customer Service' },
      { id: 12, name: 'Michelle Clark', role: 'Guest Relations' }
    ],
    assignedEvents: [],
    performance: {
      eventsCompleted: 6,
      averageRating: 4.7
    }
  },
  {
    id: 5,
    name: 'Epsilon Team',
    specialization: 'Security',
    availability: 'Weekdays and Weekends',
    isAssigned: false,
    members: [
      { id: 13, name: 'Mark Wilson', role: 'Security Lead' },
      { id: 14, name: 'Jennifer Adams', role: 'Security Officer' },
      { id: 15, name: 'Brian Thompson', role: 'Access Control' }
    ],
    assignedEvents: [],
    performance: {
      eventsCompleted: 9,
      averageRating: 4.6
    }
  }
]);

// State variables
const searchQuery = ref('');
const specializationFilter = ref('all');
const availabilityFilter = ref('all');
const showCreateTeamModal = ref(false);
const showEditTeamModal = ref(false);
const showTeamDetailsModal = ref(false);
const showDeleteModal = ref(false);
const selectedTeam = ref(null);
const teamToDelete = ref(null);
const teamForm = ref({
  id: null,
  name: '',
  specialization: 'Technical Support',
  availability: 'Weekdays and Weekends',
  isAssigned: false,
  members: [],
  assignedEvents: []
});
const newMember = ref({
  name: '',
  role: ''
});

// Computed properties
const totalTeamMembers = computed(() => {
  return teams.value.reduce((total, team) => total + team.members.length, 0);
});

const assignedTeamsCount = computed(() => {
  return teams.value.filter(team => team.isAssigned).length;
});

const availableTeamsCount = computed(() => {
  return teams.value.filter(team => !team.isAssigned).length;
});

const filteredTeams = computed(() => {
  let result = [...teams.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(team => 
      team.name.toLowerCase().includes(query) || 
      team.specialization.toLowerCase().includes(query)
    );
  }

  // Apply specialization filter
  if (specializationFilter.value !== 'all') {
    result = result.filter(team => team.specialization === specializationFilter.value);
  }

  // Apply availability filter
  if (availabilityFilter.value !== 'all') {
    result = result.filter(team => team.availability === availabilityFilter.value);
  }

  return result;
});

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Action functions
const viewTeamDetails = (team) => {
  selectedTeam.value = team;
  showTeamDetailsModal.value = true;
};

const closeTeamDetailsModal = () => {
  showTeamDetailsModal.value = false;
  selectedTeam.value = null;
};

const editTeam = (team) => {
  teamForm.value = JSON.parse(JSON.stringify(team)); // Deep copy
  showEditTeamModal.value = true;
};

const editTeamFromDetails = (team) => {
  editTeam(team);
  closeTeamDetailsModal();
};

const closeTeamModal = () => {
  showCreateTeamModal.value = false;
  showEditTeamModal.value = false;
  resetTeamForm();
};

const resetTeamForm = () => {
  teamForm.value = {
    id: null,
    name: '',
    specialization: 'Technical Support',
    availability: 'Weekdays and Weekends',
    isAssigned: false,
    members: [],
    assignedEvents: []
  };
  newMember.value = {
    name: '',
    role: ''
  };
};

const addMember = () => {
  if (newMember.value.name && newMember.value.role) {
    teamForm.value.members.push({
      id: Date.now(), // Generate a temporary ID
      name: newMember.value.name,
      role: newMember.value.role
    });
    newMember.value = {
      name: '',
      role: ''
    };
  }
};

const removeMember = (index) => {
  teamForm.value.members.splice(index, 1);
};

const saveTeam = () => {
  if (showEditTeamModal.value) {
    // Update existing team
    const index = teams.value.findIndex(t => t.id === teamForm.value.id);
    if (index !== -1) {
      teams.value[index] = { ...teamForm.value };
    }
  } else {
    // Add new team
    const newId = Math.max(0, ...teams.value.map(t => t.id)) + 1;
    const newTeam = {
      ...teamForm.value,
      id: newId,
      performance: {
        eventsCompleted: 0,
        averageRating: 0
      }
    };
    teams.value.push(newTeam);
  }
  closeTeamModal();
};

const confirmDeleteTeam = (team) => {
  teamToDelete.value = team;
  showDeleteModal.value = true;
};

const deleteTeam = () => {
  if (teamToDelete.value) {
    teams.value = teams.value.filter(t => t.id !== teamToDelete.value.id);
    showDeleteModal.value = false;
    teamToDelete.value = null;
  }
};

const assignTeamToEvent = (team) => {
  // Navigate to team assignment page
  router.push(`/AdminDashboard/team-assignment?teamId=${team.id}`);
};
</script>

