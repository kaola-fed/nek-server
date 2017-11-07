# nek-server

> NEK 拖控件工具

## 目录

```
├─app             // 后端代码
│  ├─controllers
│  └─models
├─build           // 编译脚本
├─config          // 配置文件
├─core            // 主要数据结构等实现，前后端通用的部分
├─mock            // mock数据
├─src             // 前端代码
│  ├─api          // 网络通信部分函数
│  ├─components   // 全局组件
│  ├─pages        // 页面
│  ├─router       // 路由配置
│  ├─store        // Redux
│  ├─style        // 全局样式
│  └─widget       // 工具函数、filter等实现
└─static
```

## 安装

```
$ npm i
# or
$ yarn
```

## 运行指令

```
$ npm run client-dev          # 前端开发
$ npm run client-build mock   # 前端部署，mock为参数，指定服务器在 /config/client.js 的 dev.proxyTable 中配置
$ npm run server-dev          # 后端开发，如果需要访问页面，需要先build前端
$ npm run server-build        # 后端编译
$ npm build                   # 部署前端与后端
$ npm start                   # 启动
```

## 说明
### 后端开发注意
在接入openid登录时，需要修改本地hosts，将nek-server.kaolafed.com绑定本地ip地址，访问时使用域名+端口访问
`app/config.js`中涉及私密信息，所以添加到.gitignore文件

### babel配置
由于前后端的babel配置存在一些差异，因此将配置文件分开，
`.babelrc`文件中的是后端的babel配置，`build/webpack.base.conf.js`里`/\.js$/`下的配置为前端的babel配置
