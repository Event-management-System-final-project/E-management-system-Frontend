<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const emailError = ref('')
const passwordError = ref('')
const router = useRouter()

// validate login data

const validateLoginData = () => {
  let isValid = true
  emailError.value = ''
  passwordError.value = ''

  if (!email.value.trim()) {
    emailError.value = 'Email is required.'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(email.value.trim())) {
    emailError.value = 'Invalid email format'
    isValid = false
  }

  if (!password.value.trim()) {
    passwordError.value = 'Password is required'
    isValid = false
  }
  return isValid
}

const loginHandler = async () => {
  if (!validateLoginData()) {
    return
  }

  const loginData = {
    email: email.value,
    password: password.value,
  }
  try {
    const response = await axios.post('http://localhost:8000/api/login', loginData)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    console.log('Login successful:', response.data)
    router.push('/userview')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error('Validation error:', error.response.data)
      errorMessage.value = 'Password or Email are incorrect.'
    } else {
      console.error('Login error:', error)
      errorMessage.value = 'Something went wrong. Try again.'
    }
  }
}
</script>

<template>
  <div class="hero bg-white-200 min-h-screen flex justify-center items-center">
    <div class="hero-content flex-col w-full max-w-lg">
      <div class="flex justify-start w-full mb-4">
        <BackButton />
      </div>
      <div class="card bg-base-100 w-full shadow-2xl p-4">
        <form class="card-body" @submit.prevent="loginHandler">
          <!-- Login Now! Heading Inside the Form -->
          <h1 class="text-3xl font-bold text-center mb-3">Login Now!</h1>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input v-model="email" type="email" placeholder="email" class="input input-bordered" />
            <p v-if="emailError" class="text-red-500">{{ emailError }}</p>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="password"
              class="input input-bordered"
            />
            <p v-if="passwordError" class="text-red-500">{{ passwordError }}</p>
            <label class="label">
              <a href="#" class="label-text-alt textl link link-hover">Forgot password?</a>
            </label>
          </div>
          <p v-if="errorMessage" class="text-center text-red-500">{{ errorMessage }}</p>
          <div class="form-control mt-4">
            <button class="btn bg-blue-600 text-white hover:bg-blue-700">Login</button>
          </div>

          <!-- Signup Link -->
          <p class="text-center mt-4">
            Don't have an account?
            <router-link to="/signup" class="text-blue-600">Signup</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
