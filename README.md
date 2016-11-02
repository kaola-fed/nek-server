# Server for NEK

NEK 的服务端，包含了页面拖拽构建以及数据库交互

## 关于

后端目录结构还没弄，目前就一个单纯的 Server

前端只依赖 nek-ui (我们定制的 regular-ui)，如果有需求，直接在[这里][1]修改

开发方式跟 Regular 基本一致，需要注意的是用的 CommonJS 管理依赖，最终由 Webpack 打包

因为人少，规范就没什么可强制的了，命名参考 RGUI 那一套即可，见[这里][2]

结构规范，我参照之前组内讨论的目录规范，大概做了个小页面的 DEMO

# 开发

目前还没具体优化完流程，所以需要开两个终端，一个是 Webpack 的 watch 实时打包，另一个是 Server

 [1]: https://github.com/kaola-fed/regular-ui
 [2]: https://kaola-fed.github.io/regular-ui/doc/start/rule.html