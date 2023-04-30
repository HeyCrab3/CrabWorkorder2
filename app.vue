<template>
  <a-config-provider :locale="zhCN"><router-view></router-view></a-config-provider>
</template>
<script setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
const app_config = useAppConfig()
dayjs.locale('zh-cn')
useHead({
  title: app_config.title,
  script: [
    {src: '/gt.js', type: 'text/javascript'}
  ]
})
</script>
<style>
@font-face {
  font-family: HonorSansCN;
  src: url(/HONORSansCN-Regular.ttf)
}
html, body, #__nuxt, .ant-layout{
  height: 100%;
  font-family: HonorSansCN, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
}
</style>