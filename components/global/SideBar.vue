<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { Login } from '~/interfaces/Login.Interface'
import { useCookie } from '#app'

const drawer = useCookie<boolean>("drawer")
const rail = useCookie<boolean>("rail")
rail.value = false
const { mobile } = useDisplay()
const user = useCookie<Login | null>("user")

// Función para validar rol: ahora se compara con 'role'
const isRule = (roleExpected: string) => {
  return user.value && user.value.role === roleExpected;
};

const menus = ref([
  {
    icon: "mdi-home",
    title: "Inicio",
    value: "inicio",
    to: "/inicio",
    view: true,
    toSub: null
  },
  {
    icon: "mdi-note-text",
    title: "Notas",
    value: "notas",
    to: "/notes",
    view: true,
    toSub: null
  },
  {
    icon: "mdi-calendar",
    title: "Eventos",
    value: "eventos",
    to: "/events",
    view: true,
    toSub: null
  },
  {
    icon: "mdi-check-circle",
    title: "Tareas",
    value: "tareas",
    to: "/tasks",
    view: true,
    toSub: null
  },
  {
    icon: "mdi-cog-outline",
    title: "Configuraciones",
    value: "configuraciones",
    to: "#",
    view: isRule("ADMIN"),
    toSub: [
      { title: "Usuarios", value: "usuarios", to: "/configurations/usuarios", view: isRule("ADMIN") },
      { title: "Avanzado", value: "avanzado", to: "/configurations/avanzado", view: isRule("ADMIN") },
    ]
  }
])
</script>

<template>
  <v-navigation-drawer 
    expand-on-hover 
    v-model="drawer" 
    :temporary="mobile" 
    :rail="!mobile ? rail : false"
    theme="dark"
  >
    <v-divider></v-divider>
    <v-list nav>
      <div v-for="menu in menus" :key="menu.to">
        <v-list-item
          v-if="!menu.toSub && menu.view"
          :prepend-icon="menu.icon"
          :title="menu.title"
          :value="menu.value"
          :to="menu.to"
        ></v-list-item>
        <v-list-group
          v-if="menu.toSub && menu.view"
          :value="menu.title"
          class="v-list-group__items"
        >
          <template #activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="menu.icon" :title="menu.title"></v-list-item>
          </template>
          <div v-for="subMenu in menu.toSub" :key="subMenu.to">
            <v-list-item
              v-if="subMenu.view"
              height="12px"
              prepend-icon="mdi-vector-point"
              :title="subMenu.title"
              :value="subMenu.value"
              :to="subMenu.to"
            ></v-list-item>
          </div>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<style>
.v-list-group__items {
  --indent-padding: -0.50rem !important;
}
</style>
