<!-- components/tasks/TaskForm.vue -->
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

interface TaskFormData {
  title: string
  description?: string
  dueDate?: string
  completed?: boolean
}

const props = defineProps<{
  task?: TaskFormData  // Si se envía, es modo edición; si no, creación.
}>()

const emits = defineEmits<{
  (e: 'save', payload: TaskFormData): void
  (e: 'cancel'): void
}>()

const formData = ref<TaskFormData>({
  title: props.task?.title || '',
  description: props.task?.description || '',
  dueDate: props.task?.dueDate || '',
  completed: props.task?.completed || false,
})

// Si cambia la prop "task", actualiza el formulario.
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

const onSubmit = () => {
  if (!formData.value.title) return  // Validación básica; se puede ampliar
  emits('save', formData.value)
}

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
