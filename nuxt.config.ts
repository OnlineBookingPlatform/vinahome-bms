// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss',],
  
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Phần Mềm Nhà Xe - VinaHome",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          name: "description",
          content: "VinaHome",
        },
        {
          name: "og:title",
          content: "VinaHome",
        },
        {
          name: "og:description",
          content: "VinaHome",
        },
        {
          name: "og:site_name",
          content: "VinaHome",
        },
      ],
    },
  },
})