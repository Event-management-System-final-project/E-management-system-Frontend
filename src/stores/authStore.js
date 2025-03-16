import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const router = useRouter()

  const signup = async (data) => {
    try {
      const response = await axios.post('http://localhost:8000/api/register', data)
      token.value = response.data.token
      user.value = response.data.user // Store the user object directly
      localStorage.setItem('token', token.value)
    } catch (error) {
      console.error('Signup error:', error.response?.data?.error || error.message) // Safely accessing error
    }
  }

  // Login function
  const login = async (loginData) => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', loginData)
      token.value = response.data.token
      user.value = response.data.user // Store the user object directly
      localStorage.setItem('token', token.value)
      return response
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || error.message) // Safely accessing error
      throw error // Rethrow the error to be caught in the loginHandler
    }
  }
    const logout = async () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')

}
  return { token, user, signup, login, logout }
})
