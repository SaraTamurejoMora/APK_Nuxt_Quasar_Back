<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

const toast = useToast()
onMounted(() => toast.add({ title: "Toast test" }))

const { loggedIn } = useUserSession()

// Zod cliente
const productSchema = z.object({
  title: z.string().min(1, "Título obligatorio"),
  price: z.number().min(0, "Precio inválido"),
  description: z.string().optional(),
  collection: z.string().min(1, "Colección obligatoria"),
  type: z.string().min(1, "Tipo obligatorio"),
  imageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
})

type ProductForm = z.infer<typeof productSchema>

type Product = {
  id: number
  userId: number
  title: string
  price: number
  description: string | null
  collection: string
  type: string
  createdAt: number
  imageUrl: string | null
}

// filtros (opcionales)
const q = ref("")
const sort = ref<"newest" | "priceAsc" | "priceDesc">("newest")
const ALL_TYPES = "__ALL__"
const typeFilter = ref<string>(ALL_TYPES)

const { data: products, refresh, pending } = await useFetch<Product[]>("/api/products", {
  query: computed(() => ({
    q: q.value || undefined,
    type: typeFilter.value === ALL_TYPES ? undefined : typeFilter.value,
    sort: sort.value,
  })),
  default: () => [],
})

// crear
const createState = reactive<ProductForm>({
  title: "",
  price: 0,
  description: "",
  collection: "",
  type: "",
})


const typeItems = computed(() => {
  const set = new Set((products.value ?? []).map(p => p.type).filter(Boolean))
  return [
    { label: "Todos", value: ALL_TYPES },
    ...[...set].sort().map(t => ({ label: t, value: t })),
  ]
})
async function onCreate(e: FormSubmitEvent<ProductForm>) {
  await $fetch("/api/products", { method: "POST", body: e.data })
  toast.add({ title: "Producto creado" })
  Object.assign(createState, { title: "", price: 0, description: "", collection: "", type: "" })
  await refresh()
}

// editar
const editingId = ref<number | null>(null)
const editState = reactive<ProductForm>({
  title: "",
  price: 0,
  description: "",
  collection: "",
  type: "",
})

function startEdit(p: Product) {
  editingId.value = p.id
  editState.title = p.title
  editState.price = p.price
  editState.description = p.description ?? ""
  editState.collection = p.collection
  editState.type = p.type
}

async function onSaveEdit(e: FormSubmitEvent<ProductForm>) {
  if (editingId.value == null) return
  await $fetch(`/api/products/${editingId.value}`, { method: "PUT", body: e.data })
  toast.add({ title: "Producto actualizado" })
  editingId.value = null
  await refresh()
}

async function onDelete(id: number) {
  await $fetch(`/api/products/${id}`, { method: "DELETE" })
  toast.add({ title: "Producto eliminado" })
  await refresh()
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <h1 class="text-2xl font-bold">Productos Pop Mart</h1>

    <!-- Filtros públicos -->
    <UCard>
      <div class="grid gap-3 md:grid-cols-3">
        <UFormField label="Buscar" name="q">
          <UInput v-model="q" placeholder="Labubu, Skullpanda..." />
        </UFormField>

        <UFormField label="Tipo" name="type">
            <USelect v-model="typeFilter" :items="typeItems" />
        </UFormField>

        <UFormField label="Orden" name="sort">
          <USelect
            v-model="sort"
            :items="[
              { label: 'Más nuevos', value: 'newest' },
              { label: 'Precio asc', value: 'priceAsc' },
              { label: 'Precio desc', value: 'priceDesc' }
            ]"
          />
        </UFormField>
      </div>

      <div class="mt-3 flex gap-2">
        <UButton variant="soft" @click="refresh">Aplicar</UButton>
        <UButton variant="ghost" @click="q=''; typeFilter=ALL_TYPES; sort='newest'; refresh()">Limpiar</UButton>
      </div>
    </UCard>

    <!-- Crear (solo logueado) -->
    <UCard v-if="loggedIn">
      <template #header>
        <div class="font-semibold">Añadir producto</div>
      </template>

      <UForm :schema="productSchema" :state="createState" class="space-y-3" @submit="onCreate">
        <div class="grid gap-3 md:grid-cols-2">
          <UFormField name="title" label="Título">
            <UInput v-model="createState.title" />
          </UFormField>

          <UFormField name="price" label="Precio">
            <UInput type="number" v-model.number="createState.price" />
          </UFormField>

          <UFormField name="collection" label="Colección">
            <UInput v-model="createState.collection" />
          </UFormField>

          <UFormField name="type" label="Tipo">
            <UInput v-model="createState.type" />
          </UFormField>
        </div>

        <UFormField name="description" label="Descripción">
          <UInput v-model="createState.description" />
        </UFormField>

        <UFormField name="imageUrl" label="Imagen (URL)">
            <UInput v-model="createState.imageUrl" placeholder="https://..." />
        </UFormField>
        <UButton type="submit">Crear</UButton>
      </UForm>
    </UCard>

    <!-- Lista -->
    <UCard>
      <template #header>
        <div class="font-semibold">Listado</div>
      </template>

      <div v-if="pending" class="text-sm opacity-70">Cargando...</div>

      <div v-else class="space-y-2">
        <div
          v-for="p in products"
          :key="p.id"
          class="flex items-start justify-between gap-3 border rounded p-3"
        >
          <img
                v-if="p.imageUrl"
                :src="p.imageUrl"
                alt=""
                class="w-16 h-16 object-cover rounded border"
            />
          <div class="min-w-0">
            <div class="font-semibold truncate">
              {{ p.title }} — {{ p.price }}€
            </div>
            <div class="text-sm opacity-80">
              {{ p.collection }} · {{ p.type }}
            </div>
            <div class="text-sm opacity-70 truncate">
              {{ p.description || "—" }}
            </div>
          </div>

          <div v-if="loggedIn" class="flex gap-2 shrink-0">
            <UButton size="xs" variant="soft" @click="startEdit(p)">Editar</UButton>
            <UButton size="xs" color="red" variant="soft" @click="onDelete(p.id)">Eliminar</UButton>
          </div>
        </div>

        <div v-if="products.length === 0" class="text-sm opacity-70">
          No hay productos.
        </div>
      </div>
    </UCard>

    <!-- Editar (simple: bloque abajo) -->
    <UCard v-if="loggedIn && editingId !== null">
      <template #header>
        <div class="font-semibold">Editar producto #{{ editingId }}</div>
      </template>

      <UForm :schema="productSchema" :state="editState" class="space-y-3" @submit="onSaveEdit">
        <div class="grid gap-3 md:grid-cols-2">
          <UFormField name="title" label="Título">
            <UInput v-model="editState.title" />
          </UFormField>

          <UFormField name="price" label="Precio">
            <UInput type="number" v-model.number="editState.price" />
          </UFormField>

          <UFormField name="collection" label="Colección">
            <UInput v-model="editState.collection" />
          </UFormField>

          <UFormField name="type" label="Tipo">
            <UInput v-model="editState.type" />
          </UFormField>
        </div>

        <UFormField name="description" label="Descripción">
          <UInput v-model="editState.description" />
        </UFormField>

        <UFormField name="imageUrl" label="Imagen (URL)">
            <UInput v-model="editState.imageUrl"/>
        </UFormField>

        <div class="flex gap-2">
          <UButton type="submit">Guardar</UButton>
          <UButton variant="ghost" @click="editingId=null">Cancelar</UButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>