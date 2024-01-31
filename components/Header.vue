<script setup lang="ts">
import RadixIconsGithubLogo from '~icons/radix-icons/github-logo'
</script>

<template>
  <header class="sticky py-3 xl:px-20 px-3 z-40 top-0 bg-background/80 backdrop-blur-lg border-b border-border">
    <div class="flex items-center justify-between">
      <NuxtLink to="https://github.com/yuyinws/switch-card" target="_blank">
        <RadixIconsGithubLogo class="text-gray-500" />
      </NuxtLink>
      <div class="title">
        Switch Card
      </div>
      <DarkToggle />
    </div>
  </header>
</template>

<style>
.header {
  background-size: 4px 4px;
  -webkit-backdrop-filter: saturate(50%) blur(4px);
  backdrop-filter: saturate(50%) blur(4px);
  background-image: radial-gradient(transparent 1px,var(--bg-color) 1px);
  border-bottom: 1px solid #dcdfe6;
}

.title {
  background: -webkit-linear-gradient(315deg, #A725D4 25%, #d32d26);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  background-size: 400% 400%;
  animation: gradient 12s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
