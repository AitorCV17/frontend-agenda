<script setup lang="ts">
/**
 * Interfaz para la respuesta de /usuario/list.
 * Ajusta los nombres de propiedades según devuelva tu backend.
 */
interface UsuarioListResponse {
  exito: boolean;
  datos: any[];
  msg?: string;
}

import { ref, computed } from 'vue'
import { useAsyncData } from '#app'
import type { Login } from '@/interfaces/Login.Interface'

// Cookies
const baseURL = useCookie("BASE_URL")
const userLogin = useCookie<Login | null>("user")

// Control del diálogo para crear/editar
const dialog = ref(false)
const nameModal = ref("Nuevo Usuario")
const isEdit = ref(false)

/**
 * Objeto para crear/editar un usuario
 */
const userEdit = ref({
  id: 0,
  nombres: '',
  correo: '',
  contraseña: '',
  rol: 'REGULAR'
})

/**
 * Carga la lista de usuarios usando useAsyncData.
 * - "usuarios" es un key único para Nuxt.
 */
const { data: userData, pending, error, refresh } = await useAsyncData<UsuarioListResponse>('usuarios', () => {
  return $fetch(`${baseURL.value}/usuario/list`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userLogin.value?.token}`,
    },
  })
})

/**
 * Computed que retorna la lista de usuarios ordenada de forma ascendente por id, 
 * si exito = true, o un array vacío en caso contrario.
 */
const users = computed<any[]>(() => {
  if (!userData.value?.exito) return []
  return [...userData.value.datos].sort((a, b) => a.id - b.id)
})

/**
 * Inicia la creación de un nuevo usuario
 */
function onClickNewUser() {
  nameModal.value = "Nuevo Usuario"
  isEdit.value = false
  userEdit.value = {
    id: 0,
    nombres: '',
    correo: '',
    contraseña: '',
    rol: 'REGULAR'
  }
  dialog.value = true
}

/**
 * Prepara la edición de un usuario existente
 */
function onClickEditUser(user: any) {
  nameModal.value = "Editar Usuario"
  isEdit.value = true
  // Se reinicia la contraseña para obligar a introducir una nueva si se desea
  userEdit.value = {
    id: user.id,
    nombres: user.nombres,
    correo: user.correo,
    contraseña: '',
    rol: user.rol || 'REGULAR'
  }
  dialog.value = true
}

/**
 * Crea o actualiza un usuario y luego refresca la lista
 */
async function saveUser() {
  if (isEdit.value) {
    // Actualizar usuario
    const { data } = await useFetch<any>(`${baseURL.value}/usuario`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userLogin.value?.token}`,
      },
      body: userEdit.value,
    })
    if (data.value && data.value.exito) {
      await refresh() // Refrescamos la lista
    }
  } else {
    // Crear usuario nuevo
    const { data } = await useFetch<any>(`${baseURL.value}/usuario`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userLogin.value?.token}`,
      },
      body: userEdit.value,
    })
    if (data.value && data.value.exito) {
      await refresh() // Refrescamos la lista
    }
  }
  dialog.value = false
}

/**
 * Elimina un usuario y refresca la lista
 */
async function onClickDeleteUser(id: number) {
  const { data } = await useFetch<any>(`${baseURL.value}/usuario/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userLogin.value?.token}`,
    },
  })
  if (data.value && data.value.exito) {
    await refresh()
  }
}
</script>

<template>
  <v-container fluid>
    <!-- Si hay error al cargar la data -->
    <div v-if="error">
      <v-alert type="error">
        Error al cargar usuarios: {{ error }}
      </v-alert>
    </div>

    <!-- Mientras esté cargando (pending) -->
    <div v-else-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- Una vez que la data está lista -->
    <div v-else>
      <v-row>
        <v-col cols="12" lg="8" class="justify-center">
          <h2>CRUD de Usuarios</h2>
        </v-col>
        <v-col cols="12" lg="4">
          <v-btn block color="blue" variant="elevated" @click="onClickNewUser">
            Nuevo Usuario
          </v-btn>
        </v-col>
      </v-row>

      <!-- Listado de usuarios -->
      <v-row class="mt-5" v-if="users.length">
        <v-col
          v-for="user in users"
          :key="user.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card>
            <v-card-title>{{ user.nombres }}</v-card-title>
            <v-card-subtitle>{{ user.correo }}</v-card-subtitle>
            <v-card-subtitle v-if="user.rol">
              Rol: {{ user.rol }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn color="blue" variant="text" @click="onClickEditUser(user)">
                Editar
              </v-btn>
              <v-btn color="red" variant="text" @click="onClickDeleteUser(user.id)">
                Eliminar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Diálogo para crear/editar usuario -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>{{ nameModal }}</v-card-title>
          <v-card-text>
            <v-text-field label="Nombres" v-model="userEdit.nombres" />
            <v-text-field label="Correo" v-model="userEdit.correo" />
            <v-text-field
              label="Contraseña"
              v-model="userEdit.contraseña"
              type="password"
            />
            <!-- Select para escoger el rol -->
            <v-select
              label="Rol"
              v-model="userEdit.rol"
              :items="['REGULAR', 'ADMIN']"
              clearable
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" variant="text" @click="dialog = false">
              Cancelar
            </v-btn>
            <v-spacer />
            <v-btn color="primary" variant="elevated" @click="saveUser()">
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
