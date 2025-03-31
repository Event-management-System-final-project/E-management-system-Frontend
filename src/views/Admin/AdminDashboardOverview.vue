<template>
  <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Users" 
        :value="stats.totalUsers" 
        icon="Users" 
        trend="+12%" 
        trend-direction="up" 
        color="blue"
      />
      <StatCard 
        title="Active Events" 
        :value="stats.activeEvents" 
        icon="Calendar" 
        trend="+5%" 
        trend-direction="up" 
        color="green"
      />
      <StatCard 
        title="Pending Requests" 
        :value="stats.pendingRequests" 
        icon="Clock" 
        trend="-3%" 
        trend-direction="down" 
        color="yellow"
      />
      <StatCard 
        title="Monthly Revenue" 
        :value="formatCurrency(stats.monthlyRevenue)" 
        icon="DollarSign" 
        trend="+8%" 
        trend-direction="up" 
        color="purple"
      />
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link 
          v-for="action in quickActions" 
          :key="action.name" 
          :to="action.to"
          class="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <div :class="`w-10 h-10 rounded-full flex items-center justify-center ${action.bgColor}`">
            <component :is="action.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="ml-4">
            <h3 class="text-sm font-medium text-gray-900">{{ action.name }}</h3>
            <p class="text-xs text-gray-500">{{ action.description }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity and Pending Approvals -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">Recent Activity</h2>
          <router-link to="/admin/activity" class="text-sm text-indigo-600 hover:text-indigo-800">
            View All
          </router-link>
        </div>
        <div class="p-6">
          <div v-if="recentActivity.length === 0" class="text-center py-4 text-gray-500">
            No recent activity
          </div>
          <ul v-else class="space-y-4">
            <li v-for="(activity, index) in recentActivity" :key="index" class="flex items-start">
              <div :class="`w-8 h-8 rounded-full flex items-center justify-center ${activity.bgColor} mt-1`">
                <component :is="activity.icon" class="w-4 h-4 text-white" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-900">{{ activity.message }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pending Approvals -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">Pending Approvals</h2>
          <router-link to="/admin/event-requests" class="text-sm text-indigo-600 hover:text-indigo-800">
            View All
          </router-link>
        </div>
        <div class="p-6">
          <div v-if="pendingApprovals.length === 0" class="text-center py-4 text-gray-500">
            No pending approvals
          </div>
          <ul v-else class="space-y-4">
            <li v-for="(approval, index) in pendingApprovals" :key="index" class="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900">{{ approval.title }}</h3>
                  <p class="text-xs text-gray-500">{{ approval.type }} • Submitted by {{ approval.submittedBy }}</p>
                </div>
                <div class="flex space-x-2">
                  <button 
                    @click="approveItem(approval.id)" 
                    class="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button 
                    @click="rejectItem(approval.id)" 
                    class="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Events Overview -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-800">Events Overview</h2>
        <router-link to="/admin/event-monitoring" class="text-sm text-indigo-600 hover:text-indigo-800">
          View All Events
        </router-link>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div 
            v-for="(status, index) in eventStatusCounts" 
            :key="index"
            class="bg-gray-50 rounded-lg p-4 text-center"
          >
            <h3 class="text-sm font-medium text-gray-500">{{ status.label }}</h3>
            <p class="text-2xl font-bold" :class="status.textColor">{{ status.count }}</p>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="event in recentEvents" :key="event.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ event.title }}</div>
                  <div class="text-sm text-gray-500">{{ event.type }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ event.organizer }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ event.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
                    :class="{
                      'bg-green-100 text-green-800': event.status === 'Live',
                      'bg-blue-100 text-blue-800': event.status === 'Upcoming',
                      'bg-gray-100 text-gray-800': event.status === 'Completed',
                      'bg-red-100 text-red-800': event.status === 'Canceled'
                    }"
                  >
                    {{ event.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ event.attendees }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckSquare, 
  FileText, 
  Bell, 
  UserPlus,
  MessageSquare,
  Settings,
  PlusCircle,
  AlertCircle
} from 'lucide-vue-next';
import StatCard from '@/components/StatCard.vue';

// Sample data
const stats = ref({
  totalUsers: 2458,
  activeEvents: 42,
  pendingRequests: 18,
  monthlyRevenue: 28750
});

const quickActions = [
  { 
    name: 'Approve Event Request', 
    description: 'Review and approve pending event requests', 
    to: '/admin/event-requests', 
    icon: CheckSquare, 
    bgColor: 'bg-green-600' 
  },
  { 
    name: 'Assign Team', 
    description: 'Assign teams to upcoming events', 
    to: '/admin/team-assignment', 
    icon: UserPlus, 
    bgColor: 'bg-blue-600' 
  },
  { 
    name: 'Send Announcement', 
    description: 'Create and send system announcements', 
    to: '/admin/announcements', 
    icon: Bell, 
    bgColor: 'bg-purple-600' 
  }
];

const recentActivity = [
  { 
    message: 'John Doe approved "Tech Conference 2023"', 
    time: '5 minutes ago', 
    icon: CheckSquare, 
    bgColor: 'bg-green-600' 
  },
  { 
    message: 'Sarah Johnson assigned Team Alpha to "Music Festival"', 
    time: '1 hour ago', 
    icon: UserPlus, 
    bgColor: 'bg-blue-600' 
  },
  { 
    message: 'New event request submitted: "Design Workshop"', 
    time: '3 hours ago', 
    icon: PlusCircle, 
    bgColor: 'bg-indigo-600' 
  },
  { 
    message: 'System announcement sent: "Platform Maintenance"', 
    time: '5 hours ago', 
    icon: Bell, 
    bgColor: 'bg-yellow-600' 
  }
];

const pendingApprovals = [
  { 
    id: 1, 
    title: 'Tech Conference 2023', 
    type: 'Event Request', 
    submittedBy: 'John Doe' 
  },
  { 
    id: 2, 
    title: 'Music Festival', 
    type: 'Content Moderation', 
    submittedBy: 'Sarah Johnson' 
  },
  { 
    id: 3, 
    title: 'Design Workshop', 
    type: 'Event Request', 
    submittedBy: 'Michael Brown' 
  }
];

const eventStatusCounts = [
  { label: 'Upcoming', count: 28, textColor: 'text-blue-600' },
  { label: 'Live', count: 14, textColor: 'text-green-600' },
  { label: 'Completed', count: 156, textColor: 'text-gray-600' },
  { label: 'Canceled', count: 7, textColor: 'text-red-600' }
];

const recentEvents = [
  { 
    id: 1, 
    title: 'Tech Conference 2023', 
    type: 'Conference', 
    organizer: 'John Doe', 
    date: 'Nov 15, 2023', 
    status: 'Upcoming', 
    attendees: 250 
  },
  { 
    id: 2, 
    title: 'Music Festival', 
    type: 'Festival', 
    organizer: 'Sarah Johnson', 
    date: 'Dec 10, 2023', 
    status: 'Upcoming', 
    attendees: 1500 
  },
  { 
    id: 3, 
    title: 'Product Launch', 
    type: 'Corporate', 
    organizer: 'Michael Brown', 
    date: 'Oct 25, 2023', 
    status: 'Live', 
    attendees: 120 
  },
  { 
    id: 4, 
    title: 'Design Workshop', 
    type: 'Workshop', 
    organizer: 'Emily Davis', 
    date: 'Oct 5, 2023', 
    status: 'Completed', 
    attendees: 45 
  },
  { 
    id: 5, 
    title: 'Charity Gala', 
    type: 'Fundraiser', 
    organizer: 'Robert Wilson', 
    date: 'Sep 30, 2023', 
    status: 'Canceled', 
    attendees: 0 
  }
];

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(value);
};

// Action functions
const approveItem = (id) => {
  console.log(`Approving item ${id}`);
  // Implement approval logic
};

const rejectItem = (id) => {
  console.log(`Rejecting item ${id}`);
  // Implement rejection logic
};
</script>

