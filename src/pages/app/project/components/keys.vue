<template>
  <div>
    <el-card>
      <div slot="header">
        <span class="u-card-title">nei key 管理</span>
        <el-button class="f-fr f-mb10" type="primary" @click="handleCreate">新建key</el-button>
      </div>
      <div v-loading="loading">
        <el-table stripe :data="list" border tooltip-effect="dark">
          <el-table-column align="left" prop="name" label="项目名" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="key" label="key值" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" label="操作" show-overflow-tooltip>
            <template scope="scope">
              <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <create-key-modal :projectId="projectId" :keyId="currentKeyId" :visible="createVisible"
      @refresh="getList" @close="handleCreateClose">
      </create-key-modal>
  </div>
</template>

<script>
import { getKeyList, deleteKey } from '@/api/key';
import CreateKeyModal from './../modals/CreateKey.vue';
export default {
  props: {
    projectId: String
  },
  components: {
    CreateKeyModal
  },
  data() {
    return {
      loading: false,
      list: [],
      createVisible: false,
      currentKeyId: ''
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { data } = await getKeyList({ projectId: this.projectId });
        this.loading = false;
        this.list = data;
      } catch (err) {
        this.loading = false;
        return;
      }
    },
    handleCreate() {
      this.currentKeyId = '';
      this.createVisible = true;
    },
    handleEdit(row) {
      this.currentKeyId = row._id;
      this.createVisible = true;
    },
    handleCreateClose() {
      this.createVisible = false;
      this.currentKeyId = '';
    },
    async handleDelete(row) {
      if (!row._id) {
        return;
      }
      try {
        await this.$confirm('确认删除该key', '删除', { type: 'warning' });
        await deleteKey({ id: row._id });
        this.getList();
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style>

</style>
