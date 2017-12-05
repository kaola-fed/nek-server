<template>
  <div>
    <el-card>
    <div slot="header">
      <span class="u-card-title">页面管理</span>
      <el-button class="f-fr f-mb10" type="primary" @click="handleCreate">新建页面</el-button>
    </div>
    <h2>
    </h2>
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
            <el-button size="small" type="text" @click="handleSetting(scope.row)">设置</el-button>
            <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
  <create-page-modal :visible="createPageVisible" :pageId="currentPageId" :projectId="project._id" @refresh="getList" @close="handleCreateClose"></create-page-modal>
  </div>
</template>
<script>
import CreatePageModal from '../modals/CreatePage.vue';
import { getPageList, deletePage } from '@/api/page';
export default {
  components: {
    CreatePageModal
  },
  props: {
    project: Object
  },
  data() {
    return {
      createPageVisible: false,
      currentPageId: '',
      loading: false,
      list: []
    };
  },
  watch: {
    project: function(newValue) {
      newValue._id && this.getList(newValue._id);
    }
  },
  methods: {
    async getList(id) {
      this.loading = true;
      try {
        const { data } = await getPageList({ id });
        this.list = data;
      } finally {
        this.loading = false;
      }
    },
    handleCreate() {
      this.createPageVisible = true;
      this.currentPageId = '';
    },
    handleSetting(row) {
      this.createPageVisible = true;
      this.currentPageId = row._id;
    },
    handleCreateClose() {
      this.createPageVisible = false;
      this.currentPageId = '';
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
      if (!row._id) {
        return;
      }
      try {
        await this.$confirm('确认删除页面？', '提示', { type: 'warning' });
        await deletePage({ id: this.project._id, pageId: row._id });
        this.getList();
      } catch (err) {
        return;
      }
    }
  }
};
</script>
