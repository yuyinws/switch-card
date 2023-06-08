<script setup lang="ts">
const { auth, logout } = useAuthStore()
</script>

<template>
  <Login v-if="!auth.sessionToken" />
  <UserInfo v-else />
</template>
