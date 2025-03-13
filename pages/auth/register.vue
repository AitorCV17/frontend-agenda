<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const name = ref('')        // Renombrado de "nombres" a "name"
const correo = ref('')
const contraseña = ref('')
const confirmarContraseña = ref('')
const msgAlert = ref('')
const loading = ref(false)

const router = useRouter()
const { register } = useAuth()

const onSubmit = async () => {
  msgAlert.value = ''
  if (!name.value || !correo.value || !contraseña.value || !confirmarContraseña.value) {
    msgAlert.value = 'Por favor, completa todos los campos.'
    return
  }
  if (contraseña.value !== confirmarContraseña.value) {
    msgAlert.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  const result = await register(name.value, correo.value, contraseña.value)
  loading.value = false
  if (result.success) {
    router.push('/auth/login')
  } else {
    msgAlert.value = result.msg || 'Error en el registro'
  }
}

definePageMeta({
  layout: 'auth'
})
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row no-gutters class="fill-height d-flex align-center justify-center">
      <v-col cols="12" md="6" lg="5" sm="6">
        <v-row no-gutters class="d-flex align-center justify-center">
          <v-col cols="12" md="8" lg="8" sm="10">
            <h1 class="mb-4">Registro</h1>
            <p class="text-medium-emphasis mb-4">Crea tu cuenta</p>
            <v-text-field v-model="name" label="Nombre" outlined class="mb-3" />
            <v-text-field v-model="correo" label="Correo" type="email" outlined class="mb-3" />
            <v-text-field v-model="contraseña" label="Contraseña" type="password" outlined class="mb-3" />
            <v-text-field v-model="confirmarContraseña" label="Confirmar Contraseña" type="password" outlined class="mb-3" />
            <v-alert v-if="msgAlert" type="error" dense outlined class="mb-3">
              {{ msgAlert }}
            </v-alert>
            <v-btn :loading="loading" color="primary" variant="elevated" block class="mb-4" @click="onSubmit">
              Registrarse
            </v-btn>
            <div class="text-center">
              <span>¿Ya tienes cuenta?</span>
              <v-btn variant="text" color="primary" @click="$router.push('/auth/login')">
                Inicia Sesión
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="hidden-md-and-down fill-height d-flex align-center justify-center" md="6" lg="7">
        <v-img src="/fondo/fondo1.png" max-width="75%">
          <div class="text-center w-50 text-white mx-auto align-center"></div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
