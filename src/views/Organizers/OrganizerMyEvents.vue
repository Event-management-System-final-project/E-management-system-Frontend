<template>
    <div class="p-6 max-w-7xl mx-auto">
      <!-- Back button and header -->
      <div class="flex items-center mb-6">
        <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
          <ChevronLeft class="h-5 w-5" />
        </button>
        <h1 class="text-2xl font-bold flex-1">Task Details</h1>
        <div class="flex space-x-2">
          <button @click="editTask" class="btn-secondary">
            <Edit2 class="h-4 w-4 mr-1" />
            Edit
          </button>
          <button @click="deleteTask" class="btn-danger">
            <Trash2 class="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
  
      <!-- Task status banner -->
      <div :class="[
        'mb-6 p-4 rounded-lg flex items-center justify-between',
        statusClasses[task.status]
      ]">
        <div class="flex items-center">
          <div :class="[
            'h-3 w-3 rounded-full mr-2',
            statusDotClasses[task.status]
          ]"></div>
          <span class="font-medium">{{ statusLabels[task.status] }}</span>
        </div>
        <div class="flex items-center">
          <span v-if="task.status !== 'completed'" class="mr-2">Update status:</span>
          <select 
            v-if="task.status !== 'completed'" 
            v-model="newStatus" 
            @change="updateStatus" 
            class="bg-white border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option v-for="(label, status) in statusLabels" :key="status" :value="status">
              {{ label }}
            </option>
          </select>
          <div v-else class="flex items-center text-green-700">
            <CheckCircle class="h-4 w-4 mr-1" />
            Completed on {{ formatDate(task.completedDate) }}
          </div>
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
                    {{ formatDate(task.deadline) }}
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
                <div v-for="dep in task.dependencies" :key="dep.id" class="flex items-center mb-2 p-2 bg-gray-50 rounded">
                  <div :class="[
                    'h-2 w-2 rounded-full mr-2',
                    statusDotClasses[dep.status]
                  ]"></div>
                  <span class="flex-1">{{ dep.title }}</span>
                  <span :class="[
                    'text-xs px-2 py-1 rounded',
                    statusBadgeClasses[dep.status]
                  ]">{{ statusLabels[dep.status] }}</span>
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
                      Changed status from <span class="font-medium">{{ statusLabels[activity.from] }}</span> to 
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
              <div v-for="member in task.assignedTo" :key="member.id" class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <User class="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <div class="font-medium">{{ member.name }}</div>
                  <div class="text-xs text-gray-500">{{ member.role }}</div>
                </div>
              </div>
            </div>
            <button @click="assignTeamMember" class="mt-4 w-full btn-outline flex items-center justify-center">
              <UserPlus class="h-4 w-4 mr-1" />
              Assign Team Member
            </button>
          </div>
  
          <!-- Task details -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Task Details</h3>
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-500">Created by</div>
                <div class="font-medium">{{ task.createdBy }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Created on</div>
                <div class="font-medium">{{ formatDate(task.createdDate) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Last updated</div>
                <div class="font-medium">{{ formatDate(task.updatedDate) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Event</div>
                <div class="font-medium">{{ task.event.name }}</div>
              </div>
            </div>
          </div>
  
          <!-- Attachments -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-bold mb-4">Attachments</h3>
            <div v-if="task.attachments && task.attachments.length > 0" class="space-y-2">
              <div v-for="file in task.attachments" :key="file.id" 
                class="flex items-center p-2 border border-gray-200 rounded-md">
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
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { 
    ChevronLeft, Edit2, Trash2, Calendar, Flag, CheckCircle, 
    User, UserPlus, MessageSquare, FileText, Download, Upload 
  } from 'lucide-vue-next';
  
  // Mock data - in a real app, this would come from an API
  const task = ref({
    id: 'task-123',
    title: 'Book catering service',
    description: 'Research and book a catering service for the conference. Make sure to consider dietary restrictions and budget constraints. The catering should include breakfast, lunch, and coffee breaks.',
    status: 'in-progress',
    priority: 'high',
    deadline: '2025-04-15T00:00:00Z',
    createdDate: '2025-03-01T10:30:00Z',
    updatedDate: '2025-03-10T14:45:00Z',
    completedDate: null,
    createdBy: 'Sarah Johnson',
    event: {
      id: 'event-456',
      name: 'Annual Tech Conference 2025'
    },
    assignedTo: [
      { id: 'user-1', name: 'Michael Chen', role: 'Event Coordinator' },
      { id: 'user-2', name: 'Jessica Williams', role: 'Logistics Manager' }
    ],
    dependencies: [
      { id: 'task-121', title: 'Finalize event budget', status: 'completed' },
      { id: 'task-122', title: 'Confirm attendee count', status: 'in-progress' }
    ],

    attachments: [
      { id: 'file-1', name: 'catering_requirements.pdf' },
      { id: 'file-2', name: 'vendor_comparison.xlsx' }
    ],
    
    activity: [
      { 
        type: 'comment', 
        user: 'Jessica Williams', 
        date: '2025-03-10T14:45:00Z',
        content: 'I\'ve contacted three vendors and am waiting for their quotes. Will update by tomorrow.'
      },
      { 
        type: 'status', 
        user: 'Michael Chen', 
        date: '2025-03-05T09:20:00Z',
        from: 'not-started',
        to: 'in-progress'
      },
      { 
        type: 'comment', 
        user: 'Sarah Johnson', 
        date: '2025-03-01T10:30:00Z',
        content: 'Please make sure to check if they can accommodate vegan and gluten-free options.'
      }
    ]
  });
  
  // Form state
  const newStatus = ref(task.value.status);
  const newComment = ref('');
  
  // Status configurations
  const statusLabels = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'blocked': 'Blocked',
    'completed': 'Completed'
  };
  
  const statusClasses = {
    'not-started': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-50 text-blue-700',
    'blocked': 'bg-red-50 text-red-700',
    'completed': 'bg-green-50 text-green-700'
  };
  
  const statusDotClasses = {
    'not-started': 'bg-gray-400',
    'in-progress': 'bg-blue-500',
    'blocked': 'bg-red-500',
    'completed': 'bg-green-500'
  };
  
  const statusBadgeClasses = {
    'not-started': 'bg-gray-100 text-gray-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    'blocked': 'bg-red-100 text-red-700',
    'completed': 'bg-green-100 text-green-700'
  };
  
  // Priority configurations
  const priorityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High'
  };
  
  const priorityClasses = {
    'low': 'text-green-600',
    'medium': 'text-yellow-600',
    'high': 'text-red-600'
  };
  
  // Computed properties
  const deadlineClasses = computed(() => {
    const now = new Date();
    const deadline = new Date(task.value.deadline);
    const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    if (task.value.status === 'completed') return 'text-gray-500';
    if (daysUntilDeadline < 0) return 'text-red-600 font-bold';
    if (daysUntilDeadline <= 3) return 'text-orange-600';
    return 'text-gray-900';
  });
  
  // Methods
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const updateStatus = () => {
    const oldStatus = task.value.status;
    task.value.status = newStatus.value;
    
    if (newStatus.value === 'completed') {
      task.value.completedDate = new Date().toISOString();
    }
    
    // Add activity
    task.value.activity.unshift({
      type: 'status',
      user: 'Current User', // In a real app, this would be the logged-in user
      date: new Date().toISOString(),
      from: oldStatus,
      to: newStatus.value
    });
  };
  
  const addComment = () => {
    if (!newComment.value.trim()) return;
    
    task.value.activity.unshift({
      type: 'comment',
      user: 'Current User', // In a real app, this would be the logged-in user
      date: new Date().toISOString(),
      content: newComment.value
    });
    
    newComment.value = '';
  };
  
  const goBack = () => {
    // In a real app, this would navigate back to the tasks list
    console.log('Navigate back');
  };
  
  const editTask = () => {
    // In a real app, this would open the edit task form
    console.log('Edit task');
  };
  
  const deleteTask = () => {
    // In a real app, this would show a confirmation dialog
    console.log('Delete task');
  };
  
  const assignTeamMember = () => {
    // In a real app, this would open a team member selection dialog
    console.log('Assign team member');
  };
  
  const uploadFile = () => {
    // In a real app, this would open a file upload dialog
    console.log('Upload file');
  };
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