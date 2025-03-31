<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
import { Loader2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
// import axios from 'axios'
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const router = useRouter()
const emailError = ref('')
const passwordError = ref('')
const isLoading = ref(false)

const loginHandler = async () => {
  if (!email.value.trim()) {
    emailError.value = 'This field is required'
    return
  }

  if (!password.value.trim()) {
    passwordError.value = 'This field is required'
    return
  }

  // show loading state
  isLoading.value = true
  
    const loginData = {
      email: email.value,
      password: password.value,
    }
    await authStore.login(loginData)
    
  
    if (authStore.user?.role === 'admin' && authStore.token) {
      router.replace('/admin')
    } else if (authStore.user?.role === 'organizer' && authStore.token) {
      router.replace('/organizerview')
    } else if (authStore.user?.role === 'subteam' && authStore.token) {
      router.replace('/subteamview')
    } else {
      router.replace('/userview')
    }

  //hide loading state
  isLoading.value = false;
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
          </div>
          <p v-if="emailError" class="text-red-600">{{ emailError }}</p>
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
            <p v-if="passwordError" class="text-red-600">{{ passwordError }}</p>

            <label class="label">
              <RouterLink to="/forgotpassword" class="label-text-alt link link-hover"
                >Forgot password?</RouterLink
              >
            </label>
          </div>
          <div class="form-control mt-4">
            <button
              type="submit"
              :disabled="isLoading"
              class="btn bg-blue-600 text-white hover:bg-blue-700"
            >
              <Loader2 v-if="isLoading" class="animate-spin h-5 w-5 mr-2" />
              {{ isLoading ? 'Loging in...' : 'Login' }}
            </button>
          </div>
          <p v-if="authStore.apiError" class="text-center text-red-600">{{ authStore.apiError }}</p>

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
