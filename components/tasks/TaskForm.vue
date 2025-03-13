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

// Definición de props; si se envía la prop "task", el formulario entra en modo edición.
const props = defineProps<{
  task?: TaskFormData
}>()

// Se definen los eventos que se emitirán: 'save' y 'cancel'
const emits = defineEmits<{
  (e: 'save', payload: TaskFormData): void
  (e: 'cancel'): void
}>()

// Inicializamos el formulario utilizando la prop "task" (o valores por defecto).
const formData = ref<TaskFormData>({
  title: props.task?.title || '',
  description: props.task?.description || '',
  dueDate: props.task?.dueDate || '',
  completed: props.task?.completed ?? false
})

// Observamos la prop "task" para actualizar el formulario si cambia.
watch(
  () => props.task,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    } else {
      formData.value = { title: '', description: '', dueDate: '', completed: false }
    }
  }
)

// Función para enviar el formulario
const onSubmit = () => {
  // Validación básica: se requiere un título
  if (!formData.value.title) return
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
