<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Login } from '~/interfaces/Login.Interface'
import { useCookie } from '#app'

// Obtener usuario desde la cookie
const userLogin = useCookie<Login | null>('user')
const router = useRouter()

// Mensaje de bienvenida
const welcomeMessage = ref('¡Bienvenido de nuevo!')
const userName = ref(userLogin.value?.name || '')

// Redirigir al login si no está autenticado
onMounted(() => {
  if (!userLogin.value || !userLogin.value.token) {
    router.push('/auth/login')
  }
})
</script>

<template>
  <v-container fluid>
    <v-row class="justify-center">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <h1 class="text-h4 font-weight-bold">{{ welcomeMessage }}</h1>
        <p class="text-h6 mt-2">Hola, <strong>{{ userName }}</strong>. Aquí puedes gestionar tus tareas, eventos y notas.</p>
      </v-col>
    </v-row>

    <v-row class="mt-5">
      <v-col cols="12" md="4">
        <v-card class="pa-4" @click="router.push('/tasks')">
          <v-icon size="40" color="primary">mdi-check-circle</v-icon>
          <h3 class="mt-2">Tareas</h3>
          <p>Gestiona tus tareas pendientes y completadas.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4" @click="router.push('/events')">
          <v-icon size="40" color="blue">mdi-calendar</v-icon>
          <h3 class="mt-2">Eventos</h3>
          <p>Administra tus eventos importantes.</p>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4" @click="router.push('/notes')">
          <v-icon size="40" color="green">mdi-note-text</v-icon>
          <h3 class="mt-2">Notas</h3>
          <p>Guarda y organiza tus notas.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
v-card {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}
v-card:hover {
  transform: scale(1.05);
}
</style>
