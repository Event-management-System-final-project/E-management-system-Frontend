<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()

const userData = ref({
  name: '',
  email: '',
  password: '',
})

const signupHandler = async () => {
  const data = {
    name: userData.value.name,
    email: userData.value.email,
    password: userData.value.password,
  }

  try {
    const response = await axios.post('http://localhost:8000/api/register', data)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    console.log(response.data)
    router.push('/login')
  } catch (error) {
    console.error('Signup error:', error)
  }
}
</script>
<template>
  <Navbar />
  <div class="min-h-[70vh] flex justify-center items-center bg-white-200 overflow-hidden">
    <div class="card bg-white w-full max-w-lg shadow-2xl">
      <form class="card-body" @submit.prevent="signupHandler">
        <!-- Signup Heading Inside the Form -->
        <h1 class="text-3xl font-bold text-center mb-2">Sign Up</h1>

        <!-- Full Name Field -->
        <div class="form-control mb-2">
          <label class="label">
            <span class="label-text">Full Name</span>
          </label>
          <input
            v-model="fullName"
            type="text"
            placeholder="Full Name"
            class="input input-bordered"
          />
        </div>

        <!-- Email Field -->
        <div class="form-control mb-2">
          <label class="label">
            <span class="label-text">Email</span>
          </label>
          <input v-model="email" type="email" placeholder="Email" class="input input-bordered" />
        </div>

        <!-- Password Field -->
        <div class="form-control mb-2">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="input input-bordered"
          />
        </div>

        <!-- Confirm Password Field -->
        <div class="form-control mb-2">
          <label class="label">
            <span class="label-text">Confirm Password</span>
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="input input-bordered"
          />
        </div>

        <!-- Signup Button -->
        <div class="form-control mt-2">
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
</template>
