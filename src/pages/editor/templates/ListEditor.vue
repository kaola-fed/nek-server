<template>
  <div class="g-editor">
    <tools-bar projectName="Project" :buttons="toolsBarButtons"></tools-bar>
    <div class="m-list-editor">
      <div class="m-left">
        <div class="g-preview">
          <div ref="preview">
          </div>
        </div>
      </div>
      <div class="m-right">
        <el-collapse v-model="configActiveNames">
          <el-collapse-item title="面包屑" name="breadcrumb">
            <el-row v-for="(item, index) in breadcrumbs" :key="item.id + index" :gutter="20">
              <el-col :span="2"><label class="el-form-item__label">第{{ index + 1 }}级</label></el-col>
              <el-col :span="8"><el-input placeholder="标题" v-model="item.title"></el-input></el-col>
              <el-col :span="8"><el-input placeholder="转跳链接（可选）" v-model="item.link"></el-input></el-col>
              <el-col :span="6">
                <el-button class="u-icon-btn" icon="plus" v-if="breadcrumbs.length < 3 && index === breadcrumbs.length - 1" @click="onAddBreadcrumbClick"></el-button>
                <el-button class="u-icon-btn" icon="minus" v-if="breadcrumbs.length > 1" @click="onDeleteBreadcrumbClick(index)"></el-button>
              </el-col>
            </el-row>
          </el-collapse-item>

          <el-collapse-item title="多Tab" name="tabs" class="m-config-tabs">
            <el-switch v-model="multiTabEnable" class="f-mb10" on-text="启用" off-text="停用" @change="onMultiTabEnableChange"></el-switch>
            <template v-if="multiTabEnable">
              <el-row v-for="(item, index) in multiTabs" :key="item.id + index" :gutter="20">
                <el-col :span="2"><label class="el-form-item__label">Tab {{ index }}</label></el-col>
                <el-col :span="8"><el-input placeholder="标题" v-model="item.title"></el-input></el-col>
                <el-col :span="8"><el-input placeholder="Tab key（可选）" v-model="item.key"></el-input></el-col>
                <el-col :span="6">
                  <el-button class="u-icon-btn" icon="plus" v-if="index === multiTabs.length - 1" @click="onAddTabClick"></el-button>
                  <el-button class="u-icon-btn" icon="minus" v-if="multiTabs.length > 1" @click="onDeleteTabClick(index)"></el-button>
                </el-col>
              </el-row>
            </template>
          </el-collapse-item>

          <el-collapse-item title="列表配置" name="list">
            <div class="f-mb10">
              <el-button size="small">导入NEI生成配置</el-button>
              <el-button size="small" v-if="multiTabEnable" @click="onCopyClick">复制当前页面配置</el-button>
              <el-button size="small" v-if="multiTabEnable && copyTab > -1 && copyTab != currentTab" @click="onPasteClick">
                粘贴页面配置（From tab: {{multiTabs[copyTab].title || `Tab ${copyTab}`}}）
              </el-button>
            </div>

            <el-tabs v-if="multiTabEnable" v-model="currentTab" type="border-card">
              <el-tab-pane
                v-for="(item, index) in multiTabs"
                :key="item.id + index"
                :label="item.title || `Tab ${index}`"
                :name="`${index}`"
              >
                <list-config v-model="listConfigs[index]"></list-config>
              </el-tab-pane>
            </el-tabs>
            <div v-else>
              <list-config v-model="listConfigs[0]"></list-config>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <preview-button></preview-button>
  </div>
</template>

<script>
import lodash from 'lodash';

import ToolsBar from '../components/ToolsBar.vue';
import SideBar from '../components/SideBar.vue';
import ListConfig from './components/ListConfig.vue';
import PreviewButton from '../components/PreviewButton.vue';

import VNodeTree from '@/../core/VNodeTree';

import { getLibraries } from '@/api/library';

const LIB_NAME = 'NEK-UI';

export default {
  components: {
    ToolsBar,
    SideBar,
    ListConfig,
    PreviewButton
  },
  created() {
    // 点击预览区的链接时阻止转跳
    window.onbeforeunload = function() {
      return '确认要离开当前页面？';
    };
  },
  destroyed() {
    window.onbeforeunload = null;
  },
  async mounted() {
    this.$nsVNodes = new VNodeTree();
    this.$refs.preview.setAttribute('ns-id', this.$nsVNodes.rootId);

    // 设置项目页面无关的数据
    this.pageInfo = {
      title: 'Test Page'
    };

    // 获取组件配置
    const { data } = await getLibraries({ names: 'nekui' });
    this.$nsVNodes.librarySet = data;

    this.initBreadcrumb();
    this.initTab();
    this.initForm();
    this.initList();

    this.updatePreview();

    // 更改项目页面配置，更新数据
  },
  // TODO: 完善watch中的子节点的差异对比和修改方式
  watch: {
    // 面包屑更新
    breadcrumbs: {
      deep: true,
      handler: function(newValue) {
        for (let i = 1; i < this.breadcrumbVNode.children.length; ++i) {
          this.$nsVNodes.removeNode(this.breadcrumbVNode.children[i]);
        }
        this.breadcrumbVNode.children.splice(1);

        newValue.forEach((el) => {
          this.addVNode('kl-crumb-item', this.breadcrumbVNode.id, null, {
            attributes: {
              content: el.title,
              href: el.link
            }
          });
        });

        this.updatePreview();
      }
    },

    // 多Tab启用/停用
    multiTabEnable: function(newValue) {
      if (newValue) {
        this.multiTabsVNode = this.addVNode('kl-tabs', this.tabsVNode.id);
        this.updateTabVNodes(this.multiTabs);
      } else if (this.multiTabsVNode) {
        this.$nsVNodes.removeNode(this.multiTabsVNode.id);
        this.multiTabsVNode = null;
      }

      this.updatePreview();
    },

    // 多Tab内容更新
    multiTabs: {
      deep: true,
      handler: function(newValue) {
        this.multiTabsVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
        this.multiTabsVNode.children = [];
        this.updateTabVNodes(newValue);
        this.updatePreview();
      }
    },

    // 筛选项更新
    filterData: {
      deep: true,
      handler: function(newValue) {
        this.filtersVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
        this.filtersVNode.children = [];

        newValue.forEach((el) => {
          const fieldAttrs = {};
          if (el.key) {
            fieldAttrs.value = {
              type: 'var',
              value: `condition.${el.key}`
            };
          }

          this.$nsVNodes.addFromObject({
            tagName: 'kl-col',
            libName: LIB_NAME,
            attributes: { span: 4 },
            children: [{
              tagName: 'kl-form-item',
              libName: LIB_NAME,
              attributes: { title: el.title },
              children: [{
                tagName: el.type,
                libName: LIB_NAME,
                attributes: fieldAttrs
              }]
            }]
          }, this.filtersVNode.id);
        });

        this.updatePreview();
      }
    },

    // 其他按钮更新
    buttonsData: {
      deep: true,
      handler: function(newValue) {
        if (newValue && newValue.length > 0) {
          if (!this.otherButtonsVNode) {
            this.otherButtonsVNode = this.addVNode('kl-card', null, this.listCardVNode.id, { attributes: { isShowLine: false } });
          }
          this.otherButtonsVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
          this.otherButtonsVNode.children = [];

          newValue.forEach((el) => {
            const attributes = { title: el.title };
            if (el.type && el.type !== 'default') {
              attributes.type = el.type;
            }
            this.addVNode('kl-button', this.otherButtonsVNode.id, null, { attributes });
          });
        } else if (this.otherButtonsVNode) {
          this.$nsVNodes.removeNode(this.otherButtonsVNode);
        }

        this.updatePreview();
      }
    },

    // 列更新
    colsData: {
      deep: true,
      handler: function(newValue) {
        if (!this.opColVNode) {
          this.listVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
          console.log(this.$nsVNodes, this.listVNode.children);
          this.listVNode.children = [];
        } else {
          for (let i = 0; i < this.listVNode.children.length - 1; ++i) {
            this.$nsVNodes.removeNode(this.listVNode.children[i]);
          }
          this.listVNode.children.splice(0, this.listVNode.children.length - 1);
        }

        newValue.forEach((el) => {
          const attributes = {
            name: el.title,
            key: el.key
          };
          if (el.fixed) {
            attributes.fixed = el.fixed;
          }
          this.addVNode('kl-table-col', this.listVNode.id, this.opColVNode, { attributes });
        });

        this.updatePreview();
      }
    },

    // 操作列更新
    colOperators: {
      deep: true,
      handler: function(newValue) {
        if (newValue) {
          if (!this.opColVNode) {
            this.opColVNode = this.addVNode('kl-table-col', this.listVNode.id, null, {
              attributes: {name: '操作', fixed: 'right'}
            });
            this.opColTplVNode = this.addVNode('kl-table-template', this.opColVNode.id, null, {
              attributes: {type: 'item'}
            });
          }

          let text = '';
          newValue.forEach((el) => {
            text += `{'<a href="javascript:">${el.title}</a>'}`;
          });
          if (this.opColTplVNode.children.length > 0) {
            this.$nsVNodes.removeNode(this.opColTplVNode.children[0]);
          }
          this.$nsVNodes.addTextNode(text, this.opColTplVNode.id);
        } else if (this.opColVNode) {
          this.$nsVNodes.removeNode(this.opColVNode.id);
          this.opColVNode = null;
        }

        this.updatePreview();
      }
    }
  },
  data() {
    return {
      toolsBarButtons: [{
        tip: '进入编辑器',
        icon: 'iconfont-edit',
        onClick: () => {
          this.$router.push({ name: 'editor', id: this.$route.query.id });
        }
      }],

      configActiveNames: ['breadcrumb', 'tabs', 'list'],

      breadcrumbs: [this.newBreadcrumbItem()],

      multiTabEnable: null,
      multiTabs: [this.newTabItem()],
      copyTab: -1,

      currentTab: '',
      listConfigs: [this.newColItem()],
    };
  },
  computed: {
    filterData() {
      return this.listConfigs[0].filters;
    },
    buttonsData() {
      return this.listConfigs[0].buttons;
    },
    colsData() {
      return this.listConfigs[0].cols;
    },
    colOperators() {
      if (this.listConfigs[0].operatorCol) {
        return this.listConfigs[0].operatorButtons;
      }
      return null;
    }
  },
  methods: {
    /* 几个主要节点的初始化 */

    // 面包屑
    initBreadcrumb() {
      this.breadcrumbVNode = this.$nsVNodes.addFromObject({
        tagName: 'kl-crumb',
        libName: LIB_NAME,
        children: [{
          tagName: 'kl-crumb-item',
          libName: LIB_NAME,
          children: [{
            tagName: 'kl-icon',
            libName: LIB_NAME,
            attributes: { type: 'home2', color: '#E31436' }
          }]
        }]
      });
    },

    // 搜索多Tab
    initTab() {
      this.tabsVNode = this.addVNode('kl-card', null, null, { attributes: { title: this.pageInfo.title } });
    },

    // 搜索区域表单
    initForm() {
      this.formCardVNode = this.addVNode('kl-card', null, null, { attributes: { isShowLine: false, class: 'f-undertab' } });
      this.searchVNode = this.addVNode('kl-search', this.formCardVNode.id);
      this.filtersVNode = this.addVNode('kl-row', this.searchVNode.id);
    },

    initList() {
      this.listCardVNode = this.addVNode('kl-card', null, null, { attributes: { isShowLine: false } });
      this.listVNode = this.addVNode('kl-table', this.listCardVNode.id);
      this.pagerVNode = this.addVNode('kl-pager', this.listCardVNode.id, null, {
        attributes: { sumTotal: 233, pageSize: 10, current: 1 }
      });
    },

    /* 面包屑 */
    onAddBreadcrumbClick() {
      if (this.breadcrumbs.length < 3) {
        this.breadcrumbs.push(this.newBreadcrumbItem());
      }
    },
    onDeleteBreadcrumbClick(index) {
      if (this.breadcrumbs.length > 1) {
        this.breadcrumbs.splice(index, 1);
      }
    },

    /* 多Tab */
    onMultiTabEnableChange() {
      this.currentTab = '0';
    },
    onAddTabClick() {
      this.multiTabs.push(this.newTabItem(this.multiTabs.length));
      this.listConfigs.push(this.newColItem());
    },
    async onDeleteTabClick(index) {
      if (this.multiTabs.length < 2) {
        return;
      }

      try {
        if (!this.isListEmpty(index)) {
          await this.$confirm('此Tab下列表配置不为空，确认要删除吗？', '提示');
        }
      } catch (err) {
        return;
      }

      if (this.currentTab == index) {
        this.currentTab = '0';
      }
      if (this.copyTab == index) {
        this.copyTab = -1;
      }

      this.multiTabs.splice(index, 1);
      this.listConfigs.splice(index, 1);
    },
    updateTabVNodes(tabs) {
      for (let i of tabs) {
        if (i.title) {
          this.addVNode('kl-tab', this.multiTabsVNode.id, null, { attributes: { title: i.title, key: i.key } });
        }
      }
    },

    /* 列表 */
    onCopyClick() {
      this.copyTab = parseInt(this.currentTab);
      this.$message.success('页面配置已复制');
    },
    async onPasteClick() {
      try {
        if (!this.isListEmpty(this.currentTab)) {
          await this.$confirm('此Tab下列表配置不为空，确认要覆盖吗？', '提示');
        }
      } catch (err) {
        return;
      }
      const copy = this.listConfigs[this.copyTab];
      const currentIndex = this.listConfigs.findIndex(el => el.id === this.currentTab);
      const newTab = lodash.cloneDeep(copy);
      this.listConfigs.splice(currentIndex, 1, newTab);

      this.$message.success('已粘贴');
    },

    /* 通用函数 */

    getRandomId() {
      return `${+new Date()}_${Math.round(Math.random() * 10000)}`;
    },
    isListEmpty(index) {
      const config = this.listConfigs[index];
      const { filters, buttons, cols, operatorCol, operatorButtons } = config;
      return filters.length + buttons.length + cols.length + operatorButtons.length === 0 && !operatorCol;
    },
    newBreadcrumbItem() {
      return { id: this.getRandomId(), title: '', link: '', nodeId: null };
    },
    newTabItem(key) {
      return {
        id: this.getRandomId(),
        title: '',
        key: key || ''
      };
    },
    newColItem() {
      return {
        filters: [],
        buttons: [],
        cols: [],
        operatorCol: false,
        operatorButtons: []
      };
    },

    /* vNodeTree函数二次封装 */

    addVNode(tagName, parentId = null, nextBrotherId = null, options = null) {
      return this.$nsVNodes.addNode(tagName, parentId, nextBrotherId, {
        libName: LIB_NAME,
        ...options
      });
    },

    updatePreview() {
      this.$nsVNodes.$update((item, nodeId) => {
        item.setAttribute('ns-id', nodeId);
      });
    }
  }
};
</script>

<style>
.m-list-editor {
  .el-collapse-item__wrap {
    background-color: #f2f2f2;
  }

  .el-tabs--border-card >.el-tabs__header {
    background-color: #f2f2f2;
  }
}

/* 预览区域中的class配置 */
.g-preview {
  .f-undertab {
    margin-top: -30px;
    padding-top: 0;
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}
</style>
<style scoped>
.g-editor {
  height: 100%;
  display: flex;
  flex-direction: column;

  .m-list-editor {
    display: flex;
    flex: 1;

    .m-left {
      flex: 1;

      .g-preview {
        height: 100%;
        margin: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        border-radius: 3px;
      }
    }

    .m-right {
      flex: 1;
    }

    .u-icon-btn {
      min-width: 0;
    }
  }
}
</style>
