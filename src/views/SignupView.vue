<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { RouterLink, useRouter } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
const router = useRouter()

//User input data object
const userData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
 password_confirmation: '',
  role: 'user',
})

// Terms and conditions checkbox state
const termsAccepted = ref(false)

// Error messages state
const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  password_confirmation: '',
  apiError: '',
  terms: '', // Error for terms checkbox
})

// Password strength regex
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

//validate user input
const validateForm = () => {
  
  errors.value = {} //Reset errors

  if (!userData.value.firstName.trim()) {
    errors.value.firstName = 'First Name is required'
    return false
  }
  if (!userData.value.lastName.trim()) {
    errors.value.lastName = 'Last Name is required'
    return false
  }
  if (!userData.value.email.trim()) {
    errors.value.email = 'Email is required'
    return false
  } else if (!/\S+@\S+\.\S+/.test(userData.value.email)) {
    errors.value.email = 'Enter a valid email address'
    return false
  }
  if (!userData.value.password) {
    errors.value.password = 'Password is required'
    return false
  } else if (!passwordRegex.test(userData.value.password) || userData.value.password.length < 8) {
    errors.value.password =
      'Password must be at least 8 characters, include an uppercase letter, a number, and a special character'
    return false
  }
  if (userData.value.password_confirmation !== userData.value.password) {
    errors.value.password_confirmation = 'Password do not match'
    return false
  }
// Validate Terms & Conditions checkbox
if (!termsAccepted.value) {
    errors.value.terms = 'You must accept the Terms and Conditions'
    return false
  }
  return true
}

// Signup handler

const signupHandler = async () => {
  if(!validateForm())
  return

  const data = {
    firstName: userData.value.firstName,
    lastName: userData.value.lastName,
    email: userData.value.email,
    password: userData.value.password,
    password_confirmation: userData.value.password_confirmation,
    role: userData.value.role,
  }
  try {
    const response = await axios.post('http://localhost:8000/api/register', data)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    console.log(response.data)
    router.push('/login')
  } catch (error) {
    console.error('Signup error:', error)
    errors.value.email = error.response.data.error;
    
    errors.value.apiError = error.response?.data?.message || 'Signup failed. Please try again.'
  }
}
</script>
<template>
  <div class="flex justify-center items-center bg-white-200 overflow-hidden">
    <div class="hero-content flex-col w-full max-w-lg">
      <!-- BackButton Positioned Like in Login Page -->
      <div class="flex justify-start w-full">
        <BackButton />
      </div>

      <div class="card bg-white w-full shadow-2xl">
        <form class="card-body" @submit.prevent="signupHandler">
          <!-- Signup Heading Inside the Form -->
          <h1 class="text-3xl font-bold text-center">Sign Up</h1>

          <!-- First Name Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">First Name</span>
            </label>
            <input
              v-model="userData.firstName"
              type="text"
              placeholder="First Name"
              class="input input-bordered"
            />
            <p v-if="errors.firstName" class="text-red-500">{{ errors.firstName }}</p>
          </div>
          <!-- Last Name Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Last Name</span>
            </label>
            <input
              v-model="userData.lastName"
              type="text"
              placeholder="Last Name"
              class="input input-bordered"
            />
            <p v-if="errors.lastName" class="text-red-500">{{ errors.lastName }}</p>
          </div>

          <!-- Email Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="userData.email"
              type="email"
              placeholder="Email"
              class="input input-bordered"
            />
            <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="userData.password"
              type="password"
              placeholder="Password"
              class="input input-bordered"
            />
            <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Confirm Password</span>
            </label>
            <input
              v-model="userData.password_confirmation"
              type="password"
              placeholder="Confirm Password"
              class="input input-bordered"
            />
            <p v-if="errors.password_confirmation" class="text-red-500">{{ errors.password_confirmation }}</p>
          </div>

          <!-- Select role -->

          <div class="form-control">
            <label class="label">
              <span class="label-text">Select Role (Click on the field to select)</span>
            </label>
            <select v-model="userData.role" name="role" id="role" class="input input-bordered">
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <!-- Terms and Conditions Checkbox -->
          <div class="form-control mt-2">
            <label class="flex items-center space-x-2">
              <input v-model="termsAccepted" type="checkbox" class="checkbox" />
              <span class="label-text">I accept the <RouterLink to="#" class="text-blue-600">Terms and Conditions</RouterLink></span>
            </label>
            <p v-if="errors.terms" class="text-red-500">{{ errors.terms }}</p>
          </div>

          <!-- Signup Button -->
          <div class="form-control mt-4">
            <button class="btn bg-blue-600 text-white hover:bg-blue-700 w-full">Sign Up</button>
          </div>

          <!-- Login Link -->
          <p class="text-center mt-2">
            Already have an account?
            <router-link to="/login" class="text-blue-600">Login</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
