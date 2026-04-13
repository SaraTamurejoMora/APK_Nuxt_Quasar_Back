<script setup>
const { loggedIn, user, clear } = useUserSession()
</script>

<template>
  <UCard class="w-full">
    <div class="flex items-center justify-between">
      <!-- Izquierda -->
      <UButton as-child variant="soft">
        <NuxtLink to="/">Home</NuxtLink>
      </UButton>

      <!-- Derecha -->
      <div class="flex items-center gap-2">
        <template v-if="loggedIn">
          <span class="text-sm font-medium">{{ user?.login }}</span>
          <UButton
            @click="async () => { await clear(); navigateTo('/login') }"
            color="red"
            variant="soft"
          >
            Logout
          </UButton>
        </template>

        <template v-else>
          <UButton as-child variant="soft">
            <NuxtLink to="/register">Register</NuxtLink>
          </UButton>

          <UButton as-child>
            <NuxtLink to="/login">Login</NuxtLink>
          </UButton>
        </template>
      </div>
    </div>
  </UCard>
</template>