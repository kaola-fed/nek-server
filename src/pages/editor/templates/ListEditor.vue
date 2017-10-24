<template>
  <div class="g-editor">
    <tools-bar projectName="Project" :buttons="toolsBarButtons"></tools-bar>
    <div class="m-list-editor">
      <div class="m-left">
        <div class="g-preview">
          <div ref="breadcrumb"></div>
          <div ref="tabs"></div>
          <div ref="list"></div>
          <div ref="pager"></div>
        </div>
        <side-bar placement="bottom" maxSize="40%" :defaultOpen="false">
        </side-bar>
      </div>
      <side-bar placement="right" maxSize="50%" type="light">
        <el-collapse v-model="configActiveNames">
          <el-collapse-item title="面包屑" name="breadcrumb">
            <el-switch v-model="breadcrumbEnable" class="f-mb10" on-text="启用" off-text="停用"></el-switch>
            <template v-if="breadcrumbEnable">
              <el-row v-for="(item, index) in breadcrumbs" :key="item.id + index" :gutter="20">
                <el-col :span="2"><label class="el-form-item__label">第{{ index + 1 }}级</label></el-col>
                <el-col :span="8"><el-input placeholder="标题" v-model="item.title"></el-input></el-col>
                <el-col :span="8"><el-input placeholder="转跳链接（可选）" v-model="item.link"></el-input></el-col>
                <el-col :span="6">
                  <el-button class="u-icon-btn" icon="plus" v-if="breadcrumbs.length < 3 && index === breadcrumbs.length - 1" @click="onAddBreadcrumbClick"></el-button>
                  <el-button class="u-icon-btn" icon="minus" v-if="breadcrumbs.length > 1" @click="onDeleteBreadcrumbClick(index)"></el-button>
                </el-col>
              </el-row>
            </template>
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
      </side-bar>
    </div>

    <preview-button></preview-button>
  </div>
</template>

<script>
import ToolsBar from '../components/ToolsBar.vue';
import SideBar from '../components/SideBar.vue';
import ListConfig from './components/ListConfig.vue';
import PreviewButton from '../components/PreviewButton.vue';

import NekComponent from '@/widget/NekComponent';
import VNodeTree from '@/../core/VNodeTree';

export default {
  components: {
    ToolsBar,
    SideBar,
    ListConfig,
    PreviewButton
  },
  mounted() {
    this.$nsVNodes = new VNodeTree();

    // 初始化值
    this.breadcrumbNode = null;
    this.multiTabsNode = null;
    this.listNode = null;

    // 获取项目配置，数据到watch中更新
    this.breadcrumbEnable = true;
  },
  watch: {
    breadcrumbEnable(newValue) {
      if (newValue) {
        this.breadcrumbNode = this.$nsVNodes.addNode('kl-crumb', this.$nsVNodes.root.id, null, { libName: 'NEKUI' });
        this.breadcrumbHomeNode = this.$nsVNodes.addNode('kl-crumb-item', this.breadcrumbNode.id, null, { libName: 'NEKUI' });
        this.$nsVNodes.addNode('kl-icon', this.breadcrumbHomeNode.id, null, {
          libName: 'NEKUI',
          attributes: {
            type: 'home2',
            color: '#E31436'
          }
        });

        this.breadcrumbs.forEach((el) => {
          const tmp = this.$nsVNodes.addNode('kl-crumb-item', this.breadcrumbNode.id, null, {
            libName: 'NEKUI',
            attributes: {
              href: el.link
            }
          });
          this.$nsVNodes.addTextNode(el.title, tmp.id);
        });

        const tpl = this.$nsVNodes.getTemplate(this.breadcrumbNode.id);
        NekComponent.inject(tpl, this.$refs.breadcrumb);
      } else {
        this.$nsVNodes.removeNode(this.breadcrumbNode.id);
        this.breadcrumbNode = null;
        this.$refs.breadcrumb.innerHTML = '';
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

      breadcrumbEnable: null,
      breadcrumbs: [this.newBreadcrumbItem()],

      multiTabEnable: null,
      multiTabs: [this.newTabItem()],
      copyTab: -1,

      currentTab: '',
      listConfigs: [this.newColItem()],
    };
  },
  methods: {
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
      const { filters, buttons, cols, operatorButtons, ...others } = copy;
      this.listConfigs[this.currentTab] = {
        filters: filters.map(el => ({ ...el })),
        buttons: buttons.map(el => ({ ...el })),
        cols: cols.map(el => ({ ...el })),
        operatorButtons: operatorButtons.map(el => ({ ...el })),
        ...others
      };
      this.$forceUpdate();
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
      return { id: this.getRandomId(), title: '', link: '' };
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

      .g-preview {
        flex: 1;
        margin: 10px;
        background-color: white;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 10px;
        box-shadow: 0 0 3px 3px rgba(43, 43, 43, 0.1);
        border-radius: 3px;
      }
    }

    .u-icon-btn {
      min-width: 0;
    }
  }
}
</style>
