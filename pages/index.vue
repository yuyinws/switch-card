<script setup lang="ts">
const { auth } = useAuthStore()
</script>

<template>
  <div v-if="!auth.accessToken">
    <Login />
  </div>
  <div v-else>
    <UserInfo />
  </div>
</template>
