<template>
  <div>
    <h1>{{ project.name }}</h1>
    <el-button class="f-fr f-mb10" type="primary" @click="onCreateClick">新建页面</el-button>
    <div v-loading="loading">
      <el-table striple :data="list" border tooltip-effect="dark">
        <el-table-column align="left" prop="url" label="url" show-overflow-tooltip>
          <template scope="scope">
            <a href="javascript:;" @click="handleEdit(scope.row)"> {{ scope.row.url }} </a>
          </template>
        </el-table-column>
        <el-table-column align="left" prop="name" label="描述" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="type" label="类型" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.type === 1 ? '列表页' : '编辑页' }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updatedAt" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row)">预览</el-button>
            <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-tabs type="border-card" class="f-mt10" v-model="currentTab" v-if="isShowTpl">
      <el-tab-pane label="entry" name="entry">
        <el-input type="textarea" class="m-textarea f-mb10" v-model="project.entry" placeholder="请输入entry模板"></el-input>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleSave('entry')">保存</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="ftl" name="ftl">
        <el-input type="textarea" class="m-textarea f-mb10" v-model="project.ftl" placeholder="请输入ftl模板"></el-input>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleSave('ftl')">保存</el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <create-page-modal :visible="createPageVisible" :projectId="projectId" @refresh="getList" @close="onCreatePageClose"></create-page-modal>
  </div>
</template>

<script>
import CreatePageModal from './components/CreatePageModal.vue';
import { getDetail, updateTpl } from '@/api/project';
import { getPageList, deletePage } from '@/api/page';

export default {
  components: {
    CreatePageModal
  },
  data() {
    return {
      createPageVisible: false,
      loading: false,
      list: [],
      project: {},
      currentTab: 'entry'
    };
  },
  computed: {
    projectId() {
      return this.$route.query.id;
    },
    isShowTpl() {
      return this.project.type == 1;
    }
  },
  mounted() {
    this.getList();
    this.getProjectSetting();
  },
  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data } = await getPageList({id: this.projectId});
        this.list = data;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        return;
      }
    },
    async getProjectSetting() {
      try {
        const { data } = await getDetail({id: this.projectId});
        this.project = data;
      } catch (err) {
        return;
      }
    },
    onCreateClick() {
      this.createPageVisible = true;
    },
    onCreatePageClose() {
      this.createPageVisible = false;
    },
    handleEdit(row) {
      const routerName = row.type === 1 ? 'listTemplate' : 'editor';
      this.$router.push({
        name: routerName,
        query: {
          id: row._id,
          library: this.project.library
        }
      });
    },
    async handleDelete(row) {
      if(!row._id) {
        return;
      }
      try {
        await this.$confirm('确认删除页面？', '提示', { type: 'warning' });
        await deletePage({ id: this.projectId, pageId: row._id });
        this.getList();
      } catch (err) {
        return;
      }
    },
    async handleSave(type) {
      try {
        await updateTpl({ id: this.projectId, type, tpl: this.project[type] });
        this.$message.success('保存成功！');
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style>
.m-textarea {
  .el-textarea__inner {
    min-height: 500px;
  }
}
</style>
