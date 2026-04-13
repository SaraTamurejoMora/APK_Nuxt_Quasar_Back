<script setup lang="ts">
definePageMeta({ middleware: "auth" })
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p class="opacity-70">Esta página está protegida por middleware auth.</p>
    <UButton to="/" class="mt-4">Ir a productos</UButton>
  </div>
</template>