import turboConsole from 'vite-plugin-turbo-console'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@anu-vue/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    'dayjs-nuxt',
  ],
  ssr: false,
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
  ],

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  anu: {
    themes: {
      light: {
        colors: {
          primary: '2, 69%, 49%',
        },
      },
      dark: {
        colors: {
          primary: '2, 69%, 49%',
        },
      },
    },

  },

  piniaPersistedstate: {
    storage: 'localStorage',
  },

  devtools: {
    enabled: true,
  },

  vite: {
    plugins: [turboConsole()],
  },

  build: {
    transpile: ['vue-sonner'],
  },
})
