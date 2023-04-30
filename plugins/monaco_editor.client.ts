import * as monaco from 'monaco-editor'
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(monaco)
})