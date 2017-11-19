<template>
  <div>
    <h1>{{ name }}{{ version }}</h1>
    <el-button class="f-fr f-mb10" type="primary" @click="onCreateClick">新建组件</el-button>
    <div v-loading="loading">
      <el-table striple :data="list" border tooltip-effect="dark">
        <el-table-column align="left" prop="name" label="组件名" show-overflow-tooltip></el-table-column>
        <el-table-column align="left" prop="tag" label="tag" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="isLayout" label="isLayout" show-overflow-tooltip>
          <template scope="scope">
            {{scope.row.isLayout ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="events" label="事件" show-overflow-tooltip>
          <template scope="scope">
            {{ scope.row.events.join(', ') }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updatedAt" label="更新时间" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <create-component-modal :visible="componentVisible" :componentId="currentComponentId" :libraryId="libraryId" @refresh="getList" @close="onCreateLibClose"></create-component-modal>
  </div>
</template>

<script>
import CreateComponentModal from './components/CreateComponentModal.vue';
import { getComponentList, deleteComponent } from '@/api/library';

export default {
  components: {
    CreateComponentModal
  },
  data() {
    return {
      componentVisible: false,
      currentComponentId: '',
      loading: false,
      name: '',
      version: '',
      list: []
    };
  },
  computed: {
    libraryId() {
      return this.$route.query.id;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data } = await getComponentList({id: this.libraryId});
        this.list = data.components;
        this.name = data.name;
        this.version = `（${data.version}）`;
        this.loading = false;
      } catch (err) {
        this.loading = false;
        return;
      }
    },
    onCreateClick() {
      this.currentComponentId = '';
      this.componentVisible = true;
    },
    onCreateLibClose() {
      this.currentComponentId = '';
      this.componentVisible = false;
    },
    handleEdit(row) {
      if(!row._id) {
        return;
      }
      this.currentComponentId = row._id;
      this.componentVisible = true;
    },
    async handleDelete(row) {
      if(!row._id) {
        return;
      }
      try {
        await this.$confirm('确认删除组件？', '提示', { type: 'warning' });
        await deleteComponent({ id: this.libraryId, pageId: row._id });
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
