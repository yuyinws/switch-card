<script setup lang="ts">

</script>

<template>
  <header class="header" sticky top-0 z-100 w-full p-10px>
    <div flex items-center justify-between>
      <a i-carbon-logo-github href="https://github.com/yuyinws/switch-card" target="_blank" />
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
