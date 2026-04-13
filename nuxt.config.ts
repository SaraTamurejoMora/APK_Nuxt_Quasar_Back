// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  
  runtimeConfig: {
    session: {
      password: 'ASIUDOIWN1IOFXVOH8W9380TR9TUISDV890230N2TN42895279HD',
    },
    oauth: {
    github: {
        clientId: 'Ov23liEV79vHtGIDH7Pz',
        clientSecret: 'a86309b4a2324541179ee233fc58b8417ec3a3a8'
      }
    }
  }

});
