<!-- pages/notes/index.vue -->
<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useNotes, type Note } from '~/composables/useNotes'
import NoteForm from '~/components/notes/NoteForm.vue'

const { getNotes, createNote, updateNote, deleteNote, notes } = useNotes()

const loading = ref(false)
const errorMsg = ref('')

// Control del diálogo/modal para crear/editar nota
const showForm = ref(false)
const isEditing = ref(false)
const currentNote = ref<Note | undefined>(undefined)

const loadNotes = async () => {
  loading.value = true
  try {
    await getNotes()
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al cargar notas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadNotes()
})

watchEffect(() => {
  loadNotes()
})

// Función para iniciar creación de una nueva nota
const onClickNewNote = () => {
  currentNote.value = undefined  
  isEditing.value = false
  showForm.value = true
}

const onSaveNote = async (data: { title: string; content: string }) => {
  try {
    if (isEditing.value && currentNote.value) {
      await updateNote({ id: currentNote.value.id, ...data })
    } else {
      await createNote(data)
    }
    showForm.value = false
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
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al eliminar la nota'
  }
}

const onCancelForm = () => {
  showForm.value = false
  currentNote.value = undefined  
  isEditing.value = false
}
</script>

<template>
  <v-container>
    <h1>Mis Notas</h1>
    <v-btn color="primary" variant="elevated" @click="onClickNewNote">
      Nueva Nota
    </v-btn>
    
    <v-alert v-if="errorMsg" type="error" class="mt-3">
      {{ errorMsg }}
    </v-alert>

    <v-row class="mt-5" v-if="notes.length">
      <v-col v-for="note in notes" :key="note.id" cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>{{ note.title }}</v-card-title>
          <v-card-text>{{ note.content }}</v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="onEditNote(note)">
              Editar
            </v-btn>
            <v-btn variant="text" color="error" @click="onDeleteNote(note.id)">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" class="mt-3">
      No se encontraron notas.
    </v-alert>

    <v-dialog v-model="showForm" max-width="600">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Editar Nota' : 'Nueva Nota' }}
        </v-card-title>
        <v-card-text>
          <NoteForm 
            :note="currentNote ?? undefined" 
            @save="onSaveNote" 
            @cancel="onCancelForm" 
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
