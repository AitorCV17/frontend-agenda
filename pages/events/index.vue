<!-- pages/events/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEvents, type Event } from '~/composables/useEvents'
import EventForm from '~/components/events/EventForm.vue'

const { getEvents, createEvent, updateEvent, deleteEvent } = useEvents()

const events = ref<Event[]>([])
const loading = ref(false)
const errorMsg = ref('')

// Control del diálogo para crear/editar
const showForm = ref(false)
const isEditing = ref(false)
const currentEvent = ref<Event | null>(null)

const loadEvents = async () => {
  loading.value = true
  try {
    events.value = await getEvents()
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al cargar eventos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvents()
})

const onSaveEvent = async (data: { title: string; description?: string; startTime: string; endTime: string; location?: string }) => {
  try {
    if (isEditing.value && currentEvent.value) {
      await updateEvent({ id: currentEvent.value.id, ...data })
    } else {
      await createEvent(data)
    }
    await loadEvents()
    showForm.value = false
    currentEvent.value = null
    isEditing.value = false
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al guardar el evento'
  }
}

const onEditEvent = (event: Event) => {
  currentEvent.value = event
  isEditing.value = true
  showForm.value = true
}

const onDeleteEvent = async (id: number) => {
  try {
    await deleteEvent(id)
    await loadEvents()
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al eliminar el evento'
  }
}

const onCancelForm = () => {
  showForm.value = false
  currentEvent.value = null
  isEditing.value = false
}
</script>

<template>
  <v-container>
    <h1>Eventos</h1>
    <v-btn color="primary" variant="elevated" @click="showForm = true">
      Nuevo Evento
    </v-btn>
    
    <v-alert v-if="errorMsg" type="error" class="mt-3">
      {{ errorMsg }}
    </v-alert>
    
    <v-row class="mt-5" v-if="events.length">
      <v-col v-for="event in events" :key="event.id" cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>{{ event.title }}</v-card-title>
          <v-card-text>
            <div>{{ event.description }}</div>
            <div>Inicio: {{ event.startTime }}</div>
            <div>Fin: {{ event.endTime }}</div>
            <div v-if="event.location">Ubicación: {{ event.location }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="onEditEvent(event)">Editar</v-btn>
            <v-btn variant="text" color="error" @click="onDeleteEvent(event.id)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <v-alert v-else type="info" class="mt-3">
      No se encontraron eventos.
    </v-alert>
    
    <v-dialog v-model="showForm" max-width="600">
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar Evento' : 'Nuevo Evento' }}</v-card-title>
        <v-card-text>
          <EventForm 
            :event="currentEvent ? { title: currentEvent.title, description: currentEvent.description, startTime: currentEvent.startTime, endTime: currentEvent.endTime, location: currentEvent.location } : undefined" 
            @save="onSaveEvent" 
            @cancel="onCancelForm" 
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
