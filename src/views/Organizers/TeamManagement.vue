<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Team Members</h1>
        <p class="text-gray-500 mt-1">Manage your team and assign events to members</p>
      </div>
      <button 
        @click="showAddMemberModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <UserPlus class="h-4 w-4 mr-2" />
        Add Team Member
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search team members..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="roleFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="all">All Roles</option>
            <option v-for="role in uniqueRoles" :key="role" :value="role">
              {{ role }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Team Members Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-if="filteredMembers.length === 0" class="md:col-span-2 lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-12 text-center">
          <div class="flex flex-col items-center">
            <Users class="h-16 w-16 text-gray-400 mb-4" />
            <p class="text-lg font-medium mb-1">No team members found</p>
            <p class="text-sm text-gray-500 mb-4">
              {{ searchQuery || roleFilter !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Add your first team member to get started" 
              }}
            </p>
            <button
              @click="showAddMemberModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlus class="h-4 w-4 mr-2" />
              Add Team Member
            </button>
          </div>
        </div>
      </div>

      <div 
        v-for="member in filteredMembers" 
        :key="member.id" 
        class="bg-white rounded-lg shadow overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                {{ getInitials(member.name) }}
              </div>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-900">{{ member.name }}</h3>
                <p class="text-sm text-gray-500">{{ member.role }}</p>
              </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editMember(member)"
                class="p-1 rounded-full text-blue-600 hover:text-blue-800 focus:outline-none"
                title="Edit Member"
              >
                <Edit class="h-5 w-5" />
              </button>
              <button 
                @click="confirmDeleteMember(member)"
                class="p-1 rounded-full text-red-600 hover:text-red-800 focus:outline-none"
                title="Delete Member"
              >
                <Trash2 class="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-500">Email</span>
              <span class="text-xs font-medium text-gray-900">{{ member.email }}</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs font-medium text-gray-500">Phone</span>
              <span class="text-xs font-medium text-gray-900">{{ member.phone || 'Not provided' }}</span>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Assigned Events</h4>
            <div v-if="member.assignedEvents && member.assignedEvents.length > 0" class="space-y-2 max-h-32 overflow-y-auto">
              <div 
                v-for="event in member.assignedEvents" 
                :key="event.id" 
                class="flex items-center justify-between bg-gray-50 p-2 rounded-md"
              >
                <div class="flex items-center">
                  <Calendar class="h-4 w-4 text-blue-500 mr-2" />
                  <span class="text-sm text-gray-900 truncate max-w-[150px]">{{ event.title }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ formatDate(event.date) }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-gray-500 text-center py-2">
              No events assigned
            </div>
          </div>
          
          <div class="mt-4 flex justify-end space-x-2">
            <button 
              @click="assignEvent(member)"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Calendar class="h-4 w-4 mr-1" />
              Assign Event
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Member Modal -->
    <div v-if="showAddMemberModal || showEditMemberModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditMemberModal ? 'Edit Team Member' : 'Add New Team Member' }}
            </h3>
            <button @click="closeMemberModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <form id="member-form" @submit.prevent="saveMember" class="space-y-4">
            <div>
              <label for="member-name" class="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="member-name"
                type="text"
                v-model="memberForm.name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter full name"
              />
            </div>
            
            <div>
              <label for="member-email" class="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="member-email"
                type="email"
                v-model="memberForm.email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter email address"
              />
            </div>
            
            <div>
              <label for="member-phone" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="member-phone"
                type="tel"
                v-model="memberForm.phone"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter phone number"
              />
            </div>
            
            <div>
              <label for="member-role" class="block text-sm font-medium text-gray-700">
                Role *
              </label>
              <input
                id="member-role"
                type="text"
                v-model="memberForm.role"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter role(s) e.g. 'Venue Coordinator, Technical Support'"
              />
            </div>
            
            <div>
              <label for="member-password" class="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="member-password"
                type="password"
                v-model="memberForm.password"
                :required="!showEditMemberModal"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter password"
                autocomplete="new-password"
              />
              <p v-if="showEditMemberModal && !memberForm.password" class="mt-1 text-xs text-gray-500">
                Leave blank to keep current password
              </p>
            </div>
            
            <div>
              <label for="member-confirm-password" class="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <input
                id="member-confirm-password"
                type="password"
                v-model="memberForm.confirmPassword"
                :required="!showEditMemberModal || memberForm.password"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm password"
                autocomplete="new-password"
              />
              <p v-if="passwordError" class="mt-1 text-xs text-red-500">
                {{ passwordError }}
              </p>
            </div>
          </form>
        </div>
        <div class="p-6 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="closeMemberModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="member-form"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="!!passwordError"
            >
              {{ showEditMemberModal ? 'Update Member' : 'Add Member' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Member Details Modal -->
    <div v-if="showMemberDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Team Member Details
            </h3>
            <button @click="closeMemberDetailsModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6 overflow-y-auto" v-if="selectedMember">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Left column: Member details -->
            <div class="md:col-span-2 space-y-6">
              <div class="flex items-center">
                <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
                  {{ getInitials(selectedMember.name) }}
                </div>
                <div class="ml-4">
                  <h2 class="text-xl font-bold text-gray-900">{{ selectedMember.name }}</h2>
                  <p class="text-sm text-gray-500">{{ selectedMember.role }}</p>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p class="text-sm text-gray-900">{{ selectedMember.email }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                  <p class="text-sm text-gray-900">{{ selectedMember.phone || 'Not provided' }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-1">Member Since</h3>
                  <p class="text-sm text-gray-900">{{ formatDate(selectedMember.joinedDate) }}</p>
                </div>
              </div>
              
              <!-- Assigned Events -->
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-2">Assigned Events</h3>
                <div v-if="selectedMember.assignedEvents && selectedMember.assignedEvents.length > 0" class="bg-gray-50 rounded-md p-4">
                  <div class="space-y-3">
                    <div 
                      v-for="event in selectedMember.assignedEvents" 
                      :key="event.id"
                      class="p-3 bg-white rounded-md border border-gray-200"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                          <p class="text-xs text-gray-500">{{ formatDate(event.date) }} • {{ event.location }}</p>
                        </div>
                        <button 
                          @click="unassignEvent(selectedMember, event)"
                          class="text-red-600 hover:text-red-800"
                          title="Unassign from Event"
                        >
                          <X class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="bg-gray-50 rounded-md p-4 text-center text-sm text-gray-500">
                  No events assigned to this team member
                </div>
              </div>
              
              <!-- Task History -->
              <div v-if="selectedMember.taskHistory && selectedMember.taskHistory.length > 0">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Recent Tasks</h3>
                <div class="bg-gray-50 rounded-md p-4">
                  <div class="space-y-3">
                    <div 
                      v-for="task in selectedMember.taskHistory" 
                      :key="task.id"
                      class="p-3 bg-white rounded-md border border-gray-200"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <p class="text-sm font-medium text-gray-900">{{ task.title }}</p>
                          <p class="text-xs text-gray-500">{{ task.eventTitle }} • Due: {{ formatDate(task.dueDate) }}</p>
                        </div>
                        <span 
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                          :class="{
                            'bg-gray-100 text-gray-800': task.status === 'not-started',
                            'bg-yellow-100 text-yellow-800': task.status === 'in-progress',
                            'bg-green-100 text-green-800': task.status === 'completed'
                          }"
                        >
                          {{ formatStatus(task.status) }}
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
                <h3 class="text-sm font-medium text-gray-500 mb-2">Member Actions</h3>
                <div class="space-y-3">
                  <button
                    @click="editMemberFromDetails(selectedMember)"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit class="h-4 w-4 mr-2" />
                    Edit Member
                  </button>
                  <button
                    @click="assignEventFromDetails(selectedMember)"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Calendar class="h-4 w-4 mr-2" />
                    Assign to Event
                  </button>
                </div>
              </div>
              
              <!-- Performance Stats (if applicable) -->
              <div v-if="selectedMember.performance" class="bg-gray-50 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 mb-2">Performance</h3>
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Events Completed</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedMember.performance.eventsCompleted }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">Tasks Completed</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedMember.performance.tasksCompleted }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500">On-time Completion</span>
                    <span class="text-sm font-medium text-gray-900">{{ selectedMember.performance.onTimePercentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Assign Event Modal -->
    <div v-if="showAssignEventModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full my-8">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              Assign Event to {{ memberToAssign ? memberToAssign.name : '' }}
            </h3>
            <button @click="closeAssignEventModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveEventAssignment" class="space-y-4">
            <div>
              <label for="event-select" class="block text-sm font-medium text-gray-700">
                Select Event *
              </label>
              <select
                id="event-select"
                v-model="selectedEventId"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select an event</option>
                <option v-for="event in availableEvents" :key="event.id" :value="event.id">
                  {{ event.title }} ({{ formatDate(event.date) }})
                </option>
              </select>
              <p v-if="availableEvents.length === 0" class="mt-1 text-sm text-red-600">
                No available events to assign. Please create an event first.
              </p>
            </div>
            
            <div v-if="selectedEventId">
              <label for="event-role" class="block text-sm font-medium text-gray-700">
                Role in Event *
              </label>
              <select
                id="event-role"
                v-model="eventAssignmentForm.role"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Primary Contact">Primary Contact</option>
                <option value="Support Staff">Support Staff</option>
                <option value="Coordinator">Coordinator</option>
                <option value="Technical Support">Technical Support</option>
              </select>
            </div>
            
            <div v-if="selectedEventId">
              <label for="event-notes" class="block text-sm font-medium text-gray-700">
                Assignment Notes
              </label>
              <textarea
                id="event-notes"
                v-model="eventAssignmentForm.notes"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter any notes about this assignment"
              ></textarea>
            </div>
            
            <div class="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="closeAssignEventModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="!selectedEventId"
              >
                Assign Event
              </button>
            </div>
          </form>
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
            Delete Team Member
          </h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete {{ memberToDelete?.name }}? This action cannot be undone.
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
              @click="deleteMember"
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
import { ref, computed, watch } from 'vue';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Calendar, 
  Users,
  X,
  AlertCircle
} from 'lucide-vue-next';

// Sample data for team members
const teamMembers = ref([
  {
    id: 1,
    name: 'John Smith',
    role: 'Venue Coordinator',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    joinedDate: '2023-01-15',
    password: 'hashedpassword123', // In a real app, this would be properly hashed
    assignedEvents: [
      { 
        id: 1, 
        title: 'Tech Conference 2023', 
        date: '2023-11-15', 
        location: 'Convention Center'
      }
    ],
    taskHistory: [
      {
        id: 1,
        title: 'Book conference venue',
        eventTitle: 'Tech Conference 2023',
        dueDate: '2023-09-15',
        status: 'completed'
      },
      {
        id: 4,
        title: 'Coordinate with venue staff',
        eventTitle: 'Tech Conference 2023',
        dueDate: '2023-10-20',
        status: 'in-progress'
      }
    ],
    performance: {
      eventsCompleted: 12,
      tasksCompleted: 45,
      onTimePercentage: 92
    }
  },
  {
    id: 2,
    name: 'Emily Johnson',
    role: 'Marketing Lead',
    email: 'emily@example.com',
    phone: '(555) 234-5678',
    joinedDate: '2023-02-10',
    password: 'hashedpassword456',
    assignedEvents: [
      { 
        id: 1, 
        title: 'Tech Conference 2023', 
        date: '2023-11-15', 
        location: 'Convention Center'
      },
      { 
        id: 2, 
        title: 'Product Launch', 
        date: '2023-10-25', 
        location: 'Downtown Hotel'
      }
    ],
    taskHistory: [
      {
        id: 2,
        title: 'Create marketing materials',
        eventTitle: 'Tech Conference 2023',
        dueDate: '2023-09-30',
        status: 'in-progress'
      }
    ],
    performance: {
      eventsCompleted: 8,
      tasksCompleted: 32,
      onTimePercentage: 88
    }
  },
  {
    id: 3,
    name: 'Michael Brown',
    role: 'Catering Manager',
    email: 'michael@example.com',
    phone: '(555) 345-6789',
    joinedDate: '2023-03-05',
    password: 'hashedpassword789',
    assignedEvents: [
      { 
        id: 1, 
        title: 'Tech Conference 2023', 
        date: '2023-11-15', 
        location: 'Convention Center'
      }
    ],
    taskHistory: [
      {
        id: 3,
        title: 'Arrange catering services',
        eventTitle: 'Tech Conference 2023',
        dueDate: '2023-10-10',
        status: 'not-started'
      }
    ],
    performance: {
      eventsCompleted: 10,
      tasksCompleted: 38,
      onTimePercentage: 95
    }
  },
  {
    id: 4,
    name: 'Sarah Davis',
    role: 'Speaker Coordinator',
    email: 'sarah@example.com',
    phone: '(555) 456-7890',
    joinedDate: '2023-04-20',
    password: 'hashedpassword101',
    assignedEvents: [],
    taskHistory: [],
    performance: {
      eventsCompleted: 6,
      tasksCompleted: 24,
      onTimePercentage: 90
    }
  },
  {
    id: 5,
    name: 'David Wilson',
    role: 'Registration Manager',
    email: 'david@example.com',
    phone: '(555) 567-8901',
    joinedDate: '2023-05-15',
    password: 'hashedpassword202',
    assignedEvents: [],
    taskHistory: [],
    performance: {
      eventsCompleted: 4,
      tasksCompleted: 18,
      onTimePercentage: 85
    }
  }
]);

// Sample data for events
const events = ref([
  {
    id: 1,
    title: 'Tech Conference 2023',
    date: '2023-11-15',
    location: 'Convention Center',
    description: 'Annual technology conference featuring the latest innovations and industry speakers.'
  },
  {
    id: 2,
    title: 'Product Launch',
    date: '2023-10-25',
    location: 'Downtown Hotel',
    description: 'Launch event for our new product line with demonstrations and networking.'
  },
  {
    id: 3,
    title: 'Charity Gala',
    date: '2023-12-10',
    location: 'Grand Ballroom',
    description: 'Annual fundraising gala to support local education initiatives.'
  },
  {
    id: 4,
    title: 'Workshop Series',
    date: '2023-11-05',
    location: 'Innovation Center',
    description: 'A series of workshops focused on professional development and skill building.'
  }
]);

// State variables
const searchQuery = ref('');
const roleFilter = ref('all');
const showAddMemberModal = ref(false);
const showEditMemberModal = ref(false);
const showMemberDetailsModal = ref(false);
const showAssignEventModal = ref(false);
const showDeleteModal = ref(false);
const selectedMember = ref(null);
const memberToDelete = ref(null);
const memberToAssign = ref(null);
const selectedEventId = ref('');
const memberForm = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
});
const eventAssignmentForm = ref({
  role: 'Support Staff',
  notes: ''
});

// Password validation
const passwordError = computed(() => {
  if (!memberForm.value.password && !memberForm.value.confirmPassword) return '';
  
  if (memberForm.value.password && memberForm.value.password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  if (memberForm.value.password !== memberForm.value.confirmPassword) {
    return 'Passwords do not match';
  }
  
  return '';
});

// Computed properties
const filteredMembers = computed(() => {
  let result = [...teamMembers.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(member => 
      member.name.toLowerCase().includes(query) || 
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  }
  
  // Apply role filter
  if (roleFilter.value !== 'all') {
    result = result.filter(member => {
      const memberRoles = member.role.split(',').map(r => r.trim());
      return memberRoles.includes(roleFilter.value);
    });
  }
  
  return result;
});

const activeMembers = computed(() => 
  teamMembers.value.length
);

const assignedMembers = computed(() => 
  teamMembers.value.filter(member => 
    member.assignedEvents && member.assignedEvents.length > 0
  ).length
);

const availableMembers = computed(() => 
  teamMembers.value.filter(member => 
    (!member.assignedEvents || member.assignedEvents.length === 0)
  ).length
);

const availableEvents = computed(() => {
  if (!memberToAssign.value) return [];
  
  // Get IDs of events already assigned to this member
  const assignedEventIds = memberToAssign.value.assignedEvents 
    ? memberToAssign.value.assignedEvents.map(e => e.id) 
    : [];
  
  // Return events not already assigned to this member
  return events.value.filter(event => !assignedEventIds.includes(event.id));
});

const uniqueRoles = computed(() => {
  const allRoles = new Set();
  
  teamMembers.value.forEach(member => {
    // Split roles by comma and trim whitespace
    const roles = member.role.split(',').map(r => r.trim());
    roles.forEach(role => {
      if (role) allRoles.add(role);
    });
  });
  
  return Array.from(allRoles).sort();
});

// Helper functions
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatStatus = (status) => {
  switch (status) {
    case 'not-started':
      return 'Not Started';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Action functions
const viewMemberDetails = (member) => {
  selectedMember.value = member;
  showMemberDetailsModal.value = true;
};

const closeMemberDetailsModal = () => {
  showMemberDetailsModal.value = false;
  selectedMember.value = null;
};

const editMember = (member) => {
  memberForm.value = { 
    ...member,
    password: '',
    confirmPassword: ''
  };
  showEditMemberModal.value = true;
};

const editMemberFromDetails = (member) => {
  editMember(member);
  closeMemberDetailsModal();
};

const closeMemberModal = () => {
  showAddMemberModal.value = false;
  showEditMemberModal.value = false;
  resetMemberForm();
};

const resetMemberForm = () => {
  memberForm.value = {
    name: '',
    role: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  };
};

const saveMember = () => {
  // Check password validation
  if (passwordError.value) return;
  
  if (showEditMemberModal.value) {
    // Update existing member
    const index = teamMembers.value.findIndex(m => m.id === memberForm.value.id);
    if (index !== -1) {
      // Create updated member object
      const updatedMember = {
        ...teamMembers.value[index],
        name: memberForm.value.name,
        role: memberForm.value.role,
        email: memberForm.value.email,
        phone: memberForm.value.phone
      };
      
      // Only update password if a new one was provided
      if (memberForm.value.password) {
        // In a real app, you would hash the password here
        updatedMember.password = memberForm.value.password;
      }
      
      teamMembers.value[index] = updatedMember;
    }
  } else {
    // Add new member
    const newId = teamMembers.value.length > 0 
      ? Math.max(...teamMembers.value.map(m => m.id)) + 1 
      : 1;
    
    // In a real app, you would hash the password here
    const hashedPassword = memberForm.value.password;
    
    teamMembers.value.push({
      id: newId,
      name: memberForm.value.name,
      role: memberForm.value.role,
      email: memberForm.value.email,
      phone: memberForm.value.phone,
      password: hashedPassword,
      joinedDate: new Date().toISOString().split('T')[0],
      assignedEvents: [],
      taskHistory: [],
      performance: {
        eventsCompleted: 0,
        tasksCompleted: 0,
        onTimePercentage: 100
      }
    });
  }
  
  closeMemberModal();
};

const confirmDeleteMember = (member) => {
  memberToDelete.value = member;
  showDeleteModal.value = true;
};

const deleteMember = () => {
  if (memberToDelete.value) {
    teamMembers.value = teamMembers.value.filter(m => m.id !== memberToDelete.value.id);
    showDeleteModal.value = false;
    memberToDelete.value = null;
  }
};

const assignEvent = (member) => {
  memberToAssign.value = member;
  selectedEventId.value = '';
  eventAssignmentForm.value = {
    role: 'Support Staff',
    notes: ''
  };
  showAssignEventModal.value = true;
};

const assignEventFromDetails = (member) => {
  assignEvent(member);
  closeMemberDetailsModal();
};

const closeAssignEventModal = () => {
  showAssignEventModal.value = false;
  memberToAssign.value = null;
  selectedEventId.value = '';
};

const saveEventAssignment = () => {
  if (memberToAssign.value && selectedEventId.value) {
    const eventId = parseInt(selectedEventId.value);
    const event = events.value.find(e => e.id === eventId);
    
    if (event) {
      // Find the member in the array
      const memberIndex = teamMembers.value.findIndex(m => m.id === memberToAssign.value.id);
      
      if (memberIndex !== -1) {
        // Initialize assignedEvents array if it doesn't exist
        if (!teamMembers.value[memberIndex].assignedEvents) {
          teamMembers.value[memberIndex].assignedEvents = [];
        }
        
        // Add the event to the member's assigned events
        teamMembers.value[memberIndex].assignedEvents.push({
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          role: eventAssignmentForm.value.role,
          notes: eventAssignmentForm.value.notes
        });
      }
    }
    
    closeAssignEventModal();
  }
};

const unassignEvent = (member, eventToRemove) => {
  const memberIndex = teamMembers.value.findIndex(m => m.id === member.id);
  
  if (memberIndex !== -1 && teamMembers.value[memberIndex].assignedEvents) {
    teamMembers.value[memberIndex].assignedEvents = 
      teamMembers.value[memberIndex].assignedEvents.filter(e => e.id !== eventToRemove.id);
  }
};

// Watch for password changes to validate in real-time
watch(() => [memberForm.value.password, memberForm.value.confirmPassword], () => {
  // Password validation happens automatically via the computed property
}, { deep: true });
</script>

