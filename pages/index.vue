<script setup lang="ts">
const { auth } = useAuthStore()
</script>

<template>
  <template v-if="!auth.sessionToken">
    <Login />
  </template>
  <template v-if="auth.sessionToken">
    <UserInfo />
  </template>
</template>
