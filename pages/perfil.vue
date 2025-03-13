<script setup lang="ts">
import { ref } from 'vue'
import { useCookie, useFetch } from '#app'
import { useRouter } from 'vue-router'
import type { Login } from '~/interfaces/Login.Interface'

// Definimos la interfaz para la respuesta del endpoint de actualización
interface UpdateProfileResponse {
  exito: boolean;
  msg?: string;
}

// Obtén el usuario actual de la cookie
const userCookie = useCookie<Login | null>("user")
const router = useRouter()

// Variables reactivas para el formulario de edición
const name = ref(userCookie.value?.name || '')
const email = ref(userCookie.value?.email || '')
const password = ref('') // Campo opcional para actualizar contraseña

// Mensajes y estado de carga
const msgAlert = ref('')
const loading = ref(false)

async function updateProfile() {
  msgAlert.value = ''
  loading.value = true
  
  try {
    // Preparamos el objeto a enviar; si hay password, lo incluimos
    const payload = {
      name: name.value,
      email: email.value,
      ...(password.value ? { password: password.value } : {})
    }
    console.log("Payload enviado:", JSON.stringify(payload, null, 2));


    // Obtenemos la URL base de la cookie
    const baseURL = useCookie("BASE_URL").value

    // Llamamos al endpoint PUT /usuario
    const { data, error } = await useFetch<UpdateProfileResponse>(`${baseURL}/usuario`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userCookie.value?.token}`
      },
      body: payload
    })
    
    loading.value = false

    if (error.value) {
      throw new Error(error.value.message)
    }

    if (data.value && data.value.exito) {
      msgAlert.value = 'Perfil actualizado correctamente.'
      // Actualizamos la cookie, forzando el tipo Login
      if (userCookie.value) {
        userCookie.value = { ...userCookie.value, name: name.value, email: email.value } as Login;
      }
    } else {
      throw new Error(data.value?.msg || 'Error desconocido')
    }
  } catch (err) {
    loading.value = false
    msgAlert.value = (err as Error).message || 'Error al actualizar el perfil'
  }
}
</script>

<template>
  <v-container fluid>
    <h1>Editar Perfil</h1>
    <v-form @submit.prevent="updateProfile">
      <v-text-field label="Nombre" v-model="name" outlined required />
      <v-text-field label="Correo" v-model="email" outlined required />
      <!-- Campo opcional para actualizar la contraseña -->
      <v-text-field label="Nueva Contraseña" v-model="password" type="password" outlined />
      <v-alert v-if="msgAlert" type="info">{{ msgAlert }}</v-alert>
      <v-btn :loading="loading" color="primary" variant="elevated" type="submit">
        Guardar Cambios
      </v-btn>
    </v-form>
  </v-container>
</template>
