# Server for NEK

NEK 的服务端，包含了页面拖拽构建以及数据库交互

## 关于

后端目录结构还没弄，暂时不需要

前端只依赖 nek-ui (我们定制的 regular-ui)，如果有需求，直接在[这里][1]修改

开发方式跟 Regular 基本一致，需要注意的事项：
 
 - 用的 CommonJS 管理依赖，最终由 Webpack 打包
 - 因为人少，规范就没什么可强制的了，总体参考 RGUI 那一套即可，见[这里][2]
 - 结构规范，我参照之前组内讨论的目录规范，文件名和组件名用**小写+点**，导出的类名还是**大驼峰**
 - 每个组件 config 里建议用 `this.defaults` 指明默认值，这样比较容易理解

## 目录

#### public (前端)
```text
├── images
│   └── favicon.png
├── index.html
├── index.js // 入口
├── modules // 页面模块
│   └── demo
│       ├── components // 模块的子组件
│       │   └── title
│       │       ├── index.html
│       │       └── index.js
│       ├── index.html
│       └── index.js
├── projects // 针对每个项目模板相关文件
│   └── haitao
│       └── README.md
└── sass // 样式
    ├── base.scss
    └── main.scss
```

## 开发

 - `npm i`
 - `npm start`
 - open `http://localhost:3300`

## 部署

 - `ssh fed@kaolafed.com`（密码：fed4kaola）
 - `npm i`（只有修改了包才需执行）
 - `npm run build`（如果仅仅修改 projects 下文件则无需执行）
 - `npm -g pm2`（部署机已经装了，不需要执行）
 - `pm2 restart nek`

 [1]: https://github.com/kaola-fed/regular-ui
 [2]: https://kaola-fed.github.io/regular-ui/doc/start/rule.html