![logo](https://dimples-1337.heycrab.xyz/uploads/%E7%94%BB%E6%9D%BF%201.png "CrabWorkorder 2")
# CrabWorkorder2
## 简介
由螃蟹开发的新款云中城服务器工单系统，使用 Nuxt3 + Vue3 + Ant Design Vue 构建！  
它拥有优秀的UI，更快的打开速度，更好的交互能力等等...
## 作为自己的工单系统使用
### 1.下载后端程序
我已经把老版本后端的更改同步到了原仓库。地址[在这里](https://github.com/HeyCrab3/CloudsdaleWorkorder)  
后端程序默认启动在 localhost:19198，如无需求请不要更改  
请自行修改 MongoDB 数据库地址，并启动初始化程序  
极验验证码开箱即用，你也可以根据需求自行更改
### 2.克隆仓库
克隆这个仓库，然后输入 ``npm install``
### 修改配置文件
将目录下的 app.config.ts.sample 重命名为 app.config.ts，并对里面的内容进行修改  
下面是一个完整的配置文件示例：  
```
// 配置文件
export default defineAppConfig({
    // 标题
    title: 'Example',
    // 是否为新版本
    isNewVersion: false,
    // 版本号（1.0,2.0）,
    version: '0.1',
    // 导航到服务器主页
    homeUrl: 'https://heycrab.xyz',
    // 注意：仅在新版本模式下可用
    // 老版本地址
    oldVersionUri: 'https://heycrab.xyz',
    // 页脚内容
    footer: `©2023 Example All Rights Reserved.`,
    // Logo（可选）
    logo: {
        // 是否启用
        isEnabled: true,
        // 图片Uri
        url: 'https://www.cloudsdale.site/assets/img/favicon.png'
    },
    // 背景配置
    appBackground: {
        // 是否启用
        isEnabled: true,
        // 图片Uri
        url: 'https://api.dreamofice.cn/hoyorandom/img'
    },
    // 是否启用注册
    registerEnabled: true,
    // 是否启用极验
    geetestEnabled: true,
    // Slider 内容管理
    sliderContentManager: {
        // Content 的背景URL建议您使用HTTPS，且在HTTPS站点中必须使用HTTPS协议，否则图片将无法加载！
        // 是否启用
        isEnabled: true,
        content: [
            {'title': '欢迎来到 Example 服务器', 'text': '我们为您提供最好的游戏体验', 'buttons': [
                {'type': 'primary', 'content': '登录', 'isRouter': true, 'route': 'ticket/home'}
            ], 'backgroundUri': 'https://dimples-1337.heycrab.xyz/uploads/QQ%E5%9B%BE%E7%89%8720230430130347.png'},
            {'title': '欢迎来到 Example 服务器', 'text': '我们为您提供最好的游戏体验', 'buttons': [
                {'type': 'primary', 'content': '登录', 'isRouter': true, 'route': 'ticket/home'},{'type': 'primary', 'content': '注册', 'isRouter': true, 'route': 'ticket/home'}
            ], 'backgroundUri': 'https://dimples-1337.heycrab.xyz/uploads/QQ%E5%9B%BE%E7%89%8720230430130347.png'}
        ]
    },
    // MC服务器状态查询（如果不是MC服务器服主可以关闭此功能，无影响）
    mcServerStatus: {
        // 是否启用
        isEnabled: true,
        // 自定义查询API接口
        apiUri: 'test/',
        // 服务器IP
        serverIp: 'mc.heycrab.xyz',
        // 获取到的类名
        className: ['p', 'mp', 'motd']
    }
})
```
## 部署
请参考 [Nuxt 官方文档](https://nuxt.com/docs/getting-started/deployment)。
## 有问题/建议/意见？
欢迎提交 Issue 或发邮件到 heycrab3@outlook.com！