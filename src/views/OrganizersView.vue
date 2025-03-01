<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>
<template>
    
  Wellcome to Your Home
  <ul>
    <li><button @click="logout">Logout</button></li>
  </ul>
</template>
