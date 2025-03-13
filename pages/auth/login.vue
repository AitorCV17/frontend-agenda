<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const correo = ref('')
const contraseña = ref('')
const msgAlert = ref('')
const loading = ref(false)

const router = useRouter()
const { login } = useAuth()

const onSubmit = async () => {
  msgAlert.value = ''
  if (!correo.value || !contraseña.value) {
    msgAlert.value = 'Por favor, rellena todos los campos.'
    return
  }
  loading.value = true
  const result = await login(correo.value, contraseña.value)
  loading.value = false
  if (result.success) {
    router.push('/inicio')
  } else {
    msgAlert.value = result.msg || 'Error en el login'
  }
}

// Indica que use el layout "auth"
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
            <h1 class="mb-4">Iniciar sesión</h1>
            <p class="text-medium-emphasis mb-4">Ingresa tus datos</p>

            <!-- Campo Correo -->
            <v-text-field
              v-model="correo"
              label="Correo"
              type="email"
              prepend-inner-icon="fluent:mail-24-regular"
              outlined
              class="mb-3"
            />

            <!-- Campo Contraseña -->
            <v-text-field
              v-model="contraseña"
              label="Contraseña"
              type="password"
              prepend-inner-icon="fluent:password-20-regular"
              outlined
              class="mb-3"
            />

            <!-- Mensaje de error -->
            <v-alert v-if="msgAlert" type="error" dense outlined class="mb-3">
              {{ msgAlert }}
            </v-alert>

            <!-- Botón Ingresar -->
            <v-btn :loading="loading" color="primary" variant="elevated" block class="mb-4" @click="onSubmit">
              Ingresar
            </v-btn>

            <!-- Enlace a Registro -->
            <div class="text-center">
              <span>¿No tienes cuenta?</span>
              <v-btn variant="text" color="primary" @click="$router.push('/auth/register')">
                Regístrate
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-col>

      <!-- Columna de la imagen -->
      <v-col class="hidden-md-and-down fill-height d-flex align-center justify-center" md="6" lg="7">
        <v-img src="/fondo/fondo1.png" max-width="75%">
          <div class="text-center w-50 text-white mx-auto align-center"></div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>
