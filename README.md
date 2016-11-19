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

#### API列表（所以的接口都默认以 `/api` 开头）


> 注：文档写得略简陋，暂时将就看吧，有问题可以问我

| 接口 | 方法 | 描述 | 参数 | 返回 |
| ---- | ---- | ---- | ---- | ---- |
|/template|GET|获取模板文件|file(文件的id),name(下载后显示的名字)|二进制文件|
|/template/upload|POST|批量上传文件|随意|文件信息列表，主要是用里面的 id 和 originalname 字段|
|/project|GET|获取项目信息|project(项目id)|项目信息|
|/project/list|GET|所有项目|无|项目列表|
|/project/upsert|POST|新增/更新项目|project(项目id，无则新增),name(项目名),desc(描述)||
|/project/tpl/upsert|POST|新增/更新项目模板|project(项目id),name(模板文件名，不存在则新增),file(文件id)||
|/project/tpl/delete|POST|删除项目模板|project(项目id),name(模板文件名)||
|/page|GET|获取页面数据|project(项目id),|页面数据|
|/page/list|GET|获取页面列表|project(项目id)|页面列表|
|/page/upsert|POST|新增/更新页面|page(页面id，无则新增),project(项目id),name(页面名),url(页面url),data(页面组件数据)||
|/component/list|GET|获取组件数据|project(项目id)|组件列表|
|/component/upsert|POST|新增/更新组件|project(项目id),component(组件id，无则新增),...||
|/category/list|GET|获取所有分类|project(项目id)|分类列表|
|/category/upsert|POST|新增/更新类目信息|project(项目id),category(类目id)||

#### NEK CLI 交互方式

 - 在 .nekrc 里加上 `projectId` 字段，接下来的请求会用到
 - `GET /api/project?project={projectId}` 会得到项目的信息
![](https://dn-getlink.qbox.me/aqlpdg8pkd38niwyrdx6r.png)
 - 遍历`result.templates`里的 `file` 和 `name`，通过 `GET /api/template?file={file}&name={name}` 即可下载到模板文件
 - 因为 nek 是通过 `nek -u <url>` 生成模板的，所以为了正确填充模板，需要 `GET /api/page?project={projectId}&url={url}` 获取页面的 JSON 数据，meta 放在 `result.data` 字段下的


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