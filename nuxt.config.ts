import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  pages: true,

  vite: {
    plugins: [
      tailwindcss()
    ]
  },

  modules: ['shadcn-nuxt', '@vueuse/nuxt'],
  shadcn: {
    componentDir: `@/components/ui`
  }
})
