<script setup>
import { ref } from 'vue'
import axios from 'axios'

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
    const response = await axios.post('http://localhost:3000/api/auth/signup', data);
    console.log(response.data);
}
</script>
<template>
  <form class="signup-form" @submit.prevent="signupHandler">
    <h2>Sign Up</h2>
    <label for="name">Full Name</label>
    <input v-model="userData.name" type="text" name="name" id="name" />
    <label for="email">Email</label>
    <input v-model="userData.email" type="email" name="email" id="email" />
    <label for="password">Password</label>
    <input v-model="userData.password" type="password" name="password" id="password" />

    <button type="submit">Sign Up</button>
  </form>
  <p>Already have an account? <router-link to="/login">Login</router-link></p>
</template>
<style>
.signup-form label {
  display: block;
}
.signup-form input {
  width: 300px;
  margin-top: 5px;
  padding: 5px;
}
button {
  display: block;
  margin-top: 10px;
}
</style>
