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

## 运行

### 前端开发

前端开发时可以使用`server`参数来选择代理服务器，或使用`mock`来使用mock数据。
服务器在`/config/client.js`文件下的`dev.proxyTable`中配置。

```bash
$ npm run client-dev mock     # mock server
$ npm run client-dev [server] # proxy server
```

### 前端生成

生成的文件在`/dist`目录下

```bash
$ npm run build
```

### 后端开发

后端开发时需要先修改本地host
```
127.0.0.1 nek-server.kaolafed.com
```

然后可以使用`/server.sh`脚本来启动项目，`/server.sh_tpl`为该脚本的模板，`server.sh`已加入gitignore，可以自行建立。

需要在`/server.sh`文件下修改几个环境变量为对应的值，然后运行该脚本。
Windows下需要安装一个shell工具，或者直接在WebStorm中进行环境变量的配置。

```bash
$ ./server.sh run server-dev  # 后端开发模式，如果需要访问页面，需要先build前端
```

### 后端运行

在运行前先要编译，然后使用脚本来启动
```bash
$ npm run server-build
$ ./server.sh start
```

## 说明

### babel配置
由于前后端的babel配置存在一些差异，因此将配置文件分开，
后端编译时使用`app/.babelrc`和`core/.babelrc`，这俩配置是一样的
前端打包时，vue-loader会加载`/.babelrc`，js-loader会使用`build/webpack.base.conf.js`里`/\.js$/`下的配置

### 后端开发注意事项
在开发时使用了`nodemon`进行文件更新监控，如果在`ctrl+c`之后重新运行时提示端口被占用的话，需要自行kill掉原有进程
