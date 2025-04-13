<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div v-if="isLoading" class="text-center text-gray-500">Loading task details...</div>
    <div v-else-if="!task" class="text-center text-red-500">Failed to load task details.</div>
    
    <div v-else>
      <!-- Back button and header -->
      <div class="flex items-center mb-6">
        <RouterLink to="/organizerview/taskManagement" class="mr-4 text-gray-500 hover:text-gray-700">
          <ChevronLeft class="h-5 w-5" />
        </RouterLink>
        <h1 class="text-2xl font-bold flex-1">Task Details</h1>
      </div>

      <!-- Task status banner -->
      <div 
        :class="['mb-6 p-4 rounded-lg flex items-center justify-between', statusClasses[task.status]]"
      >
        <div class="flex items-center">
          <div :class="['h-3 w-3 rounded-full mr-2', statusDotClasses[task.status]]"></div>
          <span class="font-medium">{{ statusLabels[task.status] }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main task info -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-bold mb-4">{{ task.title }}</h2>
            <p class="text-gray-700 mb-6">{{ task.description }}</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div class="flex items-center">
                <Calendar class="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <div class="text-sm text-gray-500">Deadline</div>
                  <div class="font-medium" :class="deadlineClasses">
                    {{ formatDate(task.due_date) }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <Flag class="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <div class="text-sm text-gray-500">Priority</div>
                  <div class="font-medium" :class="priorityClasses[task.priority]">
                    {{ priorityLabels[task.priority] }}
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t pt-4">
              <h3 class="font-medium mb-3">Dependencies</h3>
              <div v-if="task.dependencies && task.dependencies.length > 0">
                <div
                  v-for="dep in task.dependencies"
                  :key="dep.id"
                  class="flex items-center mb-2 p-2 bg-gray-50 rounded"
                >
                  <div :class="['h-2 w-2 rounded-full mr-2', statusDotClasses[dep.status]]"></div>
                  <span class="flex-1">{{ task.dependencies }}</span>
                  <span :class="['text-xs px-2 py-1 rounded', statusBadgeClasses[dep.status]]">{{
                    statusLabels[dep.status]
                  }}</span>
                </div>
              </div>
              <div v-else class="text-gray-500 italic">No dependencies</div>
            </div>
          </div>

          <!-- Activity and comments -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Activity & Comments</h3>

            <div class="mb-6">
              <div class="flex mb-4">
                <textarea
                  v-model="newComment"
                  placeholder="Add a comment..."
                  class="w-full border border-gray-300 rounded-md p-2 text-sm"
                  rows="2"
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button @click="addComment" class="btn-primary">
                  <MessageSquare class="h-4 w-4 mr-1" />
                  Comment
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div v-for="(activity, index) in task.activity" :key="index" class="border-t pt-4">
                <div class="flex items-start">
                  <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <User class="h-4 w-4 text-gray-500" />
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                      <div class="font-medium">{{ activity.user }}</div>
                      <div class="text-xs text-gray-500">{{ formatDate(activity.date) }}</div>
                    </div>
                    <div v-if="activity.type === 'comment'" class="text-gray-700">
                      {{ activity.content }}
                    </div>
                    <div v-else-if="activity.type === 'status'" class="text-sm text-gray-600">
                      Changed status from
                      <span class="font-medium">{{ statusLabels[activity.from] }}</span> to
                      <span class="font-medium">{{ statusLabels[activity.to] }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Assigned team members -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Assigned Team Members</h3>
            <div class="space-y-3">
              <div v-for="member in task.assigned_to" :key="member.id" class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <User class="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <div class="font-medium">{{ member.name }}</div>
                  <div class="text-xs text-gray-500">{{ member.role }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Task details -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Task Details</h3>
            <div class="space-y-4">
            
              <div>
                <div class="text-sm text-gray-500">Created on</div>
                <div class="font-medium">{{ formatDate(task.created_at) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Last updated</div>
                <div class="font-medium">{{ formatDate(task.updated_at) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Event</div>
                <div class="font-medium">{{ task.event.title }}</div>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Attachments</h3>
            <div v-if="task.attachments && task.attachments.length > 0" class="space-y-2">
              <div
                v-for="file in task.attachments"
                :key="file.id"
                class="flex items-center p-2 border border-gray-200 rounded-md"
              >
                <FileText class="h-4 w-4 text-gray-500 mr-2" />
                <span class="flex-1 truncate">{{ file.name }}</span>
                <button class="text-gray-500 hover:text-gray-700">
                  <Download class="h-4 w-4" />
                </button>
              </div>
            </div>
            <div v-else class="text-gray-500 italic mb-4">No attachments</div>
            <button @click="uploadFile" class="w-full btn-outline flex items-center justify-center">
              <Upload class="h-4 w-4 mr-1" />
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import {
  ChevronLeft,
  Calendar,
  Flag,
  User,
  MessageSquare,
  FileText,
  Download,
  Upload,
} from 'lucide-vue-next'
import axios from 'axios'

const route = useRoute()
const task = ref(null)
const isLoading = ref(true)
const taskId = route.params.id
const token = localStorage.getItem('token')

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/organizer/tasks/details/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    task.value = response.data.task
  } catch (error) {
    console.error('Error fetching task:', error)
  } finally {
    isLoading.value = false
  }
})

const newComment = ref('')

const statusLabels = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  completed: 'Completed',
}

const statusClasses = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-50 text-blue-700',
  blocked: 'bg-red-50 text-red-700',
  completed: 'bg-green-50 text-green-700',
}

const statusDotClasses = {
  not_started: 'bg-gray-400',
  in_progress: 'bg-blue-500',
  blocked: 'bg-red-500',
  completed: 'bg-green-500',
}

const statusBadgeClasses = {
  not_started: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  blocked: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
}

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const priorityClasses = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600',
}

const deadlineClasses = computed(() => {
  if (!task.value) return ''
  const now = new Date()
  const deadline = new Date(task.due_date)
  const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

  if (task.value.status === 'completed') return 'text-gray-500'
  if (daysUntilDeadline < 0) return 'text-red-600 font-bold'
  if (daysUntilDeadline <= 3) return 'text-orange-600'
  return 'text-gray-900'
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const addComment = () => {
  if (!newComment.value.trim()) return

  task.value.activity.unshift({
    type: 'comment',
    user: 'Current User',
    date: new Date().toISOString(),
    content: newComment.value,
  })

  newComment.value = ''
}

const uploadFile = () => {
  console.log('Upload file')
}
</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center;
}

.btn-secondary {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center;
}

.btn-danger {
  @apply bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-medium flex items-center;
}

.btn-outline {
  @apply border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium;
}
</style>
