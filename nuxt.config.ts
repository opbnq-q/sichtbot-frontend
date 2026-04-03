import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css', 'vue-sonner/style.css'],
  pages: true,

  runtimeConfig: {
    public: {
      baseUrl: ''
    }
  },

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  modules: [
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/image'
  ],
  shadcn: {
    componentDir: `@/components/ui`
  },
  colorMode: {
    classSuffix: ''
  },
  routeRules: {
    '/auth': {
      ssr: false
    }
  }
})