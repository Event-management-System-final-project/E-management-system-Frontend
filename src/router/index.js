import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import HomeView from '@/views/HomeView.vue'
import UserView from '@/views/UserView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import PublicEventsView from '@/views/PublicEventsView.vue'
import OrganizersView from '@/views/OrganizersView.vue'

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
      name: 'Events',
      component: PublicEventsView,
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
    {
      path: '/organizerview',
      name: 'organizer',
      component: OrganizersView,
    },
    


  ],
})

//Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login') //redirect to login if not authenticated
  } else {
    next()
  }
})

export default router
