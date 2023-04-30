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
          <router-link to="myticket"><a-menu-item key="2">
            <form-outlined />
            工单
          </a-menu-item></router-link>
          <router-link to="my"><a-menu-item key="3">
            <user-outlined />
            我的
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
            <a-page-header title="新建工单" @back="() => router.push('myticket')">
            </a-page-header>
          <a-spin :spinning="loading">
                <div style="padding: 20px">
                    <a-alert class="a" message="注意" description="提问时请参见提问的智慧：https://lug.ustc.edu.cn/wiki/doc/smart-questions/，如果不看瞎问问题工单不受理直接关闭，自行解决！" type="warning" show-icon/>
                    <a-form class="a" style="margin-top: 20px;" @finish="submit">
                        <a-form-item
                        label="工单标题"
                        name="title"
                        >
                        <a-input v-model:value="c.title" />
                        </a-form-item>
                        <a-form-item
                        label="工单内容"
                        name="content"
                        >
                        <a-textarea v-model:value="c.content" />
                        </a-form-item>

                        <a-form-item>
                        <a-button type="primary" html-type="submit" @click="submit">提交</a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-backtop></a-backtop>
  </template>
  <script lang="ts" setup>
  import {
    UserOutlined,
    HomeOutlined,
    DownOutlined,
    FormOutlined,
    FieldTimeOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ApiOutlined,
    InfoCircleOutlined
  } from '@ant-design/icons-vue';
  import { defineComponent, ref } from 'vue';
  import Axios from 'axios'
  //import { isPassedVerificationInt, GetStatusCode } from '../../modules/StatusCodeParser'
import { message, Modal } from 'ant-design-vue';
    const selectedKeys = ref(['2'])
    interface c1 {
        title: string,
        content: string
    }
    const c = reactive<c1>({
        title: '',
        content: ''
    })
    const collapsed = ref(false)
    const router = useRouter();
    let username = ref()
    let loading = ref(false)
    const app_config = useAppConfig()
    useHead({title: '新建工单 | ' + app_config.title})
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

    const submit = () => {
        if (c.content == '' || c.title == ''){
            message.warn('工单标题和工单内容为必填项')
        }else{
            Axios({
                url: '/api/ticket/new',
                method: 'POST',
                data: {
                    title: c.title,
                    content: c.content
                }
            })
            .then(function(Response){
                var isPassed = Response['data']['code']
                loading.value = false;
                if (isPassed == 0){
                    message.success('工单已成功添加')
                    router.push('myticket')
                }else{
                    message.warn(Response['data']['msg'])
                }
            })
            .catch(function(error){
                message.error('错误！' + error)
                console.error('错误！' + error)
                loading.value = false;
            })
        }
    }
  </script>
  <style>
    .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }
  .fade{
    transition: 0.5s;
    background: #0000009c;
    backdrop-filter: blur(25px);
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 999;
    float: inherit;
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
  .a{
    animation: slider 2s;
  }
  .site-layout .site-layout-background {
    background: #fff;
  }
  .btn-group .ant-btn{
    margin-right: 5px;
  }
  </style>
  