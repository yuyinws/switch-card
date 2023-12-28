import turboConsole from 'vite-plugin-turbo-console'
import { pwa } from './config/pwa'

export default defineNuxtConfig({
  devServer: {
    port: 5876,
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    'dayjs-nuxt',
    '@nuxt/test-utils/module',
    '@vite-pwa/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
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
      routes: ['/'],
      crawlLinks: false,
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Discover your Switch account infomation' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  // anu: {
  //   themes: {
  //     light: {
  //       colors: {
  //         primary: '2, 69%, 49%',
  //       },
  //     },
  //     dark: {
  //       colors: {
  //         primary: '2, 69%, 49%',
  //       },
  //     },
  //   },

  // },
  shadcn: {
    prefix: 'S',
    componentDir: './components/ui',
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
  pwa,

  build: {
    transpile: ['vue-sonner'],
  },
})
