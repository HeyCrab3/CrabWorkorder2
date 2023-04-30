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
          <a-typography-title :level="3">用户</a-typography-title>
          <a-spin :spinning="loading">
            <a-table style="animation: slider 2s" :columns="columns" :data-source="data">
            </a-table>
          </a-spin>
        </a-layout-content>
      </a-layout>
      <a-tooltip><template #title>刷新</template><a-button @click="getUserInfo" type="primary" size="large" shape="circle" style="float: right; position: fixed; bottom: 5%; right: 2%;"><template #icon><ArrowsAltOutlined/></template></a-button></a-tooltip>
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
    DatabaseOutlined,
    ArrowsAltOutlined
  } from '@ant-design/icons-vue';
  import { defineComponent, ref } from 'vue';
  import Axios from 'axios'
  //import { isPassedVerificationInt, GetStatusCode } from '../../modules/StatusCodeParser'
import { message, Modal } from 'ant-design-vue';
import { number } from 'vue-types';
    const selectedKeys = ref(['3'])
    const collapsed = ref(false)
    const router = useRouter();
    let username = ref()
    let data = ref([])
    let loading = ref(true)
    const app_config = useAppConfig()
    useHead({title: '用户 | ' + app_config.title})
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
    const columns = [
        {
            title: '用户ID',
            key: '_id',
            dataIndex: '_id'
        },
        {
            title: '用户名',
            key: 'userName',
            dataIndex: 'userName'
        },
        {
            title: '昵称',
            key: 'nickName',
            dataIndex: 'nickName'
        },
        {
            title: '绑定的游戏ID',
            key: 'gameID',
            dataIndex: 'gameID'
        },
        {
            title: '权限',
            key: 'perm',
            dataIndex: 'perm'
        }
    ]
    const getUserInfo = () => {
        loading.value = true
        Axios({
            url: '/api/admin/userData'
        })
        .then(function(Response){
            var isPassed = Response['data']['code']
            if (isPassed == 0){
                console.log(Response['data'])
                var b = []
                for (var i = 0; i < Response['data']['userdata'].length; i++){
                    if (Response['data']['userdata'][i]['perm'] == 1){
                        var a = {
                            _id: Response['data']['userdata'][i]['_id']['$oid'],
                            userName: Response['data']['userdata'][i]['userName'],
                            nickName: Response['data']['userdata'][i]['nickName'],
                            gameID: Response['data']['userdata'][i]['gameID'],
                            perm: '普通玩家'
                        }
                    }
                    else if (Response['data']['userdata'][i]['perm'] == 5){
                        var a = {
                            _id: Response['data']['userdata'][i]['_id']['$oid'],
                            userName: Response['data']['userdata'][i]['userName'],
                            nickName: Response['data']['userdata'][i]['nickName'],
                            gameID: Response['data']['userdata'][i]['gameID'],
                            perm: '客服'
                        }
                    }
                    else if (Response['data']['userdata'][i]['perm'] == 6){
                        var a = {
                            _id: Response['data']['userdata'][i]['_id']['$oid'],
                            userName: Response['data']['userdata'][i]['userName'],
                            nickName: Response['data']['userdata'][i]['nickName'],
                            gameID: Response['data']['userdata'][i]['gameID'],
                            perm: '志愿'
                        }
                    }
                    else if (Response['data']['userdata'][i]['perm'] == 10){
                        var a = {
                            _id: Response['data']['userdata'][i]['_id']['$oid'],
                            userName: Response['data']['userdata'][i]['userName'],
                            nickName: Response['data']['userdata'][i]['nickName'],
                            gameID: Response['data']['userdata'][i]['gameID'],
                            perm: '运维/管理/服主'
                        }
                    }
                    else{
                        var a = {
                            _id: Response['data']['userdata'][i]['_id']['$oid'],
                            userName: Response['data']['userdata'][i]['userName'],
                            nickName: Response['data']['userdata'][i]['nickName'],
                            gameID: Response['data']['userdata'][i]['gameID'],
                            perm: '未知权限（不在范围内）'
                        }
                    }
                    b.push(a)
                }
                data.value = b
                console.log(b)
                loading.value = false;
            }else{
                message.warn('登录已失效，请重新登录')
                router.push('/user/login')
                loading.value = false;
            }
        })
        .catch(function(error){
            message.error('错误！' + error)
            console.error('错误！' + error)
        })
    }
    getUserInfo()
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
  