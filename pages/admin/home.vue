<template>
    <a-layout>
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo__vertical" v-if="app_config.logo.isEnabled == true">
            <img src="https://www.cloudsdale.site/assets/img/favicon.png" alt="logo"/>
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
          <router-link to="home"><a-menu-item key="1">
            <home-outlined />
            主页
          </a-menu-item></router-link>
          <router-link to="ticket"><a-menu-item key="2">
            <form-outlined />
            工单
          </a-menu-item></router-link>
          <router-link to="user"><a-menu-item key="3">
            <user-outlined />
            用户
          </a-menu-item></router-link>
          <router-link to="db"><a-menu-item key="4">
            <database-outlined />
            数据库
          </a-menu-item></router-link>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="() => (collapsed = !collapsed)"
          />
          <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          <a-dropdown>
            <span class="user" style="float: right; position: relative; right: 30px"><a-avatar size="small" style="margin-right: 10px"><template #icon><UserOutlined /></template></a-avatar>{{ username }}<down-outlined style="margin-left: 10px"/></span>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="/">回到主页</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="/api/logout">退出登录</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-layout-header>
        <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }">
          <a-typography-title :level="3">主页</a-typography-title>
          <a-spin :spinning="loading">
            <div class="card-list">
              <a-card>
                <a-statistic title="当前权限" :value="permission" style="margin-right: 50px" />
              </a-card>
              <a-card>
                <a-statistic title="平台工单总数" :value="platform_ticket_num" style="margin-right: 50px" />
              </a-card>
              <a-card>
                <a-statistic title="处理中" :value="processing_ticket_num" style="margin-right: 50px" />
              </a-card>
              <a-card>
                <a-statistic title="已关闭" :value="closed_ticket_num" style="margin-right: 50px" />
              </a-card>
            </div>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </template>
  <script lang="ts" setup>
  import {
    UserOutlined,
    HomeOutlined,
    DownOutlined,
    FormOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DatabaseOutlined
  } from '@ant-design/icons-vue';
  import { defineComponent, ref } from 'vue';
  import Axios from 'axios'
  //import { isPassedVerificationInt, GetStatusCode } from '../../modules/StatusCodeParser'
import { message, Modal } from 'ant-design-vue';
import { number } from 'vue-types';
    const selectedKeys = ref(['1'])
    const collapsed = ref(false)
    const router = useRouter();
    let platform_ticket_num = ref('Loading...')
    let user_ticket_num = ref('Loading...')
    let processing_ticket_num = ref('Loading...')
    let permission = ref('Loading...')
    let closed_ticket_num = ref('Loading...')
    let username = ref()
    let loading = ref(true)
    const app_config = useAppConfig()
    useHead({title: '主页 | ' + app_config.title})
    Axios({
        url: '/api/admin/getPermission',
    })
    .then(function(Response){
        var isPassed = Response['data']['code']
        if (isPassed == 0){
            console.log('鉴权通过')
        }else{
            message.warn('权限不够')
            router.push('/')
        }
    })
    .catch(function(error){
        message.error('错误！' + error)
        console.error('错误！' + error)
    })
    Axios({
        url: '/api/user/me'
    })
    .then(function(Response){
        var isPassed = Response['data']['code']
        if (isPassed == 0){
            console.log(Response['data'])
            username.value = Response['data']['userdata']['nickName']
        }else{
            message.warn('登录已失效，请重新登录')
            router.push('/user/login')
        }
    })
    .catch(function(error){
        message.error('错误！' + error)
        console.error('错误！' + error)
        message.warn('登录已失效，请重新登录')
        router.push('/user/login')
    })
    Axios({
        url: '/api/ticket/overall'
    })
    .then(function(Response){
        var isPassed = Response['data']['code']
        if (isPassed == 0){
            console.log(Response['data'])
            loading.value = false;
            platform_ticket_num.value = Response['data']['platformTicketNum']
            user_ticket_num.value = Response['data']['userTicketNum']
            processing_ticket_num = Response['data']['processingNum']
            closed_ticket_num = Response['data']['closeNum']
            permission = Response['data']['userPerm']
        }else{
            message.warn('登录已失效，请重新登录')
        }
    })
    .catch(function(error){
        message.error('错误！' + error)
        console.error('错误！' + error)
    })
  </script>
  <style>
    .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .trigger:hover {
    color: #1890ff;
  }
   .logo__vertical {
    height: 32px;
    margin: 16px;
    margin-left: 24px;
  }
  .flex-grow{
    flex-grow: 1;
  }
  .card-list{
    display: flex;
    transition: 0.3s;
  }
  .card-list .ant-card{
    animation: silder 1s;
    margin-right: 10px;
  }
  @keyframes silder {
    0%{
      opacity: 0;
      margin-top: 20px
    }
    100%{
      opacity: 1.0;
      margin-top: 0;
    }
  }
  .site-layout .site-layout-background {
    background: #fff;
  }
  </style>
  