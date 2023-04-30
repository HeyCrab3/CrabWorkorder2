// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    plugins: [
        {
            src: '@/plugins/monaco_editor.client.ts',
            ssr: false
        }
    ],
    nitro: {
        devProxy: {
            "/api": {
                target: "http://localhost:19198/api", // 这里是接口地址
                changeOrigin: true,
                prependPath: true,
            },
            "/app/config": {
                target: "http://localhost:19198/app/config", // 这里是接口地址
                changeOrigin: true,
                prependPath: true,
            },
            "/test": {
                target: "https://list.fansmc.com/api/", // 这里是接口地址
                changeOrigin: true,
                prependPath: true,
            },
        },
    },
    vite:{
        css: {
            preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            }
            },
        }
    },
    vue:{
        
    }
})
