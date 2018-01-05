<template>
  <el-dialog title="代码预览" :visible.sync="visible" size="full" @open="handleOpen" :before-close="handleBeforeClose">
    <div class="container">
      <div class="aside">
        <el-menu :default-active="activeMenu" @select="handleSelect">
          <folder :menus="menus"></folder>
        </el-menu>
      </div>
      <div class="main" v-loading="loading">
        <pre class="pre" v-text="currentCode"></pre>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { codegen } from '@/../core/src/index';

import { getPageDetail } from '@/api/page';
import { ProjectTypes } from '@/../utils/enums';

import Folder from './folder.vue';

export default {
  props: ['visible', 'title'],
  components: {
    Folder
  },
  data() {
    return {
      sourceCode: {},
      currentCode: '',
      activeMenu: '',
      menus: [],
      loading: false
    };
  },
  watch: {
    activeMenu(newVal) {
      const pathArr = newVal.split('.');
      pathArr.unshift(this.sourceCode);
      this.currentCode = pathArr.reduce((pre, cur) => {
        return pre[cur];
      });
    }
  },
  methods: {
    async handleOpen() {
      try {
        this.loading = true;
        const { data } = await getPageDetail({ id: this.$route.query.id });
        const config = JSON.parse(data.dom || '{}');
        switch(data.project.type) {
          case ProjectTypes.NEJ:
            this.sourceCode = codegen.NEJ.buildList(config, {
              pageTitle: data.name,
              jsConfig: {
                ListPath: data.project.listPath,
                basePath: data.project.basePath
              }
            });
            break;
          case ProjectTypes.Webpack:
            this.sourceCode = codegen.Webpack.buildList(config, {
              pageTitle: data.name,
              jsConfig: {
                ListPath: data.project.listPath,
                basePath: data.project.basePath
              },
              multiFiles: config.tabsEnable
            });
            break;
          default:
            this.sourceCode = '';
            break;

        }
        this.handleCode(this.sourceCode, data.project.type);
        this.activeMenu = 'index.html';
        this.loading = false;
      } catch (err) {
        this.loading = false;
        return;
      }
    },
    handleCode(code, type) {
      if (!code) {
        return;
      }
      switch(type) {
        case ProjectTypes.NEJ:
          this.code2NejMenu(code);
          break;
        case ProjectTypes.Webpack:
          this.code2webpackMenu(code);
          break;
        default:
          break;
      }
    },
    code2NejMenu(code) {
      this.code2menu(code);
      if (code.index) {
        let modulesMenu = this.menus.find(item => item.name == 'modules');
        if (!modulesMenu) {
          modulesMenu = {
            name: 'modules',
            key: 'modules',
            icon: 'folder',
            items: []
          };
          this.menus.push(modulesMenu);
        }
        modulesMenu.items.push({
          name: 'page.js',
          key: 'index.js',
          icon: 'js'
        });
        modulesMenu.items.push({
          name: 'page.html',
          key: 'index.html',
          icon: 'html'
        });
      }
    },
    code2webpackMenu(code) {
      this.code2menu(code);
      if (code.index) {
        this.menus.push({
          name: 'index.js',
          key: 'index.js',
          icon: 'js'
        });
        this.menus.push({
          name: 'index.html',
          key: 'index.html',
          icon: 'html'
        });
      }
    },
    code2menu(code) {
      if (code.modules) {
        const items = [];
        for (let [k, v] of Object.entries(code.modules)) {
          const its = [];
          for (let vk of Object.keys(v)) {
            if (['js', 'html'].indexOf(vk) > -1) {
              its.push({
                name: `index.${vk}`,
                key: `modules.${k}.${vk}`,
                icon: vk
              });
            } else if (vk == 'mixin') {
              const mixin = {
                name: 'mixins',
                key: `modules.${k}.${vk}`,
                icon: 'folder',
                items: [
                  {
                    name: 'list.action.js',
                    key: `modules.${k}.${vk}`,
                    icon: 'js'
                  }
                ]
              };
              if (Object.keys(code.modules).length > 1) {
                its.unshift(mixin);
              } else {
                this.menus.push(mixin);
              }
            }
          }
          items.push({
            name: `${k}`,
            key: `modules.${k}`,
            icon: 'folder',
            items: its
          });
        }
        this.menus.push({
          name: 'modules',
          key: 'modules',
          icon: 'folder',
          items
        });
      }

    },
    handleSelect(index) {
      this.activeMenu = index;
    },
    handleBeforeClose() {
      this.$emit('update:visible', false);
      this.sourceCode = {};
      this.menus = [];
      this.currentCode = '';
      this.activeMenu = '';
    }
  }
};
</script>

<style scope>
.container {
  display: flex;
}
.aside {
  width: 200px;
  margin-right: 20px;
}
.main {
  flex: 1;
}
.pre {
  margin: 0;
}
</style>


