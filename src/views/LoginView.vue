<script setup>

</script>
<template>
  <form class="signup-form" @submit="loginHandler">
    <h2>Login</h2>

    <!-- <label for="name">Full Name</label>
    <input type="text" name="name" id="name" /> -->
    <label for="email">Email</label>
    <input type="email" name="email" id="email" />
    <label for="password">Password</label>
    <input type="password" name="password" id="password" />
    <button type="submit">Login</button>
  </form>
  <p>Don't have an account? <router-link to="/signup">Signup</router-link></p>
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
