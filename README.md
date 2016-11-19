# Server for NEK

NEK 的服务端，包含了页面拖拽构建以及数据库交互

## 关于

前端只依赖 nek-ui (我们定制的 regular-ui)，如果有需求，直接在[这里][1]修改

开发方式跟 Regular 基本一致，需要注意的事项：
 
 - 用的 CommonJS 管理依赖，最终由 Webpack 打包
 - 因为人少，规范就没什么可强制的了，总体参考 RGUI 那一套即可，见[这里][2]
 - 结构规范，我参照之前组内讨论的目录规范，文件名和组件名用**小写+点**，导出的类名还是**大驼峰**
 - 每个组件 config 里建议用 `this.defaults` 指明默认值，这样比较容易理解

## 接口

 - 具体参数暂时不想写，看 app/controllers 或者问我吧
 - upsert = update + insert，通常由是否有 _id 来决定行为
 - 返回都是直接可用对象，不会返回 code message 等冗余信息，如果错误会统一触发 HTTP status code 500
 - 请求的 Content-Type 同时支持 application/json 和 application/x-www-form-urlencoded，不过建议统一用前者

API列表（其实都是些`增删改查`而已）：
```
GET /api/template
POST /api/template/upload

GET /api/project/list
POST /api/project/upsert
POST /api/project/tpl/upsert
POST /api/project/tpl/delete

GET /api/page/list
POST /api/page/upsert

GET /api/component/list
POST /api/component/upsert

GET /api/category/list
POST /api/category/upsert
```

## 目录

```text
├── app // 后端
│   ├── controllers // 路由控制逻辑
│   └── models // 数据库
├── config.js // 后端路由及部分配置
├── package.json
├── pm2.json
├── public // 前端
│   ├── images // 静态图片
│   ├── index.js // 前端路由
│   ├── modules // 页面模块
│   └── sass // 样式
├── README.md
├── server.js // 后端入口
├── webpack.config.js
└── webpack.production.config.js

```

## 开发

> 由于端口可能冲突，请不要同时使用

#### 纯前端

 - `npm start`
 - open `http://localhost:3300`

#### 前后端（建议）

 > node >= 7.0（如果是从旧版本升级到 7，建议删除 node_modules 后重新 `npm i`）

 `npm run dev`


## 部署

 - `ssh fed@kaolafed.com`（密码：fed4kaola）
 - `npm i`（只有修改了包才需执行）
 - `npm run build`（如果仅仅修改 projects 下文件则无需执行）
 - `npm -g pm2`（部署机已经装了，不需要执行）
 - `pm2 restart nek`

 [1]: https://github.com/kaola-fed/regular-ui
 [2]: https://kaola-fed.github.io/regular-ui/doc/start/rule.html