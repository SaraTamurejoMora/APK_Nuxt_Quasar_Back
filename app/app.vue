<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <UApp>
    <div class="isolate min-h-screen">
      <NavBar />
      <NuxtPage />
    </div>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>