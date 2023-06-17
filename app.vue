<script setup lang="ts">
useHead({
  title: 'Switch Card',
})
</script>

<template>
  <VitePwaManifest />
  <ClientOnly>
    <Toaster rich-colors position="top-center" />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
