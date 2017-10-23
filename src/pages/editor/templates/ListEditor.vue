<template>
  <div class="g-editor">
    <tools-bar projectName="Project" :buttons="toolsBarButtons"></tools-bar>
    <div class="m-list-editor">
      <div class="m-left">
        <div class="g-preview">
        </div>
        <side-bar placement="bottom" maxSize="40%" :defaultOpen="false">
        </side-bar>
      </div>
      <side-bar placement="right" maxSize="50%" type="light">
        <el-collapse v-model="configActiveNames">
          <el-collapse-item title="面包屑" name="breadcrumb">
            <el-switch v-model="breadcrumbEnable" class="f-mb10" on-text="启用" off-text="停用"></el-switch>
            <template v-if="breadcrumbEnable">
              <el-row v-for="(item, index) in breadcrumbs" :key="item.id" :gutter="20">
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
              <el-row v-for="(item, index) in multiTabs" :key="item.id" :gutter="20">
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
                :key="item.id"
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

export default {
  components: {
    ToolsBar,
    SideBar,
    ListConfig,
    PreviewButton
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

      breadcrumbEnable: true,
      breadcrumbs: [
        { id: this.getRandomId(), title: '', link: '' }
      ],

      multiTabEnable: false,
      multiTabs: [
        { id: this.getRandomId(), title: '', key: '' }
      ],
      copyTab: -1,

      currentTab: '',
      listConfigs: [{
        filters: [],
        buttons: [],
        cols: []
      }],
    };
  },
  methods: {
    onAddBreadcrumbClick() {
      if (this.breadcrumbs.length < 3) {
        this.breadcrumbs.push({ id: this.getRandomId(), title: '', link: '' });
      }
    },
    onDeleteBreadcrumbClick(index) {
      if (this.breadcrumbs.length > 1) {
        this.breadcrumbs.splice(index, 1);
      }
    },
    onMultiTabEnableChange() {
      this.currentTab = '0';
    },
    onAddTabClick() {
      this.multiTabs.push({ id: this.getRandomId(), title: '', key: this.multiTabs.length });
      this.listConfigs.push({ filters: [], buttons: [], cols: [] });
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
      this.listConfigs[this.currentTab] = {
        filters: copy.filters.map(el => ({ ...el })),
        buttons: copy.buttons.map(el => ({ ...el })),
        cols: copy.cols.map(el => ({ ...el }))
      };
      this.$forceUpdate();
      this.$message.success('已粘贴');
    },

    getRandomId() {
      return `${+new Date()}_${Math.round(Math.random() * 10000)}`;
    },
    isListEmpty(index) {
      const config = this.listConfigs[index];
      const { filters, buttons, cols } = config;
      return filters.length + buttons.length + cols.length === 0;
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
