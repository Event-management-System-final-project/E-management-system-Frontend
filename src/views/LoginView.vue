<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BackButton from '@/components/BackButton.vue'
  import { Loader2 } from 'lucide-vue-next'

import axios from 'axios'


const email = ref('')
const password = ref('')
// const errorMessage = ref('')
const router = useRouter()
const emailError = ref('')
const passwordError = ref('')
const apiError = ref('')
  const isLoading = ref(false)



const loginHandler = async () => {

  if (!email.value.trim()) {
  emailError.value = "Email is required";
  return;
}

if (!password.value.trim()) {
  passwordError.value = "Password is required";
  return;

}

// show loading state
  isLoading.value = true

  try {
    const loginData = {
      email: email.value,
      password: password.value,
    }
    const response = await axios.post('http://localhost:8000/api/login', loginData)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    console.log('Login successful:', response.data)

    if(response.data.user.role === 'admin'){
      router.push('/adminview')
    }
    else if(response.data.user.role === 'organizer'){
      router.push('/organizerview')

    }
    else if(response.data.user.role === 'subteam'){
      router.push('/subteamview')

    }else{
      router.push('/userview')
    }

   
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error('Validation error:', error.response.data)
      apiError.value = "Incorrect email or password.";
    } 
    // else if (error.response.status === 422) {
    //     apiError.value = "Incorrect email or password.";
    //   }
   
    else {
      console.error('Login error:', error)
      apiError.value = "Something went wrong. Try again.";
    }
  }
  finally {
    //hide loading state
    isLoading.value = false
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
              <RouterLink to="/forgotpassword" class="label-text-alt link link-hover">Forgot password?</RouterLink>
            </label>
          </div>
          <div class="form-control mt-4">
            <button type = "submit" 
             :disabled="isLoading"
             class="btn bg-blue-600 text-white hover:bg-blue-700"><Loader2 v-if="isLoading" class="animate-spin h-5 w-5 mr-2" />
                {{ isLoading ? 'Loging in...' : 'Login' }}</button>
          </div>
          <p v-if="apiError" class="text-center text-red-600">{{apiError}}</p>

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