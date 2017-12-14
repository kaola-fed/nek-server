<template>
  <div class="g-editor">
    <tools-bar projectName="返回" :buttons="toolsBarButtons" :pageName="pageName" @save="onSave"></tools-bar>
    <div class="m-list-editor">
      <div class="m-left">
        <div class="g-preview" id="ns-preview" @insertNsid="onInsertNsid">
          <div ref="preview">
          </div>
        </div>
      </div>
      <side-bar placement="right" maxSize="50%" type="light" :toggleable="false">
        <el-collapse v-model="configActiveNames">
          <el-collapse-item title="面包屑" name="breadcrumb">
            <el-row v-for="(item, index) in breadcrumbs" :key="item.id + index" :gutter="20">
              <el-col :span="3"><label class="el-form-item__label">第{{ index + 1 }}级</label></el-col>
              <el-col :span="8"><el-input placeholder="标题" v-model="item.title"></el-input></el-col>
              <el-col :span="8"><el-input placeholder="转跳链接（可选）" v-model="item.link"></el-input></el-col>
              <el-col :span="5">
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
              <el-button size="small" @click="onImportClick">导入NEI生成配置</el-button>
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
      </side-bar>
    </div>

    <preview-button></preview-button>
  </div>
</template>

<script>
import lodash from 'lodash';
import VNodeTree from '@/../core/src/VNodeTree';
import { genMockData } from '@/../core/src/codegen/utils';

import ToolsBar from '../components/ToolsBar.vue';
import SideBar from '../components/SideBar.vue';
import ListConfig from './components/ListConfig.vue';
import PreviewButton from '../components/PreviewButton.vue';

import * as listItems from './utils/listItems';

import NekComponent from '@/widget/NekComponent';

import { getComponentList } from '@/api/library';
import { getListTemplate, getPageNei, updatePageDom, getPageDetail } from '@/api/page';

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
    this.$nsVNodes.NekComponent = NekComponent;
    this.$nsVNodes.data = { list: [], condition: {} };
    this.$nsVNodes.rootView = this.$refs.preview;

    this.pageInfo = {
      title: ''
    };

    // 获取页面信息
    try {
      const { data } = await getPageDetail({ id: this.$route.query.id });
      this.pageName = `${data.name}（${data.url}）`;
      this.pageInfo.title = data.name || '页面标题';
    } catch (err) {
      return;
    }

    // 获取组件配置
    const lib = await getComponentList({ id: this.$route.query.library });
    this.$nsVNodes.librarySet = lib.data;

    this.initBreadcrumb();
    this.initTab();
    this.initForm();
    this.initList();

    this.updatePreview();

    // 更改项目页面配置，更新数据
    const { data } = await getListTemplate({ id: this.$route.query.id });
    this.setBreadcrumbs(data.breadcrumbs);
    this.multiTabEnable = !!data.tabsEnable;
    this.setTabs(data.tabs);
    this.setCols(data.lists);
    this.url = data.url || '';

    this.$forceUpdate();
  },
  watch: {
    needUpdate: {
      handler: function(newValue) {
        this.updateWatcher(newValue);
      }
    },

    // 面包屑更新
    breadcrumbs: {
      deep: true,
      handler: function(newValue) {
        this.breadcrumbsWatcher(newValue);
      }
    },

    // 多Tab启用/停用
    multiTabEnable: function(newValue) {
      if (newValue) {
        this.multiTabsVNode = this.$nsVNodes.addNode('kl-tabs', this.tabsVNode.id);
        this.updateTabVNodes(this.multiTabs);
      } else if (this.multiTabsVNode) {
        this.$nsVNodes.removeNode(this.multiTabsVNode.id);
        this.multiTabsVNode = null;
      }

      this.needUpdate = true;
    },

    // 多Tab内容更新
    multiTabs: {
      deep: true,
      handler: function(newValue) {
        this.multiTabsWatcher(newValue);
      }
    },

    // 筛选项更新
    filterData: {
      deep: true,
      handler: function(newValue) {
        this.filterDataWatcher(newValue);
      }
    },

    // 其他按钮更新
    buttonsData: {
      deep: true,
      handler: function(newValue) {
        this.buttonsDataWatcher(newValue);
      }
    },

    // 列更新
    colsData: {
      deep: true,
      handler: function(newValue) {
        this.colsDataWatcher(newValue);
      }
    },

    // 操作列更新
    colOperators: {
      deep: true,
      handler: function(newValue) {
        this.colOperatorsWatcher(newValue);
      }
    }
  },
  data() {
    return {
      toolsBarButtons: [
//        {
//          tip: '进入编辑器',
//          icon: 'iconfont-edit',
//          onClick: () => {
//            this.$confirm('进入拖拽编辑模式后将不能再使用模板编辑模式，确认要继续？', '提示')
//              .then(() => this.$router.push({ name: 'editor', id: this.$route.query.id }));
//          }
//        },
        {
          tip: '刷新预览区',
          icon: 'iconfont-refresh',
          onClick: () => this.updatePreview()
        }
      ],

      configActiveNames: ['breadcrumb', 'tabs', 'list'],

      breadcrumbs: [listItems.newBreadcrumbItem()],

      multiTabEnable: null,
      multiTabs: [listItems.newTabItem()],
      copyTab: -1,

      currentTab: '0',
      listConfigs: [listItems.newListConfigItem()],
      needUpdate: false,
      //列表页名称
      pageName: '',
      // 列表请求URL
      url: ''
    };
  },
  computed: {
    filterData() {
      return this.listConfigs[this.currentTab || 0].filters;
    },
    buttonsData() {
      return this.listConfigs[this.currentTab || 0].buttons;
    },
    colsData() {
      return this.listConfigs[this.currentTab || 0].cols;
    },
    colOperators() {
      if (this.listConfigs[this.currentTab || 0].operatorCol) {
        return this.listConfigs[this.currentTab || 0].operatorButtons;
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
      this.tabsVNode = this.$nsVNodes.addNode('kl-card', null, null, { attributes: { title: this.pageInfo.title } });
    },

    // 搜索区域表单
    initForm() {
      this.formCardVNode = this.$nsVNodes.addNode('kl-card', null, null, { attributes: { isShowLine: false, class: 'f-undertab' } });
      this.searchVNode = this.$nsVNodes.addNode('kl-search', this.formCardVNode.id, null, { attributes: { isShowMore: false } });
      this.filtersVNode = this.$nsVNodes.addNode('kl-row', this.searchVNode.id);
    },

    initList() {
      this.listCardVNode = this.$nsVNodes.addNode('kl-card', null, null, { attributes: { isShowLine: false } });
      this.listVNode = this.$nsVNodes.addNode('kl-table', this.listCardVNode.id, null, {
        attributes: {
          source: {
            type: 'var',
            value: 'list'
          }
        }
      });
      this.$nsVNodes.addNode('kl-pager', this.listCardVNode.id, null, {
        attributes: { sumTotal: 233, pageSize: 10, current: 1 }
      });
    },

    /* 面包屑 */
    onAddBreadcrumbClick() {
      if (this.breadcrumbs.length < 3) {
        this.breadcrumbs.push(listItems.newBreadcrumbItem());
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
      this.multiTabs.push(listItems.newTabItem(this.multiTabs.length));
      this.listConfigs.push(listItems.newListConfigItem());
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
          this.$nsVNodes.addNode('kl-tab', this.multiTabsVNode.id, null, { attributes: { title: i.title, key: i.key } });
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

    /* UI事件 */

    // 导入nei配置
    async onImportClick() {
      const currentTab = this.currentTab || 0;
      try {
        if (!this.isListEmpty(currentTab)) {
          await this.$confirm('此Tab下列表配置不为空，确认要覆盖吗？', '提示');
        }
        const { value } = await this.$prompt('请输入获取列表的url', '提示', {
          inputPattern: /\S+/,
          inputErrorMessage: 'url不能为空'
        });

        const { data } = await getPageNei({ id: this.$route.query.id, url: value });

        this.listConfigs[currentTab].filters = listItems.setListWithTemplate(data.filters, listItems.newFilter());
        this.listConfigs[currentTab].cols = listItems.setListWithTemplate(data.cols, listItems.newCol());
        this.url = value;

        this.$forceUpdate();
      } catch (err) {
        return err;
      }
    },
    onInsertNsid(event) {
      const { elem, nsid } = event.detail;
      for(let i=0, len=elem.childNodes.length; i<len; i++) {
        if(elem.childNodes[i].nodeType == Node.ELEMENT_NODE) {
          elem.childNodes[i].setAttribute('ns-id', nsid);
          //删除外层空div
          setTimeout(() => {
            const emptyDiv = document.getElementById(nsid);
            emptyDiv && emptyDiv.parentNode.replaceChild(emptyDiv.childNodes[i], emptyDiv);
          }, 0);
        }
      }
    },
    async onSave() {
      // TODO: 校验
      try {
        if (this.saveNotify) {
          this.saveNotify.close();
        }
        await this.saveDomJson();
        this.saveNotify = this.$notify({
          title: '保存成功',
          message: `nek server -k ${this.$route.query.id}`,
          type: 'success',
          duration: 0
        });
      } catch (err) {
        return err;
      }
    },

    /* 通用函数 */

    isListEmpty(index) {
      const config = this.listConfigs[index];
      const { filters, buttons, cols, operatorCol, operatorButtons } = config;
      return filters.length + buttons.length + cols.length + operatorButtons.length === 0 && !operatorCol;
    },

    setBreadcrumbs(value) {
      if (value) {
        this.breadcrumbs = listItems.setListWithTemplate(value, listItems.newBreadcrumbItem());
      }
    },

    setTabs(value) {
      if (value) {
        this.multiTabs = listItems.setListWithTemplate(value, listItems.newTabItem());
      }
    },

    setCols(value) {
      if (!value) {
        return;
      }

      const listTemplate = listItems.newListConfigItem();
      this.listConfigs = value.map((el) => {
        const item = { ...listTemplate, ...el };
        const { filters, buttons, cols, operatorButtons, ...other } = item;
        return {
          ...other,
          filters: listItems.setListWithTemplate(filters, listItems.newFilter()),
          buttons: listItems.setListWithTemplate(buttons, listItems.newButton()),
          cols: listItems.setListWithTemplate(cols, listItems.newCol()),
          operatorButtons: listItems.setListWithTemplate(operatorButtons, listItems.newOperatorButton()),
        };
      });
    },

    // 保存dom json
    async saveDomJson() {
      const domObj = {
        breadcrumbs: this.breadcrumbs,
        tabsEnable: this.multiTabEnable,
        tabs: this.multiTabs,
        lists: this.listConfigs,
        url: this.url
      };
      try {
        await updatePageDom({ id: this.$route.query.id, dom: JSON.stringify(domObj) });
      } catch (err) {
        return err;
      }
    },

    updatePreview() {
      this.$nsVNodes.$update({ rerender: true, outter: false });
    },

    /* debounce watchers */

    breadcrumbsWatcher: lodash.debounce(function(newValue) {
      for (let i = 1; i < this.breadcrumbVNode.children.length; ++i) {
        this.$nsVNodes.removeNode(this.breadcrumbVNode.children[i]);
      }
      this.breadcrumbVNode.children.splice(1);

      newValue.forEach((el) => {
        const { title, link, ...otherAttr } = el;
        this.$nsVNodes.addNode('kl-crumb-item', this.breadcrumbVNode.id, null, {
          attributes: {
            content: title,
            href: link,
            ...otherAttr
          }
        });
      });

      this.needUpdate = true;
    }, 500),

    multiTabsWatcher: lodash.debounce(function(newValue) {
      // TODO: 切换状态的时候 初始化/删除 VNode
      if (!this.multiTabsVNode) {
        return;
      }
      this.multiTabsVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
      this.multiTabsVNode.children = [];
      this.updateTabVNodes(newValue);

      this.needUpdate = true;
    }, 500),

    filterDataWatcher: lodash.debounce(function(newValue) {
      this.filtersVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
      this.filtersVNode.children = [];

      newValue.forEach((el) => {
        const { key, ...attrs } = el;
        const fieldAttrs = { ...attrs };
        if (key) {
          fieldAttrs.value = {
            type: 'var',
            value: `condition.${key}`
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

      this.needUpdate = true;
    }, 500),

    buttonsDataWatcher: lodash.debounce(function(newValue) {
      if (newValue && newValue.length > 0) {
        if (!this.otherButtonsVNode) {
          this.otherButtonsVNode = this.$nsVNodes.addNode('kl-card', null, this.listCardVNode.id, { attributes: { isShowLine: false } });
        }
        this.otherButtonsVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
        this.otherButtonsVNode.children = [];

        newValue.forEach((el) => {
          const { event, ...attributes } = el;
          let events = event ? { click: el.event } : undefined;
          this.$nsVNodes.addNode('kl-button', this.otherButtonsVNode.id, null, { attributes, events });
        });
      } else if (this.otherButtonsVNode) {
        this.$nsVNodes.removeNode(this.otherButtonsVNode.id);
        this.otherButtonsVNode = null;
      }

      this.needUpdate = true;
    }, 500),

    colsDataWatcher: lodash.debounce(function(newValue) {
      if (!this.opColVNode) {
        this.listVNode.children.forEach(el => this.$nsVNodes.removeNode(el));
        this.listVNode.children = [];
      } else {
        for (let i = 0; i < this.listVNode.children.length - 1; ++i) {
          this.$nsVNodes.removeNode(this.listVNode.children[i]);
        }
        this.listVNode.children.splice(0, this.listVNode.children.length - 1);
      }

      // TODO: 增加的时候操作列还有bug
      newValue.forEach((el) => {
        this.$nsVNodes.addNode('kl-table-col', this.listVNode.id, this.opColVNode, { attributes: el });
      });

      this.$nsVNodes.data.list = genMockData(newValue);

      this.needUpdate = true;
    }, 500),

    colOperatorsWatcher: lodash.debounce(function(newValue) {
      if (newValue) {
        if (!this.opColVNode) {
          this.opColVNode = this.$nsVNodes.addNode('kl-table-col', this.listVNode.id, null, {
            attributes: {name: '操作', fixed: 'right', width: '150'}
          });
          this.opColTplVNode = this.$nsVNodes.addNode('kl-table-template', this.opColVNode.id, null, {
            attributes: {type: 'item'}
          });
        }

        let text = '';
        newValue.forEach((el) => {
          text += `{'<a href="${el.link || 'javascript:'}">${el.title}</a>'}`;
        });
        if (this.opColTplVNode.children.length > 0) {
          this.$nsVNodes.removeNode(this.opColTplVNode.children[0]);
        }
        this.$nsVNodes.addTextNode(text, this.opColTplVNode.id);
      } else if (this.opColVNode) {
        this.$nsVNodes.removeNode(this.opColVNode.id);
        this.opColVNode = null;
      }

      this.needUpdate = true;
    }, 500),

    updateWatcher: lodash.debounce(function(newValue) {
      if (newValue) {
        this.updatePreview();
        this.needUpdate = false;
      }
    }, 100),
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
      display: flex;
      flex-direction: column;
      flex: 1;
      max-width: 50%;

      .g-preview {
        flex: 1;
        margin: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        border-radius: 3px;
      }
    }

    .u-icon-btn {
      min-width: 0;
    }
  }
}
</style>
<style>
.el-notification {
    width: 350px;
}
.el-notification__content {
  word-break: break-all;
}
</style>
