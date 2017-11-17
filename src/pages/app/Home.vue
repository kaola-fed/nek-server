<template>
  <div>
    <el-row :gutter="0" type="flex">
      <el-col :span="24">
        <h2 class="g-section__content__title">最近项目
          <el-button type="primary" class="f-fr" @click="onCreateClick">新建项目</el-button></h2>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="item in projects" :key="item._id || +new Date()" :sm="12" :md="8" :lg="6">
        <div @click="onItemClick(item._id)" class="m-project-card">
        <el-card :body-style="cardStyle">
          <div slot="header">
            <div class="f-tac">
              <h3 class="f-mb10">{{ item.name }}</h3>
              <span>{{ item.updatedAt | date }}</span>
            </div>
          </div>
          <el-button type="text" icon="setting" @click.stop="onSettingClick(item._id)"></el-button>
          <el-button type="text" icon="delete" @click.stop="onDeleteClick(item._id)"></el-button>
        </el-card>
        </div>
      </el-col>
    </el-row>
    <project-modal :id="currentProjectId" :visible="projectVisible" @close="onProjectModalClose" @refresh="getList"></project-modal>
  </div>
</template>

<script>
import ProjectModal from './components/ProjectModal.vue';
import { getDashboard } from '@/api/user';
import { deleteProject } from '@/api/project';

export default {
  components: {
    ProjectModal
  },
  mounted() {
    this.getList();
  },
  computed: {
    cardStyle() {
      return {
        padding: '5px 50px',
        display: 'flex',
        justifyContent: 'space-around',
        background: '#f2f2f2'
      };
    }
  },
  data() {
    return {
      projects: [],
      projectVisible: false,
      currentProjectId: null
    };
  },
  methods: {
    async getList() {
      const { data } = await getDashboard();
      this.projects = data.projects;
    },
    onCreateClick() {
      this.currentProjectId = null;
      this.projectVisible = true;
    },
    onItemClick(id) {
      this.$router.push({
        name: 'projectDetail',
        query: { id }
      });
    },
    onSettingClick(id) {
      this.currentProjectId = id;
      this.projectVisible = true;
    },
    async onDeleteClick(id) {
      try {
        await this.$confirm('确认要删除项目？', '删除项目');
        await deleteProject({ id });
        this.getList();
      } catch (err) {
        return;
      }
    },
    onProjectModalClose() {
      this.projectVisible = false;
      this.currentProjectId = null;
    }
  }
};
</script>

<style scoped>
.m-project-card {
  cursor: pointer;
  margin-bottom: 20px;
  transition: 0.3s;
  border-radius: 4px;

  &:hover {
    box-shadow: 0 0 8px 0 rgba(100, 100, 100, 0.7);
  }
}
</style>
