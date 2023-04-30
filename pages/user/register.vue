<template>
    <div class="login1" :style="{background: app_config.appBackground.isEnabled?`url(${app_config.appBackground.url})`:'#FFFFFF'}">
        <div class="login-box">
            <img src="https://www.cloudsdale.site/assets/img/favicon.png" style="width: 30px;" alt="unt logo"/>
            <div class="login-main">
                <h2 style="font-size: 1.5rem">欢迎注册</h2>
                <div v-if="app_config.registerEnabled == true">
                    <a-input :disabled="isLoading" size="large" v-model:value="email" placeholder="用户名" clearable>
                        <template #prefix>
                            <user-outlined/>
                        </template>
                    </a-input>
                    <a-input :disabled="isLoading" size="large" v-model:value="password" placeholder="密码" type="password" show-password clearable :prefix-icon="Lock">
                        <template #prefix>
                            <lock-outlined/>
                        </template>
                    </a-input>
                    <a-input :disabled="isLoading" size="large" v-model:value="confirm_password" placeholder="确认密码" type="password" show-password clearable :prefix-icon="Lock">
                        <template #prefix>
                            <lock-outlined/>
                        </template>
                    </a-input>
                    <a-input :disabled="isLoading" size="large" v-model:value="gameid" placeholder="游戏ID" clearable :prefix-icon="Lock">
                        <template #prefix>
                            <user-outlined/>
                        </template>
                    </a-input>
                    <a-input :disabled="isLoading" size="large" v-model:value="nickname" placeholder="昵称" clearable :prefix-icon="Lock">
                        <template #prefix>
                            <user-outlined/>
                        </template>
                    </a-input>
                    <div id="captcha" style="margin-top: 20px; width: 100%"/>
                    <a-button @click="login" :loading="isLoading" size="large" type="primary" style="width: 100%; margin-top: 20px;">注册</a-button>
                </div>
                <div v-else>
                    <a-result status="403" title="注册功能未启用" sub-title="请联系管理员开启注册功能"></a-result>
                </div>
                <a-divider v-if="app_config.registerEnabled == true">或者</a-divider>
                <a-button @click="router.push('login')" size="large" style="width: 100%;">返回登录</a-button>
            </div>
        </div>
    </div>
</template>
<style>
    .login1{
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .login-box{
        float: right;
        height: 100%;
        transition: 2s;
        padding: 20px;
    }
    .login-main{
        margin-top: 30%;
    }
    .ant-btn{
        border-radius: 5px;
    }
    .login-main .ant-input-affix-wrapper{
        margin-top: 10px;
        border-radius: 5px;
    }
    @media (max-width: 899px){
        .login-box{
            width: 100%;
            background: #FFF;
        }
    }
    @media (min-width: 900px){
        .login-box{
            width: 80%;
            background: #FFF;
            /* background: #ffffffda;
            backdrop-filter: blur(25px); */
        }
    }
    @media (min-width: 1000px){
        .login-box{
            width: 60%;
        }
    }
    @media (min-width: 1100px){
        .login-box{
            width: 40%;
        }
    }
    @media (min-width: 1300px){
        .login-box{
            width: 35%;
        }
    }
    @media (min-width: 1500px){
        .login-box{
            width: 30%;
        }
    }
    @media (min-width: 1700px){
        .login-box{
            width: 25%;
        }
    }
</style>
<script lang="ts" setup>
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import Axios from 'axios';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
//import isPassedVerificationInt, GetStatusCode from '../../modules/StatusCodeParser';
let email = ref(null)
let captchaData = ref(null)
let password = ref(null)
let confirm_password = ref(null)
let gameid = ref(null)
let nickname = ref(null)
let isLoading = ref(false)
const router = useRouter();
let captcha= ref(null)
const app_config = useAppConfig()
useHead({title: '注册 | ' + app_config.title})
if (app_config.geetestEnabled == true){
    Axios({
        url: "/api/geetest/getChallenge"
    })
    .then(function(Response){
        initGeetest({
                // 以下配置参数来自服务端 SDK
                gt: Response.data.gt,
                challenge: Response.data.challenge,
                offline: !Response.data.success,
                new_captcha: true,
                product: 'popup'
            }, function (captchaObj) {
                captchaObj.appendTo("#captcha"); //将验证按钮插入到宿主页面中captchaBox元素内
                captchaObj.onReady(function(){
                console.log('Geetest Ready')
                })
                captcha.value = captchaObj
                captchaObj.onSuccess(function(){
                var result = captchaObj.getValidate();
                captchaData.value = {"challenge": result.geetest_challenge, "validate": result.geetest_validate, "seccode": result.geetest_seccode};
                captchaObj.value = captchaObj;
                })
                captchaObj.onError(function(error){
                message.error(error)
                })
            })
    })
}
const login = () => {
    if (email.value == null && password.value == null){
        message.warn('唔，你好像没写邮箱或者密码呢🤔')
    }else{
        if (captchaData == null){
            message.warn('请先完成验证码')
        }else if (password.value != confirm_password.value){
            message.warn('两次输入的密码不一致')
        }else{
            isLoading.value = true;
            Axios({
                url: '/api/user/reg',
                method: 'POST',
                data: {
                    userName: email.value,
                    passWord: password.value,
                    gameID: gameid.value,
                    nickName: nickname.value,
                    challenge: captchaData.value.challenge,
                    validate: captchaData.value.validate,
                    seccode: captchaData.value.seccode
                }
            })
            .then(function(Response){
                isLoading.value = false;
                var isPassed = Response['data']['code']
                if (isPassed == 0){
                    message.success(Response.data.msg)
                    router.push('login')
                }else{
                    message.error(Response.data.msg)
                    captcha.value.reset();
                }
            })
        }
    }
}
</script>