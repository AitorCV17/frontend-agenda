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
 * Convierte una fecha ISO o similar en el formato "YYYY-MM-DDTHH:mm",
 * que es el requerido por un input[type="datetime-local"].
 */
function formatDateToInput(dateString?: string): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  // "toISOString()" => "2025-03-13T14:30:00.000Z"
  // slice(0,16) => "2025-03-13T14:30"
  return d.toISOString().slice(0, 16)
}

const props = defineProps<{
  // Si "event" está presente, se asume modo edición; si no, creación.
  event?: EventFormData
}>()

const emits = defineEmits<{
  (e: 'save', payload: EventFormData): void
  (e: 'cancel'): void
}>()

// Inicializamos el formulario, formateando las fechas para que se muestren en el input datetime-local
const formData = ref<EventFormData>({
  title: props.event?.title || '',
  description: props.event?.description || '',
  startTime: props.event?.startTime ? formatDateToInput(props.event.startTime) : '',
  endTime: props.event?.endTime ? formatDateToInput(props.event.endTime) : '',
  location: props.event?.location || ''
})

// Si cambia la prop "event", actualizamos el formulario y convertimos las fechas
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
  // Validación básica
  if (!formData.value.title || !formData.value.startTime || !formData.value.endTime) return

  // Opcionalmente, podrías reconvertir aquí las fechas a ISO antes de emitir, si tu backend así lo requiere:
  // const isoStart = new Date(formData.value.startTime).toISOString()
  // const isoEnd = new Date(formData.value.endTime).toISOString()

  emits('save', {
    ...formData.value
    // startTime: isoStart,
    // endTime: isoEnd
  })
}

const onCancel = () => {
  emits('cancel')
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      v-model="formData.title"
      label="Título"
      outlined
      required
    />
    <v-text-field
      v-model="formData.description"
      label="Descripción"
      outlined
    />
    <v-text-field
      v-model="formData.startTime"
      label="Inicio"
      type="datetime-local"
      outlined
      required
    />
    <v-text-field
      v-model="formData.endTime"
      label="Fin"
      type="datetime-local"
      outlined
      required
    />
    <v-text-field
      v-model="formData.location"
      label="Ubicación"
      outlined
    />
    <v-card-actions class="mt-3">
      <v-btn color="primary" variant="elevated" type="submit">
        Guardar
      </v-btn>
      <v-btn variant="text" color="error" @click="onCancel">
        Cancelar
      </v-btn>
    </v-card-actions>
  </v-form>
</template>
