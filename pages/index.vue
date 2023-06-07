<script setup lang="ts">
const { auth } = useAuthStore()
</script>

<template>
  <Login v-if="!auth.sessionToken" />
  <div v-else>
    已登录
  </div>
</template>
