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
        <a-layout-content :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }" style="overflow: hidden">
            <a-page-header title="工单详情" :sub-title="id" @back="() => router.push('myticket')">
                <template #tags>
                    <a-tag :color="data.status == '-1' ? 'default' : data.status == '0' ? 'orange' : data.status == '1' ? 'geekblue' : data.status == '2' ? 'green' : 'red'">{{ data.status == '-1' ? '已结单' : data.status == '0' ? '未处理' : data.status == '1' ? '处理中' : data.status == '2' ? '等待回复' : '未知状态' }}</a-tag>
                </template>
                <template #extra>
                    <a-button @click="deleteTicket(data._id.$oid)" key="1" type="danger">删除工单</a-button>
                </template>
                <a-row type="flex">
                    <a-statistic title="状态" :value="data.status == '-1' ? '已结单' : data.status == '0' ? '未处理' : data.status == '1' ? '处理中' : data.status == '2' ? '等待回复' : '未知状态'" />
                    <a-statistic style="margin: 0 32px" title="发送者" :value="data.sender"/>
                    <a-statistic title="发送时间" :value="data.time" />
                </a-row>
            </a-page-header>
          <a-spin :spinning="loading">
                <div style="padding: 20px">
                    <a-list header="原始工单消息">
                        <a-list-item>
                            <a-comment :author="data.sender"><template #avatar><a-avatar><template #icon><UserOutlined/></template></a-avatar></template><template #content>{{ data.content }}</template><template #datetime>{{ data.time }}</template></a-comment>
                        </a-list-item>
                    </a-list>
                    <a-divider>以下为回复消息</a-divider>
                    <a-list :data-source="reply" :header="`共 ${reply.length} 条回复`" style="overflow:scroll; max-height: 250px">
                        <a-list-item v-for="d in reply">
                            <a-comment v-if="d.sender == data.sender" :author="`${d.sender}（您）`"><template #avatar><a-avatar><template #icon><UserOutlined/></template></a-avatar></template><template #content>{{ d.content }}</template><template #datetime>{{ d.time }}</template></a-comment>
                            <a-comment v-if="d.isAdmin == true" :author="`${d.sender}（管理组）`"><template #avatar><a-avatar><template #icon><UserOutlined/></template></a-avatar></template><template #content>{{ d.content }}</template><template #datetime>{{ d.time }} <a-tag color="orange">管理组</a-tag></template></a-comment>
                        </a-list-item>
                    </a-list>
                    <a-list style="min-width: 600px;">
                        <a-list-item>
                            <a-comment><template #avatar><a-avatar><template #icon><UserOutlined/></template></a-avatar></template><template #content>
                                <a-form-item style="min-width: 550px;">
                                    <a-textarea :disabled="IsSolved" v-model:value="value" :rows="4" />
                                </a-form-item>
                                <a-form-item>
                                    <a-button html-type="submit" :disabled="IsSolved" :loading="isSubmitting" type="primary" @click="sendReply">
                                    发送回复
                                    </a-button>
                                </a-form-item>
                                </template>
                            </a-comment>
                        </a-list-item>
                    </a-list>
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
import { number } from 'vue-types';
import { getCurrentInstance } from 'vue'
import * as monaco from 'monaco-editor';
    const selectedKeys = ref(['2'])
    const collapsed = ref(false)
    const router = useRouter();
    const vroute = useRoute();
    const data = ref({})
    const reply = ref([])
    const value = ref(null)
    const IsSolved = ref(false)
    let username = ref()
    let loading = ref(true)
    const isSubmitting = ref(false)
    let id = ref('工单ID ' + vroute.params.ticket_id)
    const app_config = useAppConfig()
    useHead({title: '工单详情 | ' + app_config.title})
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

    // 获取工单数据
    Axios({
        url: '/api/ticket/ticketdata?id=' + vroute.params.ticket_id
    })
    .then(function(Response){
        var isPassed = Response['data']['code']
        if (isPassed == 0){
            console.log(Response['data'])
            data.value = Response['data']['data']
            loading.value = false
            if (Response['data']['data']['status'] == -1){
                IsSolved.value = true;
                value.value = "工单已关闭，不再接受新回复"
            }
        }else{
            message.warn(Response['data']['msg'])
        }
    })
    .catch(function(error){
        message.error('错误！' + error)
        console.error('错误！' + error)
    })
    const loadReply = () => {
        Axios({
            url: '/api/ticket/reply?id=' + vroute.params.ticket_id
        })
        .then(function(Response){
            var isPassed = Response['data']['code']
            if (isPassed == 0){
                console.log(Response['data'])
                reply.value = Response['data']['reply']
            }else{
                message.warn(Response['data']['msg'])
            }
        })
        .catch(function(error){
            message.error('错误！' + error)
            console.error('错误！' + error)
        })
    }
    loadReply()
    const sendReply = () => {
        loading.value = true;
        Axios({
            url: '/api/ticket/sendreply?id=' + vroute.params.ticket_id,
            method: 'POST',
            data: {content: value.value}
        })
        .then(function(Response){
            var isPassed = Response['data']['code']
            if (isPassed == 0){
                console.log(Response['data'])
                message.success('回复成功')
                reply.value = []
                loadReply()
                loading.value = false;
            }else{
                message.warn(Response['data']['msg'])
                loading.value = false;
            }
        })
        .catch(function(error){
            message.error('错误！' + error)
            console.error('错误！' + error)
        })
    }
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
                router.push('myticket')
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
  