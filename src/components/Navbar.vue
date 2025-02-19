<script setup></script>
<template>
  <ul>
    <li><RouterLink to="/">Home</RouterLink></li>
    <li><RouterLink to="login">Login</RouterLink></li>
    <li><RouterLink to="signup">Signup</RouterLink></li>
  </ul>
</template>
<style>
ul {
  text-decoration: none;
  display: flex;
  justify-content: center;
  list-style: none;
}
ul li {
  margin: 10px;
}
</style>
