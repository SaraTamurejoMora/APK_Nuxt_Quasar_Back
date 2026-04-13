<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { loggedIn, fetch: refreshSession, openInPopup } = useUserSession()

const schema = z.object({
  name: z.string(),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('/auth/register', {
      method: 'POST',
      body: event.data,
      credentials: 'include'
    })

    await refreshSession()

    if (!loggedIn.value) {
      throw new Error('Usuario creado, pero no se ha podido recuperar la sesión')
    }

    toast.add({
      title: 'Registrado',
      description: 'Sesión iniciada.',
      color: 'success'
    })

    await navigateTo('/')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error?.data?.statusMessage || error?.message || 'No se pudo registrar',
      color: 'red'
    })
  }
}
</script>

<template>
    <UCard class="max-w-md m-auto my-10">
        <h1 class="text-2xl text-center">Register</h1>
        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
            <UFormField label="Nom" name="name">
                <UInput v-model="state.name" class="w-full" />
            </UFormField>

            <UFormField label="Email" name="email">
                <UInput v-model="state.email" />
            </UFormField>

            <UFormField label="Password" name="password">
                <UInput v-model="state.password" type="password" />
            </UFormField>

            <UButton type="submit">
                Submit
            </UButton>
        </UForm>
        <UButton class="mt-4" @click="openInPopup('/auth/github')">
            Login with Github
        </UButton>
    </UCard>
</template>
