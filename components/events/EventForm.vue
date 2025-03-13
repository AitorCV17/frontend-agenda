<!-- components/events/EventForm.vue -->
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

interface EventFormData {
  title: string
  description?: string
  startTime: string
  endTime: string
  location?: string
}

/**
 * Convierte una fecha ISO en formato "YYYY-MM-DDTHH:mm"
 */
function formatDateToInput(dateString?: string): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toISOString().slice(0, 16)
}

const props = defineProps<{
  event?: EventFormData
}>()

const emits = defineEmits<{
  (e: 'save', payload: EventFormData): void
  (e: 'cancel'): void
}>()

// Inicializamos el formulario
const formData = ref<EventFormData>({
  title: props.event?.title || '',
  description: props.event?.description || '',
  startTime: props.event?.startTime ? formatDateToInput(props.event.startTime) : '',
  endTime: props.event?.endTime ? formatDateToInput(props.event.endTime) : '',
  location: props.event?.location || ''
})

// Si cambia la prop "event", actualizamos el formulario
watch(
  () => props.event,
  (newVal) => {
    if (newVal) {
      formData.value = {
        title: newVal.title || '',
        description: newVal.description || '',
        startTime: newVal.startTime ? formatDateToInput(newVal.startTime) : '',
        endTime: newVal.endTime ? formatDateToInput(newVal.endTime) : '',
        location: newVal.location || ''
      }
    } else {
      formData.value = { title: '', description: '', startTime: '', endTime: '', location: '' }
    }
  }
)

// Emitimos los datos al guardar
const onSubmit = () => {
  if (!formData.value.title || !formData.value.startTime || !formData.value.endTime) return

  emits('save', { ...formData.value })
}

const onCancel = () => {
  emits('cancel')
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field v-model="formData.title" label="Título" outlined required />
    <v-text-field v-model="formData.description" label="Descripción" outlined />
    <v-text-field v-model="formData.startTime" label="Inicio" type="datetime-local" outlined required />
    <v-text-field v-model="formData.endTime" label="Fin" type="datetime-local" outlined required />
    <v-text-field v-model="formData.location" label="Ubicación" outlined />
    <v-card-actions class="mt-3">
      <v-btn color="primary" variant="elevated" type="submit">Guardar</v-btn>
      <v-btn variant="text" color="error" @click="onCancel">Cancelar</v-btn>
    </v-card-actions>
  </v-form>
</template>
