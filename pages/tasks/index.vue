<!-- pages/tasks/index.vue -->
<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useTasks, type Task } from '~/composables/useTasks'
import TaskForm from '~/components/tasks/TaskForm.vue'

const { getTasks, createTask, updateTask, deleteTask, tasks } = useTasks()

const loading = ref(false)
const errorMsg = ref('')

// Control del diálogo/modal para crear/editar tarea
const showForm = ref(false)
const isEditing = ref(false)
const currentTask = ref<Task | undefined>(undefined)

const loadTasks = async () => {
  loading.value = true
  try {
    await getTasks()
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al cargar tareas'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTasks()
})

watchEffect(() => {
  loadTasks()
})

// Función para iniciar creación de una nueva tarea
const onClickNewTask = () => {
  currentTask.value = undefined  // 🔥 Evita el error de TypeScript
  isEditing.value = false
  showForm.value = true
}

const onSaveTask = async (data: { title: string; description?: string; dueDate?: string; completed?: boolean }) => {
  try {
    if (isEditing.value && currentTask.value) {
      await updateTask({ id: currentTask.value.id, ...data })
    } else {
      await createTask(data)
    }
    showForm.value = false
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al guardar la tarea'
  }
}

const onEditTask = (task: Task) => {
  currentTask.value = task
  isEditing.value = true
  showForm.value = true
}

const onDeleteTask = async (id: number) => {
  try {
    await deleteTask(id)
  } catch (error: any) {
    errorMsg.value = error.message || 'Error al eliminar la tarea'
  }
}

const onCancelForm = () => {
  showForm.value = false
  currentTask.value = undefined  // 🔥 Asignamos undefined en lugar de null
  isEditing.value = false
}
</script>

<template>
  <v-container>
    <h1>Mis Tareas</h1>
    <v-btn color="primary" variant="elevated" @click="onClickNewTask">
      Nueva Tarea
    </v-btn>
    
    <v-alert v-if="errorMsg" type="error" class="mt-3">
      {{ errorMsg }}
    </v-alert>

    <!-- Lista de tareas -->
    <v-row class="mt-5" v-if="tasks.length">
      <v-col v-for="task in tasks" :key="task.id" cols="12" md="4">
        <v-card class="pa-3">
          <v-card-title>{{ task.title }}</v-card-title>
          <v-card-text>
            <div>{{ task.description }}</div>
            <div v-if="task.dueDate">
              Fecha límite: {{ task.dueDate }}
            </div>
            <div>
              Completado: {{ task.completed ? 'Sí' : 'No' }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" color="primary" @click="onEditTask(task)">
              Editar
            </v-btn>
            <v-btn variant="text" color="error" @click="onDeleteTask(task.id)">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-else type="info" class="mt-3">
      No se encontraron tareas.
    </v-alert>

    <!-- Modal para crear/editar tarea -->
    <v-dialog v-model="showForm" max-width="600">
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}
        </v-card-title>
        <v-card-text>
          <TaskForm 
            :task="currentTask ?? undefined" 
            @save="onSaveTask" 
            @cancel="onCancelForm" 
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
