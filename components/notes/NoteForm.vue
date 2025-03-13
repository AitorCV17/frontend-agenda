<!-- components/notes/NoteForm.vue -->
<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

interface NoteFormData {
  title: string
  content: string
}

const props = defineProps<{
  note?: NoteFormData  // Si se envía, es modo edición; si no, creación.
}>()

const emits = defineEmits<{
  (e: 'save', payload: NoteFormData): void
  (e: 'cancel'): void
}>()

const formData = ref<NoteFormData>({
  title: props.note?.title || '',
  content: props.note?.content || ''
})

// Si cambia la prop "note", actualiza el formulario.
watch(
  () => props.note,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    } else {
      formData.value = { title: '', content: '' }
    }
  }
)

const onSubmit = () => {
  // Validación sencilla, se puede ampliar según necesidades
  if (!formData.value.title || !formData.value.content) {
    return
  }
  emits('save', formData.value)
}

const onCancel = () => {
  emits('cancel')
}
</script>

<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field v-model="formData.title" label="Título" outlined required />
    <v-textarea v-model="formData.content" label="Contenido" outlined required />
    <v-card-actions class="mt-3">
      <v-btn color="primary" variant="elevated" type="submit">Guardar</v-btn>
      <v-btn variant="text" color="error" @click="onCancel">Cancelar</v-btn>
    </v-card-actions>
  </v-form>
</template>
