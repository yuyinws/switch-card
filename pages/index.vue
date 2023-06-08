<script setup lang="ts">
const { auth } = useAuthStore()
</script>

<template>
  <template v-if="!auth.accessToken">
    <Login />
  </template>
  <template v-if="auth.accessToken">
    <UserInfo />
  </template>
</template>
