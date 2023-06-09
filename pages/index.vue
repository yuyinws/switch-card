<script setup lang="ts">
const { auth } = useAuthStore()
</script>

<template>
  <template v-if="!auth.accessToken">
    <Login v-if="!auth.accessToken" />
  </template>
  <template v-else>
    <UserInfo />
  </template>
</template>
