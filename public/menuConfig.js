// 以下注释如果后面跟 C 则表示用于配置页，如果跟 G 表示用于 NEK 代码生成
const menuConfig = [
  title: "基础组件",
  subModuleList: [
    {
      // 标题 - C
      title: "小按钮",
      // 组件 ID - CG
      id: 123,
      // 组件名
      name: 'Button',
      // 组件 LOGO - C
      icon: "/xx/xx.png",
      // 组件所占栅格数 - CG
      cols: 2,
      // 支持事件类型 - CG
      events: ["click", "update"],
      // 有点多，还没想到优雅的方式 - CG
      clazz: [],
      data: [
        {
          // 属性名 - CG
          key: "key",
          // 属性描述 - C
          desc: "desc",
          // 默认值 - C
          default: "xxoo",
          // 属性值类型 - G
          // none: 用于没有值的属性，如 disabled
          // number: attr=3
          // string: attr="3"
          // expresion: attr={1+1}
          type: "none"
        }
      ]
    }
  ]
];

module.exports = menuConfig;