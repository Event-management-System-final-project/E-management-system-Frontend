<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  ClipboardList,
  X,
  DollarSign,
  Lock,
  Eye,
} from 'lucide-vue-next'
import axios from 'axios'

//Fetching dropdown events
const events = ref()
onMounted(async () => {
  try {
    const token = localStorage.getItem('token') // Get the token from local storage
    const response = await axios.get('http://localhost:8000/api/organizer/events/', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    })
    events.value = response.data.events
    console.log('Events fetched:', response.data)
  } catch (error) {
    console.error('Error fetching events:', error)
  }
})
// Sample tasks data

// State variables
const tasks = ref([])
const selectedEventId = ref('')
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')
const showTaskModal = ref(false)
const editingTask = ref(null)
const taskForm = ref({
  title: '',
  description: '',
  category: 'venue',
  assigned_to: '',
  dueDate: '',
  status: 'not_started',
  priority: 'low',
  budget: 0,
  budgetSpent: 0,
  dependencies: [],
})

//fetching team members

const teamMembers = ref([])

const fetchTeamMembers = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/organizer/members', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    teamMembers.value = response.data.members
    console.log('Team members fetched:', teamMembers.value)
  } catch (error) {
    console.error('Error fetching team members:', error)
  }
}

// Fetch team members on component mount
onMounted(() => {
  fetchTeamMembers()
})

onMounted(() => {
  const savedEventId = localStorage.getItem('selectedEventId')
  if (savedEventId) {
    selectedEventId.value = savedEventId
    fetchTasks()
  }
})

// Fetch tasks data
//const assignedTo = ref('')
const fetchTasks = async () => {
  if (!selectedEventId.value) return [];
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `http://localhost:8000/api/organizer/events/tasks/${selectedEventId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Ensure tasks include members
    tasks.value = response.data.tasks.map((task) => ({
      ...task,
      members: task.members || [], // Ensure members array exists
    }));
    console.log('Tasks fetched:', tasks.value);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

watch(selectedEventId, (newValue) => {
  if (newValue) {
    localStorage.setItem('selectedEventId', newValue) // Save to localStorage
    fetchTasks()
  }
})

// Computed properties
const eventTasks = computed(() => {
  if (!selectedEventId.value) return []
  return tasks.value.filter((task) => task.event_id === parseInt(selectedEventId.value))
})

const filteredTasks = computed(() => {
  let result = [...eventTasks.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assigned_to.toLowerCase().includes(query),
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'blocked') {
      result = result.filter((task) => isTaskBlocked(task))
    } else {
      result = result.filter((task) => task.status === statusFilter.value && !isTaskBlocked(task))
    }
  }

  // Apply category filter

  return result
})

const completedCount = computed(
  () => eventTasks.value.filter((task) => task.status === 'completed').length,
)

const inProgressCount = computed(
  () => eventTasks.value.filter((task) => task.status === 'in_progress').length,
)

const overdueCount = computed(
  () => eventTasks.value.filter((task) => isOverdue(task) && task.status !== 'completed').length,
)

const selectedCount = computed(() => filteredTasks.value.filter((task) => task.selected).length)

const allSelected = computed(
  () => filteredTasks.value.length > 0 && filteredTasks.value.every((task) => task.selected),
)

const totalBudget = computed(() => eventTasks.value.reduce((sum, task) => sum + task.budget, 0))

const totalSpent = computed(() =>
  eventTasks.value.reduce((sum, task) => sum + (task.budget_spent || 0), 0),
)

const budgetPercentage = computed(() =>
  totalBudget.value > 0 ? (totalSpent.value / totalBudget.value) * 100 : 0,
)

const availableDependencies = computed(() => {
  if (!selectedEventId.value) return []

  // Get all tasks for this event
  const eventTasksList = tasks.value.filter(
    (task) => task.event_id === parseInt(selectedEventId.value),
  )

  // If we're editing a task, filter out the current task and any tasks that depend on it
  // to avoid circular dependencies
  if (editingTask.value) {
    return eventTasksList.filter((task) => {
      // Don't include the task itself
      if (task.id === editingTask.value.id) return false

      // Don't include tasks that would create circular dependencies
      return !wouldCreateCircularDependency(editingTask.value.id, task.id)
    })
  }

  return eventTasksList
})

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return 'No due date' // Fallback for missing dates
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString(undefined, options)
}

const isOverdue = (task) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.due_date)
  return dueDate < today
}

const getDaysRemaining = (task) => {
  if (!task.due_date) return 'No due date' // Fallback for missing dates

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.due_date)

  if (isNaN(dueDate.getTime())) return 'Invalid Date' // Handle invalid dates

  if (task.status === 'completed') return 'Completed'

  if (dueDate < today) {
    const days = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))
    return `${days} ${days === 1 ? 'day' : 'days'} overdue`
  } else if (dueDate.getTime() === today.getTime()) {
    return 'Due today'
  } else {
    const days = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    return `${days} ${days === 1 ? 'day' : 'days'} left`
  }
}

const formatStatus = (status) => {
  switch (status) {
    case 'not_started':
      return 'Not Started'
    case 'in_progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
    default:
      return status
  }
}

const getTaskTitle = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId)
  return task ? task.title : `Task #${taskId}`
}

const isTaskCompleted = (taskId) => {
  const task = tasks.value.find((t) => t.id === taskId)
  return task && task.status === 'completed'
}

const isTaskBlocked = (task) => {
  if (!task.dependencies || task.dependencies.length === 0) return false

  // Check if any dependency is not completed
  return task.dependencies.some((depId) => !isTaskCompleted(depId))
}

// Check if adding a dependency would create a circular dependency
const wouldCreateCircularDependency = (taskId, dependencyId) => {
  // Get the dependency task
  const dependencyTask = tasks.value.find((t) => t.id === dependencyId)
  if (!dependencyTask) return false

  // If the dependency directly depends on the task, it would create a circular dependency
  if (dependencyTask.dependencies && dependencyTask.dependencies.includes(taskId)) return true

  // Check if any of the dependency's dependencies would create a circular dependency
  if (dependencyTask.dependencies && dependencyTask.dependencies.length > 0) {
    return dependencyTask.dependencies.some((depId) => wouldCreateCircularDependency(taskId, depId))
  }

  return false
}

// Action functions
const toggleSelectAll = () => {
  const newValue = !allSelected.value
  filteredTasks.value.forEach((task) => {
    const originalTask = tasks.value.find((t) => t.id === task.id)
    if (originalTask) {
      originalTask.selected = newValue
    }
  })
}

const openAddTaskModal = () => {
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    category: '',
    assigned_to: '',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'not_started',
    priority: 'medium',
    budget: 0,
    budgetSpent: 0,
    dependencies: [],
  }
  showTaskModal.value = true
}

const openEditTaskModal = (task) => {
  editingTask.value = task
  taskForm.value = {
    title: task.title,
    description: task.description,
    category: task.category,
    assigned_to: task.assigned_to,
    dueDate: task.due_date,
    status: task.status,
    priority: task.priority,
    budget: task.budget,
    budgetSpent: task.budget_spent || 0,
    dependencies: [...(task.dependencies || [])],
  }
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
}

const saveTask = async () => {
  // Convert string inputs to numbers for budget fields
  const budget = parseFloat(taskForm.value.budget) || 0
  const budgetSpent = parseFloat(taskForm.value.budgetSpent) || 0

  // const taskData = {
  //   event_id: selectedEventId.value, // Ensure this is correct
  //   title: taskForm.value.title,
  //   description: taskForm.value.description,
  //   category: taskForm.value.category,
  //   assigned_to: taskForm.value.assigned_to,
  //   due_date: taskForm.value.dueDate, // Ensure format is YYYY-MM-DD
  //   status: taskForm.value.status.replace('-', '_'), // Replace hyphen with underscore
  //   priority: taskForm.value.priority,
  //   budget: budget,
  //   budget_spent: budgetSpent,
  //   dependencies: taskForm.value.dependencies,
  // }

  try {
    if (editingTask.value) {
      // Update existing task
      const taskData = {
    task_id: editingTask.value.id,
    title: taskForm.value.title,
    description: taskForm.value.description,
    category: taskForm.value.category,
    assigned_to: taskForm.value.assigned_to,
    due_date: taskForm.value.dueDate, // Ensure format is YYYY-MM-DD
    status: taskForm.value.status.replace('-', '_'), // Replace hyphen with underscore
    priority: taskForm.value.priority,
    budget: budget,
    budget_spent: budgetSpent,
    dependencies: taskForm.value.dependencies,
  }
      const response = await axios.put(
        'http://localhost:8000/api/organizer/tasks/update',
        taskData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      console.log('Task updated:', response.data)

      // Update the task in the tasks array
      const index = tasks.value.findIndex((task) => task.id === editingTask.value.id)
      if (index !== -1) {
        tasks.value[index] = response.data.task // Replace the updated task
      }
    } else {
      // Create new task

 taskData = {
    event_id: selectedEventId.value, // Ensure this is correct
    title: taskForm.value.title,
    description: taskForm.value.description,
    category: taskForm.value.category,
    assigned_to: taskForm.value.assigned_to,
    due_date: taskForm.value.dueDate, // Ensure format is YYYY-MM-DD
    status: taskForm.value.status.replace('-', '_'), // Replace hyphen with underscore
    priority: taskForm.value.priority,
    budget: budget,
    budget_spent: budgetSpent,
    dependencies: taskForm.value.dependencies,
  }

      const response = await axios.post(
        'http://localhost:8000/api/organizer/tasks/create',
        taskData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token in the request headers
          },
        },
      )
      console.log('Task created:', response.data)

      // Add the new task to the tasks array
      tasks.value.push(response.data.task)
    }
  } catch (error) {
    console.error('Error saving task:', error.response?.data || error.message)
  }

  closeTaskModal()
}

const markAsComplete = (taskId) => {
  const index = tasks.value.findIndex((t) => t.id === taskId)
  if (index !== -1 && !isTaskBlocked(tasks.value[index])) {
    tasks.value[index].status = 'completed'
  }
}

const deleteTask = (taskId) => {
  // Check if any tasks depend on this one
  const dependentTasks = tasks.value.filter(
    (task) => task.dependencies && task.dependencies.includes(taskId),
  )

  if (dependentTasks.length > 0) {
    const taskNames = dependentTasks.map((t) => `"${t.title}"`).join(', ')
    alert(`Cannot delete this task because the following tasks depend on it: ${taskNames}`)
    return
  }

  if (confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter((t) => t.id !== taskId)
  }
}

const markSelectedAsComplete = () => {
  tasks.value.forEach((task) => {
    if (task.selected && !isTaskBlocked(task)) {
      task.status = 'completed'
      task.selected = false
    }
  })
}

const deleteSelected = () => {
  // Check if any selected tasks have dependencies
  const selectedTaskIds = tasks.value.filter((task) => task.selected).map((task) => task.id)
  const dependentTasks = tasks.value.filter(
    (task) =>
      !task.selected && // Not in the selection
      task.dependencies && // Has dependencies
      task.dependencies.some((depId) => selectedTaskIds.includes(depId)), // Depends on a selected task
  )

  if (dependentTasks.length > 0) {
    const taskNames = dependentTasks.map((t) => `"${t.title}"`).join(', ')
    alert(`Cannot delete these tasks because the following tasks depend on them: ${taskNames}`)
    return
  }

  if (confirm(`Are you sure you want to delete ${selectedCount.value} tasks?`)) {
    tasks.value = tasks.value.filter((task) => !task.selected)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header with event selector -->
    <div class="px-6 py-5 border-b border-gray-200">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 class="text-2xl font-bold text-gray-800">Event Tasks</h2>
        <div class="w-full md:w-64">
          <select
            v-model="selectedEventId"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select an event</option>
            <option v-for="event in events" :key="event.id" :value="event.id">
              {{ event.title }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="!selectedEventId" class="p-12 text-center">
      <div class="flex flex-col items-center">
        <ClipboardList class="h-16 w-16 text-gray-400 mb-4" />
        <p class="text-lg font-medium mb-1">No event selected</p>
        <p class="text-sm text-gray-500 mb-4">Please select an event to manage its tasks</p>
      </div>
    </div>

    <template v-else>
      <!-- Task stats -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-wrap gap-3">
          <div class="bg-blue-50 px-4 py-2 rounded-lg">
            <p class="text-sm text-blue-600 font-medium">Total Tasks</p>
            <p class="text-2xl font-bold text-blue-700">{{ filteredTasks.length }}</p>
          </div>
          <div class="bg-green-50 px-4 py-2 rounded-lg">
            <p class="text-sm text-green-600 font-medium">Completed</p>
            <p class="text-2xl font-bold text-green-700">{{ completedCount }}</p>
          </div>
          <div class="bg-yellow-50 px-4 py-2 rounded-lg">
            <p class="text-sm text-yellow-600 font-medium">In Progress</p>
            <p class="text-2xl font-bold text-yellow-700">{{ inProgressCount }}</p>
          </div>
          <div class="bg-red-50 px-4 py-2 rounded-lg">
            <p class="text-sm text-red-600 font-medium">Overdue</p>
            <p class="text-2xl font-bold text-red-700">{{ overdueCount }}</p>
          </div>
          <div class="bg-purple-50 px-4 py-2 rounded-lg">
            <p class="text-sm text-purple-600 font-medium">Total Budget</p>
            <p class="text-2xl font-bold text-purple-700">${{ totalBudget.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <!-- Filters and add task button -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              v-model="searchQuery"
            />
          </div>
          <div class="flex flex-wrap gap-3">
            <select
              v-model="statusFilter"
              class="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>

            <button
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="openAddTaskModal"
            >
              <Plus class="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Tasks list -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    :checked="allSelected"
                    @change="toggleSelectAll"
                  />
                  <span class="ml-2">Task</span>
                </div>
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assigned To
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Due Date
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Budget
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Dependencies
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredTasks.length === 0">
              <td colspan="8" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <ClipboardList class="h-12 w-12 text-gray-400 mb-4" />
                  <p class="text-lg font-medium mb-1">No tasks found</p>
                  <p class="text-sm text-gray-500 mb-4">
                    {{
                      searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                        ? 'Try adjusting your search or filters'
                        : 'Add your first task to get started'
                    }}
                  </p>
                  <button
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="openAddTaskModal"
                  >
                    <Plus class="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                </div>
              </td>
            </tr>
            <tr v-for="task in filteredTasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    v-model="task.selected"
                  />
                  <div class="ml-4">
                    <div class="flex items-center">
                      <span
                        v-if="isTaskBlocked(task)"
                        class="mr-2 text-orange-500"
                        title="This task is blocked by dependencies"
                      >
                        <Lock class="h-4 w-4" />
                      </span>
                      <span
                        class="text-sm font-medium text-gray-900"
                        :class="{ 'line-through': task.status === 'completed' }"
                      >
                        {{ task.title }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-500 max-w-md truncate">
                      {{ task.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-purple-100 text-purple-800': task.category === 'venue',
                    'bg-blue-100 text-blue-800': task.category === 'marketing',
                    'bg-yellow-100 text-yellow-800': task.category === 'logistics',
                    'bg-green-100 text-green-800': task.category === 'catering',
                    'bg-indigo-100 text-indigo-800': task.category === 'speakers',
                    'bg-pink-100 text-pink-800': task.category === 'registration',
                  }"
                >
                  {{ task.category.charAt(0).toUpperCase() + task.category.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="task.members && task.members.length > 0" class="flex flex-wrap gap-2">
                  <span
                    v-for="member in task.members"
                    :key="member.user.id"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ member.user.firstName }} {{ member.user.lastName }}
                  </span>
                </div>
                <div v-else class="text-sm text-gray-500">No users assigned</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm"
                  :class="{
                    'text-red-600 font-medium': isOverdue(task) && task.status !== 'completed',
                    'text-gray-500': !isOverdue(task) || task.status === 'completed',
                  }"
                >
                  {{ formatDate(task.due_date) }}
                </div>
                <div class="text-xs text-gray-500">{{ getDaysRemaining(task) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ task.budget.toFixed(2) }}</div>
                <div class="text-xs text-gray-500">
                  {{
                    task.budget_spent ? `$${task.budget_spent.toFixed(2)} spent` : 'No expenses yet'
                  }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="task.dependencies && task.dependencies.length > 0">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="depId in task.dependencies"
                      :key="depId"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      :class="{ 'bg-red-100 text-red-800': !isTaskCompleted(depId) }"
                    >
                      {{ getTaskTitle(depId) }}
                    </span>
                  </div>
                </div>
                <div v-else class="text-xs text-gray-500">No dependencies</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-gray-100 text-gray-800': task.status === 'not_started',
                    'bg-yellow-100 text-yellow-800': task.status === 'in_progress',
                    'bg-green-100 text-green-800': task.status === 'completed',
                    'bg-orange-100 text-orange-800': isTaskBlocked(task),
                  }"
                >
                  {{ isTaskBlocked(task) ? 'Blocked' : formatStatus(task.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <RouterLink
                    :to="`/organizerview/taskManagement/${task.id}`"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    <Eye class="h-5 w-5" />
                  </RouterLink>
                  <button
                    class="text-blue-600 hover:text-blue-900"
                    @click="openEditTaskModal(task)"
                    title="Edit Task"
                  >
                    <Edit class="h-5 w-5" />
                  </button>
                  <button
                    v-if="task.status !== 'completed' && !isTaskBlocked(task)"
                    class="text-green-600 hover:text-green-900"
                    @click="markAsComplete(task.id)"
                    title="Mark as Complete"
                  >
                    <CheckCircle class="h-5 w-5" />
                  </button>
                  <button
                    v-if="isTaskBlocked(task)"
                    class="text-orange-600 hover:text-orange-900 cursor-not-allowed opacity-50"
                    title="Task is blocked by dependencies"
                    disabled
                  >
                    <Lock class="h-5 w-5" />
                  </button>
                  <button
                    class="text-red-600 hover:text-red-900"
                    @click="deleteTask(task.id)"
                    title="Delete Task"
                  >
                    <Trash2 class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Budget summary -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <div class="text-sm text-gray-700">
              <span class="font-medium">Total Budget:</span> ${{ totalBudget.toFixed(2) }}
            </div>
            <div class="text-sm text-gray-700">
              <span class="font-medium">Total Spent:</span> ${{ totalSpent.toFixed(2) }}
            </div>
            <div class="text-sm text-gray-700">
              <span class="font-medium">Remaining:</span> ${{
                (totalBudget - totalSpent).toFixed(2)
              }}
            </div>
          </div>
          <div class="mt-4 md:mt-0">
            <div class="w-full md:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                :class="{
                  'bg-green-500': budgetPercentage < 70,
                  'bg-yellow-500': budgetPercentage >= 70 && budgetPercentage < 90,
                  'bg-red-500': budgetPercentage >= 90,
                }"
                :style="{ width: `${Math.min(budgetPercentage, 100)}%` }"
              ></div>
            </div>
            <div class="text-xs text-gray-500 mt-1 text-right">
              {{ budgetPercentage.toFixed(0) }}% of budget used
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk actions -->
      <div v-if="selectedCount > 0" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            {{ selectedCount }} {{ selectedCount === 1 ? 'task' : 'tasks' }} selected
          </div>
          <div class="flex space-x-2">
            <button
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              @click="markSelectedAsComplete"
            >
              <CheckCircle class="h-4 w-4 mr-1" />
              Mark Complete
            </button>
            <button
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="deleteSelected"
            >
              <Trash2 class="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Add/Edit Task Modal -->
    <div
      v-if="showTaskModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900">
              {{ editingTask ? 'Edit Task' : 'Add New Task' }}
            </h3>
            <button @click="closeTaskModal" class="text-gray-400 hover:text-gray-500">
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveTask" class="space-y-4">
            <div>
              <label for="task-title" class="block text-sm font-medium text-gray-700">
                Task Title *
              </label>
              <input
                id="task-title"
                type="text"
                v-model="taskForm.title"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label for="task-description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="task-description"
                v-model="taskForm.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter task description"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="task-category" class="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  id="task-category"
                  type="text"
                  v-model="taskForm.category"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Venue, Marketing, Registration...."
                />
              </div>

              <div>
                <label for="task-assignee" class="block text-sm font-medium text-gray-700">
                  Assignee * to
                </label>
                <input
                  id="task-assignee"
                  type="text"
                  v-model="taskForm.assigned_to"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Assign the task to...."
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="task-due-date" class="block text-sm font-medium text-gray-700">
                  Due Date *
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  v-model="taskForm.dueDate"
                  re
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label for="task-status" class="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="task-status"
                  v-model="taskForm.status"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="task-budget" class="block text-sm font-medium text-gray-700">
                  Budget Allocation ($) *
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="task-budget"
                    type="number"
                    min="0"
                    step="0.01"
                    v-model="taskForm.budget"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label for="task-budget-spent" class="block text-sm font-medium text-gray-700">
                  Budget Spent ($)
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="task-budget-spent"
                    type="number"
                    min="0"
                    step="0.01"
                    v-model="taskForm.budgetSpent"
                    class="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label for="task-dependencies" class="block text-sm font-medium text-gray-700">
                Dependencies
              </label>
              <div class="mt-1 border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
                <div v-if="availableDependencies.length === 0" class="text-sm text-gray-500 p-2">
                  No available tasks to set as dependencies
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="task in availableDependencies"
                    :key="task.id"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :id="`dep-${task.id}`"
                      :value="task.id"
                      v-model="taskForm.dependencies"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label :for="`dep-${task.id}`" class="ml-2 text-sm text-gray-700">
                      {{ task.title }}
                      <span
                        class="ml-1 text-xs"
                        :class="{
                          'text-green-600': task.status === 'completed',
                          'text-yellow-600': task.status === 'in-progress',
                          'text-gray-600': task.status === 'not-started',
                        }"
                      >
                        ({{ formatStatus(task.status) }})
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Select tasks that must be completed before this task can begin
              </p>
            </div>

            <div>
              <label for="task-priority" class="block text-sm font-medium text-gray-700">
                Priority *
              </label>
              <div class="mt-1 flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="taskForm.priority"
                    value="low"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Low</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="taskForm.priority"
                    value="medium"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">Medium</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="taskForm.priority"
                    value="high"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">High</span>
                </label>
              </div>
            </div>

            <div class="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="closeTaskModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ editingTask ? 'Update Task' : 'Add Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
