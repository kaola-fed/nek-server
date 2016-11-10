{{#macro "deps"}}
/* beautify ignore:start */
  {{#if isModal}}
  '{{BaseModal}}'
  {{else}}
  '{{BaseComponent}}'
  {{/if}}
  {{#if isPage}}
  ,'text!./page.html'
  {{#else}}
  ,'text!./index.html'
  {{/if}}
  {{#each modals}}
  {{#if isPage}}
  ,'../modal/{{name}}/index.js'
  {{else}}
  ,'../../modal/{{name}}/index.js'
  {{/if}}
  {{/each}}
  {{#each modules}}
  ,'./moduels/{{name}}/index.js'
  {{/each}}
/* beautify ignore:end */
{{/macro}}

/**
 * @file 描述本文件的主体功能
 *
 * @param {component} ProductModal - 描述依赖组件的作用
 * @param {plugin}    pricePlugin  - 描述plugin的作用
 *
 * @see KJDS-2758: {{today}} 你的名字 初始化页面
 */
define([{{deps}}
], function({{#if isModal}}BaseModal{{else}}BaseComponent{{/if}},template{{#each modals}},{{cammel name}}{{/each}}) {

  {{#if isModal}}
  return BaseModal.extend({
    {{#if name}}
    name: '{{name}}',
    {{/if}}
    template: template,
    config: function(data) {
      this.supr(data);
    }
  })
  {{else}}
  return BaseComponent.extend({
    {{#if name}}
    name: '{{name}}',
    {{/if}}
    template: template,
    config: function(data) {
      this.supr(data);
    }
  });
  {{/if}}
});
