<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useDisplay } from 'vuetify'
import {
  VAppBar,
  VBtn,
  VSpacer,
  VMenu,
  VList,
  VListItem,
  VIcon,
  VListItemTitle,
  VCard,
  VCardText,
  VDivider,
  VAvatar
} from 'vuetify/components'
import type { Login } from '~/interfaces/Login.Interface'
import { useCookie } from '#app'
import { useRouter } from 'vue-router'

// Cookies con valores reactivos
const drawer = useCookie<boolean>("drawer")
const userLogin = useCookie<Login | null>("user")

const { mobile } = useDisplay()
const router = useRouter()

// Computed: Si userLogin no está cargado, devuelve un objeto vacío
const user = computed(() => {
  return userLogin.value ?? { name: "", email: "", role: "Cargando..." };
});

const userInitial = computed(() => user.value?.name?.charAt(0) || '')

// Función para cerrar sesión
const logOut = () => {
  userLogin.value = null
  router.push("/")
}
</script>

<template>
  <VAppBar>
    <!-- Botón para abrir/cerrar el sidebar -->
    <VBtn variant="text" icon="mdi-menu" @click.stop="drawer = !drawer" />
    <VSpacer />
    
    <!-- Menú de usuario: solo se muestra si hay sesión iniciada -->
    <VMenu
      rounded
      :close-on-content-click="false"
      v-if="user.name"
    >
      <template #activator="{ props }">
        <!-- Desktop: avatar + nombre -->
        <VList v-if="!mobile" class="hidden-sm-and-down" v-bind="props" style="cursor: pointer">
          <VListItem>
            <template #prepend>
              <VAvatar color="brown">
                <VIcon>mdi-account</VIcon>
              </VAvatar>
            </template>
            <VListItemTitle>
              {{ user.name }}
            </VListItemTitle>
          </VListItem>
        </VList>
        <!-- Mobile: solo avatar con inicial -->
        <VBtn v-else icon v-bind="props">
          <VAvatar color="brown" size="default">
            <span class="text-h5">{{ userInitial }}</span>
          </VAvatar>
        </VBtn>
      </template>

      <!-- Menú desplegable -->
      <VCard>
        <VCardText>
          <div class="mx-auto text-center">
            <VAvatar color="brown" size="64" class="mb-3">
              <span class="text-h3">{{ userInitial }}</span>
            </VAvatar>
            <h3 class="mb-1">{{ user.name }}</h3>
            <p class="text-body-2">{{ user.email }}</p>
            <p class="text-caption mt-1">
              Rol: {{ user.role || 'N/A' }}
            </p>
            <VDivider class="my-3" />
            <VBtn block variant="text" color="primary" @click="router.push('/perfil')">
              Editar Perfil
            </VBtn>
            <VBtn block rounded variant="elevated" color="error" @click="logOut">
              Salir
            </VBtn>
          </div>
        </VCardText>
      </VCard>
    </VMenu>
  </VAppBar>
</template>
