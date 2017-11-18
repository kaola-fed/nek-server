<template>
  <div>
    <h1>项目详情</h1>
    <el-button @click="onCreateClick">新建页面</el-button>
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
            {{scope.row.type === 1 ? '列表页' : '合同页' }}
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
    <create-page-modal :visible="createPageVisible" :projectId="projectId" @refresh="getList" @close="onCreatePageClose"></create-page-modal>
  </div>
</template>

<script>
import CreatePageModal from './components/CreatePageModal.vue';
import { getPageList, deletePage, getDetail } from '@/api/project';

export default {
  components: {
    CreatePageModal
  },
  data() {
    return {
      createPageVisible: false,
      loading: false,
      list: [],
      project: {}
    };
  },
  computed: {
    projectId() {
      return this.$route.query.id;
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
    }
  }
};
</script>

<style scoped>
</style>
