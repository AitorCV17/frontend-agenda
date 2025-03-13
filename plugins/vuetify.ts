import '@mdi/font/css/materialdesignicons.css' // Iconos de Material Design
import 'vuetify/styles'                        // Estilos principales de Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    // Configuración opcional (temas, iconos, etc.)
    // theme: { defaultTheme: 'light' },
    // icons: { defaultSet: 'mdi' },
  })

  nuxtApp.vueApp.use(vuetify)
})
