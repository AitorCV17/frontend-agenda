// Importamos 'vuetify' y 'transformAssetUrls' desde 'vite-plugin-vuetify'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Exportamos la configuración de Nuxt utilizando defineNuxtConfig
export default defineNuxtConfig({
  // Fecha de compatibilidad, importante para asegurar que Nuxt use versiones compatibles
  compatibilityDate: '2024-11-01',
  
  // Configuración de las devtools de Nuxt, activándolas para desarrollo
  devtools: { enabled: true },
  
  // Configuración de build para transpilar ciertos paquetes, en este caso 'vuetify'
  build: {
    transpile: ['vuetify'],
  },
  
  // Array de módulos de Nuxt
  modules: [
    // Módulo personalizado para extender la configuración de Vite
    (_options, nuxt) => {
      // Usamos un hook de Nuxt para extender la configuración de Vite
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // Agregamos el plugin de Vuetify a la configuración de Vite
        config.plugins?.push(
          vuetify({
            // Habilita la importación automática de componentes de Vuetify
            autoImport: true,
          })
        )
      })
    },
    // ... otros módulos que uses
  ],
  
  // Configuración de variables de entorno y otras configuraciones de tiempo de ejecución
  runtimeConfig: {
    public: {
      // Define la URL base para la aplicación, usando la variable de entorno BASE_URL o un valor por defecto
      baseURL: process.env.BASE_URL || 'http://localhost:3020',
    },
  },
  
  // Configuración específica para Vite
  vite: {
    vue: {
      template: {
        // Configuración para transformar URLs de assets en las plantillas de Vue
        transformAssetUrls,
      },
    },
  },
})
