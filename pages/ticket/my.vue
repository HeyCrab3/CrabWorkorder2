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
            <span class="user" style="float: right; position: relative; right: 30px"><a-avatar size="small" style="margin-right: 10px"><template #icon><UserOutlined /></template></a-avatar>{{ userdata['nickName'] }}<down-outlined style="margin-left: 10px"/></span>
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
          <a-typography-title :level="3">用户</a-typography-title>
          <a-spin :spinning="loading">
            <a-card title="用户信息">
              <a-avatar size="large"><template #icon><UserOutlined/></template></a-avatar>
              <span style="font-size: 1.25rem; display: inline-block; margin-left: 20px; top: -2px; position: relative;">{{ userdata['nickName'] }} ({{userdata['userName']}})</span>
              <span v-if="userdata['perm'] == 10" style="display: block; margin-left: 20px; left: 40px; top: -2px; position: relative;">运维/管理/服主</span>
              <span v-else-if="userdata['perm'] == 6" style="display: block; margin-left: 20px; left: 40px; top: -2px; position: relative;">客服/子管理员</span>
              <span v-else-if="userdata['perm'] == 5" style="display: block; margin-left: 20px; left: 40px; top: -2px; position: relative;">志愿/玩家协管</span>
              <span v-else-if="userdata['perm'] == 1" style="display: block; margin-left: 20px; left: 40px; top: -2px; position: relative;">普通用户</span>
              <span v-else style="display: block; margin-left: 20px; left: 40px; top: -2px; position: relative; color: red; font-weight: 600;">权限未知或请求数据错误，请联系管理员</span>
              <div class="btn-group"><a-button type="primary" @click="showUserID">查看用户标识符</a-button><a-button @click="a">更改昵称</a-button><a-button @click="b">更改密码</a-button></div>
            </a-card>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal :confirm-loading="m" :visible="o1" title="更改昵称" @ok="changeNM" @cancel="o1 = false">
      <p>在下方输入新的昵称</p>
      <a-input v-modal:value="f" placeholder="新的昵称" />
    </a-modal>
    <a-modal :confirm-loading="b2" :visible="o2" title="更改密码" @ok="changePD" @cancel="o2 = false">
      <a-input v-modal:value="pwd1" placeholder="原密码" />
      <a-input style="margin-top: 10px" v-modal:value="pwd2" placeholder="新密码" />
      <a-input style="margin-top: 10px" v-modal:value="pwd3" placeholder="确认密码" />
    </a-modal>
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
    const selectedKeys = ref(['3'])
    const collapsed = ref(false)
    const router = useRouter();
    let o1= ref(false)
    let o2 = ref(false)
    let userdata = ref({})
    let loading = ref(true)
    let n = ref('')
    let pwd1 = ref('')
    let pwd2 = ref('')
    let pwd3 = ref('')
    let m = ref(false)
    let b2 = ref(false)
    const f = ref('用户')
    const a = () => {
      o1.value = true
      console.log(1)
    };
    const b = () => {
      o2.value = true
    };
    const showUserID = () => {
      Modal.info({
        title: '用户标识符',
        content: userdata.value['_id']['$oid']
      })
    }
    const changeNM = () => {
      console.log(f.value)
      m.value = true
      Axios({
        method: 'POST',
        url: '/api/user/changenick',
        data: { nick: f.value }
      })
      .then(function(Response){
        m.value = false
        var isPassed = Response['data']['code']
        if (isPassed == 0){
            console.log(Response['data'])
            o1.value = false
            message.success(Response['data']['msg'])
        }else{
            message.warn(Response['data']['msg'])
        }
      })
      .catch(function(error){
          m.value = false
          message.error(error)
      })
    }
    const changePD = () => {
      
    }

    const app_config = useAppConfig()
    useHead({title: '我的 | ' + app_config.title})
    Axios({
        url: '/api/user/me'
    })
    .then(function(Response){
        var isPassed = Response['data']['code']
        if (isPassed == 0){
            console.log(Response['data'])
            userdata.value = Response['data']['userdata']
            loading.value = false
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
  .btn-group{
    margin-top: 6px;
  }
  .btn-group .ant-btn{
    margin-right: 5px;
  }
  </style>
  