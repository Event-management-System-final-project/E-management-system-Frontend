import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import PublicEventsView from '@/views/PublicEventsView.vue'
import EventDetailsView from '@/views/EventDetailsView.vue'

//Admin Routes

import AdminDashboard from '@/views/AdminDashboard.vue'
import AdminDashboardOverview from '@/views/Admin/AdminDashboardOverview.vue'
import UserManagement from '@/views/Admin/UserManagement.vue'
import EventRequests from '@/views/Admin/EventRequests.vue'
import TeamAssignment from '@/views/Admin/TeamAssignment.vue'
import TeamManagement from '@/views/Admin/TeamManagement.vue'
import EventMonitoring from '@/views/Admin/EventMonitoring.vue'
import SystemAnnouncements from '@/views/Admin/SystemAnnouncements.vue'
import ContentModeration from '@/views/Admin/ContentModeration.vue'
import RevenueManagement from '@/views/Admin/RevenueManagement.vue'
import PlatformBranding from '@/views/Admin/PlatformBranding.vue'
import Settings from '@/views/Admin/Settings.vue'
import Feedback from '@/views/Admin/Feedback.vue'

// User routes
import UserView from '@/views/UserView.vue'
import UserEvents from '@/views/User/UserEvents.vue'  
import UserEventRequest from '@/views/User/UserEventRequest.vue'
// import UserProfile from '@/views/User/UserProfile.vue'
// import UserSettings from '@/views/User/UserSettings.vue'
// import UserNotifications from '@/views/User/UserNotifications.vue'
// import UserFeedback from '@/views/User/UserFeedback.vue'
import UserOverview from '@/views/User/UserOverview.vue'
import UserTickets from '@/views/User/UserTickets.vue'

// Layouts
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/publicEvents',
      name: 'PublicEvents',
      component: PublicEventsView,
    },
    {
      path: '/publicEvents/:id',
      name: 'EventDetails',
      component: EventDetailsView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: SignupView,
    },
    {
      path: '/forgotpassword',
      name: 'ForgotPassword',
      component: () => import('@/views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('@/views/ResetPassword.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
    },
    {
      path: '/userview',
      name: 'User',
      component: UserView,
      meta: {
        requiresAuth: true,
      },
    },

    // Protected routes

    {
      path: '/organizerview',
      component: () => import('@/views/OrganizersView.vue'),
      meta: {
        requiresAuth: true,
      },
      redirect: { name: 'organizer-dashboard' }, // Add this line to redirect to dashboard
      children: [
        {
          path: '',
          name: 'organizer-dashboard',
          component: () => import('@/views/Organizers/OrganizerDashboard.vue'),
        },
        {
          path: 'events/create',
          name: 'create-event',
          component: () => import('@/views/Organizers/OrganizerCreateEvents.vue'),
        },
        {
          path: 'events',
          name: 'my-events',
          component: () => import('@/views/Organizers/OrganizerMyEvents.vue'),
        },

        {
          path: 'taskManagement',
          name: 'task-management',
          component: () => import('@/views/Organizers/TaskManagement.vue'),
        },
        {
          path: 'taskManagement/:id',
          name: 'task-details',
          component: () => import('@/views/Organizers/TaskDetails.vue'),
        },
        {
          path: 'teamManagement',
          name: 'team-management',
          component: () => import('@/views/Organizers/TeamManagement.vue'),
        },

        // ... other organizer routes
      ],
    },

    // Protected User routes
    {
      path: '/user-dashboard',
      component: UserView,
      children: [
        {
          path: '',
          name: 'UserOverview',
          component: UserOverview,
        },
        {
          path: 'events',
          name: 'UserEvents',
          component: UserEvents,
        },
        {
          path: 'event-request',
          name: 'UserEventRequest',
          component: UserEventRequest,
        },
        {
          path: 'tickets',
          name: 'UserTickets',
          component: UserTickets,
        },
      ],
    },

    //Protected Admin routes
    {
      path: '/AdminDashboard',
      component: AdminDashboard,
      children: [
        {
          path: '',
          name: 'AdminDashboardOverview',
          component: AdminDashboardOverview,
        },
        {
          path: 'users',
          name: 'UserManagement',
          component: UserManagement,
        },
        {
          path: 'event-requests',
          name: 'EventRequests',
          component: EventRequests,
        },
        {
          path: 'teams',
          name: 'TeamManagement',
          component: TeamManagement,
        },
        {
          path: 'team-assignment',
          name: 'TeamAssignment',
          component: TeamAssignment,
        },
        {
          path: 'event-monitoring',
          name: 'EventMonitoring',
          component: EventMonitoring,
        },
        {
          path: 'feedback',
          name: 'Feedback',
          component: Feedback,
        },
        {
          path: 'content-moderation',
          name: 'ContentModeration',
          component: ContentModeration,
        },
        {
          path: 'revenue',
          name: 'RevenueManagement',
          component: RevenueManagement,
        },
        {
          path: 'branding',
          name: 'PlatformBranding',
          component: PlatformBranding,
        },
        {
          path: 'announcements',
          name: 'SystemAnnouncements',
          component: SystemAnnouncements,
        },
        {
          path: 'settings',
          name: 'Settings',
          component: Settings,
        },
      ],
    },
  ],
})

// //Navigation Guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token') !== null
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login') //redirect to login if not authenticated
//   } else {
//     next()
//   }
// })

export default router
