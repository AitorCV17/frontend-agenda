<!-- pages/notes/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNotes, type Note } from '~/composables/useNotes'
import NoteForm from '~/components/notes/NoteForm.vue'
import { useAsyncData } from '#app'

const { getNotes, createNote, updateNote, deleteNote } = useNotes()

const notes = ref<Note[]>([])
const loading = ref(false)
const errorMsg = ref('')

// Control de diálogo/modal para crear/editar
const showForm = ref(false)
const isEditing = ref(false)
const currentNote = ref<Note | null>(null)

const loadNotes = async () => {
  loading.value = true
  try {
    notes.value = await getNotes()
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al cargar notas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNotes()
})

// Manejar guardar (crear o editar)
const onSaveNote = async (data: { title: string; content: string }) => {
  try {
    if (isEditing.value && currentNote.value) {
      await updateNote({ id: currentNote.value.id, ...data })
    } else {
      await createNote(data)
    }
    await loadNotes()
    showForm.value = false
    currentNote.value = null
    isEditing.value = false
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al guardar la nota'
  }
}

const onEditNote = (note: Note) => {
  currentNote.value = note
  isEditing.value = true
  showForm.value = true
}

const onDeleteNote = async (id: number) => {
  try {
    await deleteNote(id)
    await loadNotes()
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al eliminar la nota'
  }
}

const onCancelForm = () => {
  showForm.value = false
  currentNote.value = null
  isEditing.value = false
}
</script>

<template>
  <v-container>
    <h1>Mis Notas</h1>
    <v-btn color="primary" variant="elevated" @click="showForm = true">
      Nueva Nota
    </v-btn>
    
    <v-alert v-if="errorMsg" type="error" class="mt-3">
      {{ errorMsg }}
    </v-alert>

    <!-- Lista de notas -->
    <v-row class="mt-5" v-if="notes.length">
      <v-col v-for="note in notes" :key="note.id" cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>{{ note.title }}</v-card-title>
          <v-card-text>{{ note.content }}</v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="onEditNote(note)">Editar</v-btn>
            <v-btn variant="text" color="error" @click="onDeleteNote(note.id)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Si no hay notas -->
    <v-alert v-else type="info" class="mt-3">
      No se encontraron notas.
    </v-alert>

    <!-- Modal para crear/editar nota -->
    <v-dialog v-model="showForm" max-width="600">
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar Nota' : 'Nueva Nota' }}</v-card-title>
        <v-card-text>
          <NoteForm :note="currentNote ? { title: currentNote.title, content: currentNote.content } : undefined" @save="onSaveNote" @cancel="onCancelForm" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
