<!-- /layouts/default.vue -->
<script setup lang="ts">
const config = useRuntimeConfig()
const baseURL = useCookie("BASE_URL")
baseURL.value = config.public.baseURL
</script>

<template>
  <v-app>
    <SideBar />
    <NavBar />
    <VMain>
      <slot />
    </VMain>
  </v-app>
</template>
