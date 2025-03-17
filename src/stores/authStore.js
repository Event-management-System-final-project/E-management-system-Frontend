import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)

  // Fetch token and user from localStorage on store initialization
  onMounted(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (storedToken) {
      token.value = storedToken
    }
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  })

  //signup function
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
      localStorage.setItem('user', JSON.stringify(response.data.user)) // Store the user data
      
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || error.message) // Safely accessing error
      throw error // Rethrow the error to be caught in the loginHandler
    }
    return response
  }

  //Logout function
  const logout = async () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  return { token, user, signup, login, logout }
})
