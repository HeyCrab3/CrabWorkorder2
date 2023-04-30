<template>
    <a-layout class="layout" :style="{background: app_config.appBackground.isEnabled?`url(${app_config.appBackground.url})`:'#FFFFFF'}">
      <a-layout-header>
        <div class="logo"><img v-if="app_config.logo.isEnabled == true" :src="app_config.logo.url" style="width: 20px;" alt="unt logo"/>  {{ app_config.title }}<a-badge :text="'v' + app_config.version"/></div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1"><template #icon><home-outlined /></template>主页</a-menu-item>
          <a-menu-item key="2"><template #icon><question-outlined /></template><a href="/ticket/home">工单平台</a></a-menu-item>
          <a-menu-item key="3"><template #icon><api-outlined /></template><a :href="app_config.homeUrl">官网</a></a-menu-item>
          <a-menu-item key="4" v-if="app_config.isNewVersion == true"><template #icon><api-outlined /></template><a :href="app_config.oldVersionUri">返回旧版</a></a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content style="padding: 0 50px">
        <div class="site-layout-content">
          <a-carousel v-if="app_config.sliderContentManager.isEnabled == true" style="height: 400px" autoplay>
            <div class="slick-silde" v-if="app_config.mcServerStatus.isEnabled == true">
              <div style="background: url(/mc.webp); text-align: center; height: 300px;">
                <div style="position: relative; height: 100%; background: #FFFFFFd8; backdrop-filter: blur(15px);"><div style="position: relative; top: 60px;"><h2>欢迎加入我们的服务器</h2>
                <p>与 {{ online }} 位玩家一起在无尽的世界里游玩吧！</p>
                <a-typography-paragraph copyable>{{ app_config.mcServerStatus.serverIp }}</a-typography-paragraph></div></div>
              </div>
            </div>
            <div class="slick-silde" v-for="item in app_config.sliderContentManager.content">
              <div :style="{'background': `url(${item['backgroundUri']})`, 'text-align': 'center', 'height': '300px'}">
                <div style="position: relative; height: 100%; background: #FFFFFFd8; backdrop-filter: blur(15px);"><div style="position: relative; top: 60px;"><h2>{{ item['title'] }}</h2>
                <p>{{item['text']}}</p>
                <div style="margin-top: 20px">
                  <button v-for="btn in item['buttons']" class="b-btn"><a style="text-decoration: none; color: #FFF" :href="btn['route']">{{ btn['content'] }}</a></button>
                </div></div></div>
              </div>
            </div>
          </a-carousel>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        {{ app_config.footer }}
      </a-layout-footer>
    </a-layout>
  </template>
  <script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import Axios from 'axios'
  import { HomeOutlined, QuestionOutlined, ApiOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue';
  const selectedKeys = ref(['1'])
  const app_config = useAppConfig()
  const serverData = ref({})
  const online = ref(-1)
  useHead({title: '主页 | ' + app_config.title})
  if (app_config.sliderContentManager.isEnabled == false){
    console.warn('Warn: 我们推荐您启用 Slider 内容管理功能，可以为用户提供更多的内容')
  }
  if (app_config.mcServerStatus.isEnabled == true){
    Axios({
      url: app_config.mcServerStatus.apiUri + app_config.mcServerStatus.serverIp
    })
    .then(function(Response){
      serverData.value = Response['data']
      online.value = Response['data']['p']
    })
    .catch(function(error){
      message.error('未能获取服务器在线人数：' + error)
    })
  }
  </script>
  <style>
  .ant-layout-header{
    transition: 0.5s;
    background: #ffffffd8;
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
    backdrop-filter: blur(25px);
  }
  .b-btn{
    transition: 0.3s;
    width: 100px;
    height: 40px;
    border-radius: 5px;
    background-color: #940194;
    box-shadow: 0px 0px 0.5px #940194;
    color:  #FFF;
    margin-right: 10px;
    border: 0
  }
  .b-btn:hover{
    transition: 0.3s;
    background-color: #db10db;
    box-shadow: 0px 0px 10px #940194;
    cursor: pointer;
  }
  .ant-carousel :deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}

.ant-carousel :deep(.slick-slide h3) {
  color: #fff;
}
  .ant-layout-header .ant-menu-horizontal{
    transition: 0.5s;
    background: transparent;
    border-bottom: 0px;
    display: inline-block;
    position: relative;
    bottom: 5px;
    margin-bottom: 2px;
  }
  .ant-layout{
    transition: 0.3s;
  }
  .site-layout-content {
    min-height: 80%;
    padding: 24px;
    background: #ffffffd2;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    transition: 0.3s;
    margin-top: 30px;
  }
  .logo {
    display: inline-block;
    width: 15rem;
    font-size: 1.3rem;
  }
  .ant-row-rtl #components-layout-demo-top .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }
  .slick-slide, .slick-slider{
    text-align: center;
    height: 300px
  }
  </style>
  