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
          <a-typography-title :level="3">工单</a-typography-title>
          <a-spin :spinning="loading">
            <div class="card-list">
                <a-card v-for="data in myticket" :title="data.title">
                  <template #extra><a :href="data._id">查看</a></template>
                    <p>{{ data.content }}</p>
                    <p><field-time-outlined/>  {{ data.time }}</p>
                    <p><user-outlined/>  {{ data.sender }}</p>
                    <p><api-outlined/>  <a-typography-paragraph copyable>{{ data._id }}</a-typography-paragraph></p>
                    <p><info-circle-outlined/>  <a-tag :color="data.status == '已结单' ? 'default' : data.status == '未处理' ? 'orange' : data.status == '处理中' ? 'geekblue' : data.status == '等待回复' ? 'green' : 'red'">{{ data.status }}</a-tag></p>
                    <div class="btn-group">
                        <a-tooltip><template #title>请在工单平台处查看</template><a-button type="primary" disabled>查看元数据</a-button></a-tooltip>
                        <a-button @click="deleteTicket(data._id)" type="danger">删除</a-button>
                    </div>
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
    FieldTimeOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ApiOutlined,
    ArrowsAltOutlined,
    InfoCircleOutlined,
    DatabaseOutlined
  } from '@ant-design/icons-vue';
  import { defineComponent, ref } from 'vue';
  import Axios from 'axios'
  //import { isPassedVerificationInt, GetStatusCode } from '../../modules/StatusCodeParser'
import { message, Modal } from 'ant-design-vue';
import { number } from 'vue-types';
import { getCurrentInstance } from 'vue'
import * as monaco from 'monaco-editor';
    const selectedKeys = ref(['2'])
    const collapsed = ref(false)
    const router = useRouter();
    const isVisible = ref(false)
    let username = ref()
    let myticket = ref([])
    let loading = ref(true)
    let editor = ref(null)
    const app_config = useAppConfig()
    useHead({title: '工单 | ' + app_config.title})
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
    // 删除工单
    const deleteTicket = (ticket_id: string) => {
      Modal.confirm({
        title: '注意！',
        content: '您即将删除ID为 ' + ticket_id + " 的工单，此操作不可撤销，是否操作？",
        onOk(){
          Axios({
            url: '/api/ticket/delete',
            method: 'POST',
            data: {ticket_id: ticket_id}
          })
          .then(function(Response){
              var isPassed = Response['data']['code']
              if (isPassed == 0){
                message.success('删除成功')
                loading.value = true
                myticket.value = []
                load()
              }else{
                  message.error(Response['data']['message'])
              }
          })
          .catch(function(error){
              message.error('错误！' + error)
              console.error('错误！' + error)
          })
        }
      })
    }
    // 获取工单元数据
    const getMetaData = (ticket_id: string) => {
      Axios({
        url: '/api/ticket/metadata?ticket_id=' + ticket_id
      })
      .then(function(Response){
          var isPassed = Response['data']['code']
          if (isPassed == 0){
              isVisible.value = true
              console.log(Response['data'])
          }else{
              message.error(Response['data']['message'])
          }
      })
      .catch(function(error){
          message.error('错误！' + error)
          console.error('错误！' + error)
      })
    }
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

// 工单列表的项
const columns = [
    {
        title: '工单ID',
        key: '_id'
    },
    {
        title: '标题',
        key: 'title'
    },
    {
        title: '内容',
        key: 'content'
    },
    {
        title: '发送者',
        key: 'sender'
    },
    {
        title: '发送时间',
        key: 'time'
    },
    {
        title: '状态',
        key: 'status'
    },
]
    const load = () => {
      Axios({
          url: '/api/ticket/myticket'
      })
      .then(function(Response){
          loading.value = false;
          var isPassed = Response['data']['code']
          if (isPassed == 0){
              console.log(Response['data'])
              let a = []
              for (var i=0; i < Response['data']['ticketList'].length; i++){
                  if (Response['data']['ticketList'][i]['status'] == -1){
                      var data = {
                          content: Response['data']['ticketList'][i]['content'],
                          sender: Response['data']['ticketList'][i]['sender'],
                          senderID: Response['data']['ticketList'][i]['senderID']['$oid'],
                          status: "已结单",
                          time: Response['data']['ticketList'][i]['time'],
                          title: Response['data']['ticketList'][i]['title'],
                          _id: Response['data']['ticketList'][i]['_id']['$oid']
                      }
                  }
                  else if (Response['data']['ticketList'][i]['status'] == 0){
                      var data = {
                          content: Response['data']['ticketList'][i]['content'],
                          sender: Response['data']['ticketList'][i]['sender'],
                          senderID: Response['data']['ticketList'][i]['senderID']['$oid'],
                          status: "未解决",
                          time: Response['data']['ticketList'][i]['time'],
                          title: Response['data']['ticketList'][i]['title'],
                          _id: Response['data']['ticketList'][i]['_id']['$oid']
                      }
                  }
                  else if (Response['data']['ticketList'][i]['status'] == 1){
                      var data = {
                          content: Response['data']['ticketList'][i]['content'],
                          sender: Response['data']['ticketList'][i]['sender'],
                          senderID: Response['data']['ticketList'][i]['senderID']['$oid'],
                          status: "处理中",
                          time: Response['data']['ticketList'][i]['time'],
                          title: Response['data']['ticketList'][i]['title'],
                          _id: Response['data']['ticketList'][i]['_id']['$oid']
                      }
                  }
                  else if (Response['data']['ticketList'][i]['status'] == 2){
                      var data = {
                          content: Response['data']['ticketList'][i]['content'],
                          sender: Response['data']['ticketList'][i]['sender'],
                          senderID: Response['data']['ticketList'][i]['senderID']['$oid'],
                          status: "等待回复",
                          time: Response['data']['ticketList'][i]['time'],
                          title: Response['data']['ticketList'][i]['title'],
                          _id: Response['data']['ticketList'][i]['_id']['$oid']
                      }
                  }
                  else{
                      var data = {
                          content: Response['data']['ticketList'][i]['content'],
                          sender: Response['data']['ticketList'][i]['sender'],
                          senderID: Response['data']['ticketList'][i]['senderID']['$oid'],
                          status: "未知状态",
                          time: Response['data']['ticketList'][i]['time'],
                          title: Response['data']['ticketList'][i]['title'],
                          _id: Response['data']['ticketList'][i]['_id']['$oid']
                      }
                  }
                  a.push(data)
                  console.log(a)
              }
              myticket.value = a
          }else{
              message.warn('登录已失效，请重新登录')
              router.push('/user/login')
          }
      })
      .catch(function(error){
          message.error('错误！' + error)
          console.error('错误！' + error)
      })
    }
    load()
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
  .site-layout .site-layout-background {
    background: #fff;
  }
  .btn-group .ant-btn{
    margin-right: 5px;
  }
  </style>
  