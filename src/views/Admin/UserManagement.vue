<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-500 mt-1">Manage all users and their accounts</p>
      </div>
      <button
        @click="showAddUserModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UserPlus class="h-4 w-4 mr-2" />
        Add New User
      </button>
    </div>

    <!-- User Stats -->
    <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Total Users</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.total }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Admins</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.admins }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Organizers</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.organizers }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-sm font-medium text-gray-500">Attendees</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ userStats.attendees }}</p>
      </div>
    </div> -->

    <!-- User Filters and Search -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name, email, or role..."
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <select
            v-model="roleFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="attendee">Attendee</option>
          </select>
          <!-- <select
            v-model="statusFilter"
            class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select> -->
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-Rolexs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <!-- <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <!-- <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Active
              </th> -->
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ user.firstName }} {{ user.lastName }}
                </div>
              </td>
              <!-- Email Column -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-purple-100 text-purple-800': user.role === 'admin',
                    'bg-blue-100 text-blue-800': user.role === 'organizer',
                    'bg-green-100 text-green-800': user.role === 'user',
                  }"
                >
                  {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                </span>
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                  :class="{
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-gray-100 text-gray-800': user.status === 'inactive',
                    'bg-red-100 text-red-800': user.status === 'suspended'
                  }"
                >
                  {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                </span>
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ new Date(user.created_at).toLocaleDateString('en-US') }}
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.lastActive }}
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editUser(user)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="Edit User"
                  >
                    <Edit class="h-5 w-5" />
                  </button>
                  <button
                    v-if="user.status !== 'suspended'"
                    @click="suspendUser(user.id)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Suspend User"
                  >
                    <AlertTriangle class="h-5 w-5" />
                  </button>
                  <button
                    v-else
                    @click="activateUser(user.id)"
                    class="text-green-600 hover:text-green-900"
                    title="Activate User"
                  >
                    <CheckCircle class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete User"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of
              <span class="font-medium">{{ users.length }}</span> results
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                1
              </button>
              <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                2
              </button>
              <button
                class="relative inline-flex items-center px-4 py-2 border border-indigo-500 bg-indigo-50 text-sm font-medium text-indigo-600"
              >
                3
              </button>
              <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                4
              </button>
              <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                5
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div
      v-if="showAddUserModal || showEditUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ showEditUserModal ? 'Edit User' : 'Add New User' }}
            </h3>
            <button @click="closeUserModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <!-- <div class="p-6">
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                v-model="userForm.name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                v-model="userForm.email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-gray-700"> Role * </label>
              <select
                id="role"
                v-model="userForm.role"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="admin">Admin</option>
                <option value="organizer">Organizer</option>
                <option value="attendee">Attendee</option>
              </select>
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700"> Status * </label>
              <select
                id="status"
                v-model="userForm.status"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div v-if="!showEditUserModal">
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                type="password"
                v-model="userForm.password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter password"
              />
            </div>

            <div class="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="closeUserModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {{ showEditUserModal ? 'Update User' : 'Add User' }}
              </button>
            </div>
          </form>
        </div> -->
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle class="h-6 w-6 text-red-600" />
            </div>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Delete User</h3>
          <p class="text-sm text-gray-500 text-center mb-6">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div class="flex justify-center space-x-3">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="showDeleteModal = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="confirmDeleteUser"
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
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-vue-next'
import axios from 'axios'

// Sample data
// const userStats = ref()

const users = ref([])

const fetchingUsers = async () => {
  const token= localStorage.getItem('token')
  try {
    const response = await axios.get('http://localhost:8000/api/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users.value = response.data.users
    console.log('users fetched', users.value)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}
onMounted(() => {
  fetchingUsers()
})

// State variables
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const showAddUserModal = ref(false)
const showEditUserModal = ref(false)
const showDeleteModal = ref(false)
const userToDeleteId = ref(null)
const userForm = ref({
  id: null,
  name: '',
  email: '',
  role: 'attendee',
  status: 'active',
  password: '',
})

// Computed properties
const filteredUsers = computed(() => {
  let result = [...users.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query),
    )
  }

  // Apply role filter
  if (roleFilter.value !== 'all') {
    result = result.filter((user) => user.role === roleFilter.value)
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((user) => user.status === statusFilter.value)
  }

  return result
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
const editUser = (user) => {
  userForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    password: '',
  }
  showEditUserModal.value = true
}

const closeUserModal = () => {
  showAddUserModal.value = false
  showEditUserModal.value = false
  userForm.value = {
    id: null,
    name: '',
    email: '',
    role: 'attendee',
    status: 'active',
    password: '',
  }
}

// const saveUser = () => {
//   if (showEditUserModal.value) {
//     // Update existing user
//     const index = users.value.findIndex((u) => u.id === userForm.value.id)
//     if (index !== -1) {
//       users.value[index] = {
//         ...users.value[index],
//         name: userForm.value.name,
//         email: userForm.value.email,
//         role: userForm.value.role,
//         status: userForm.value.status,
//       }
//     }
//   } else {
//     // Add new user
//     const newId = Math.max(0, ...users.value.map((u) => u.id)) + 1
//     users.value.push({
//       id: newId,
//       name: userForm.value.name,
//       email: userForm.value.email,
//       role: userForm.value.role,
//       status: userForm.value.status,
//       joinedDate: new Date().toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric',
//       }),
//       lastActive: 'Just now',
//     })
//   }

//   closeUserModal()
// }

const suspendUser = (userId) => {
  const index = users.value.findIndex((u) => u.id === userId)
  if (index !== -1) {
    users.value[index].status = 'suspended'
  }
}

const activateUser = (userId) => {
  const index = users.value.findIndex((u) => u.id === userId)
  if (index !== -1) {
    users.value[index].status = 'active'
  }
}

const deleteUser = (userId) => {
  userToDeleteId.value = userId
  showDeleteModal.value = true
}

const confirmDeleteUser = () => {
  if (userToDeleteId.value) {
    users.value = users.value.filter((u) => u.id !== userToDeleteId.value)
    showDeleteModal.value = false
    userToDeleteId.value = null
  }
}
</script>
