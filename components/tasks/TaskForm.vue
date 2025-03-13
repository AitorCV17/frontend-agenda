<!-- components/tasks/TaskForm.vue -->
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

// Definición de la interfaz para los datos del formulario
interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
  completed?: boolean
}

const props = defineProps<{
  task?: TaskFormData | undefined  // 🔥 Permitimos undefined
}>()

const emits = defineEmits<{
  (e: 'save', payload: TaskFormData): void
  (e: 'cancel'): void
}>()

// Función para formatear una fecha ISO a YYYY-MM-DD
const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().substring(0, 10)
}

// Inicializamos el formulario con valores por defecto
const formData = ref<TaskFormData>({
  title: '',
  description: '',
  dueDate: '',
  completed: false
})

// Si cambia la prop "task", actualiza el formulario
watch(
  () => props.task,
  (newVal) => {
    if (newVal) {
      formData.value = {
        ...newVal,
        dueDate: newVal.dueDate ? formatDate(newVal.dueDate) : ''
      }
    } else {
      formData.value = { title: '', description: '', dueDate: '', completed: false }
    }
  },
  { immediate: true }  // 🔥 Carga valores iniciales al montar el componente
)

// Función para enviar el formulario
const onSubmit = () => {
  if (!formData.value.title) return  // Validación básica
  emits('save', formData.value)
}

// Función para cancelar la operación
const onCancel = () => {
  emits('cancel')
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field v-model="formData.title" label="Título" outlined required />
    <v-textarea v-model="formData.description" label="Descripción" outlined />
    <v-text-field v-model="formData.dueDate" label="Fecha límite" type="date" outlined />
    <v-checkbox v-model="formData.completed" label="Completado" />
    <v-card-actions class="mt-3">
      <v-btn color="primary" variant="elevated" type="submit">Guardar</v-btn>
      <v-btn variant="text" color="error" @click="onCancel">Cancelar</v-btn>
    </v-card-actions>
  </v-form>
</template>
