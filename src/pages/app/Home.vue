<template>
  <div>
    <el-row :gutter="0" type="flex">
      <el-col :span="24">
        <h2 class="g-section__content__title">最近项目
          <el-button type="primary" class="f-fr" @click="onCreateClick('project')">新建项目</el-button></h2>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="item in projects" :key="item._id || +new Date()" :sm="12" :md="8" :lg="6">
        <div @click="onItemClick(item._id, 'project')" class="m-project-card">
        <el-card :body-style="cardStyle">
          <div slot="header">
            <div class="f-tac">
              <h3 class="f-mb10">{{ item.name }}</h3>
              <span>{{ item.updatedAt | date }}</span>
            </div>
          </div>
          <el-button type="text" icon="setting" @click.stop="onSettingClick(item._id, 'project')"></el-button>
          <el-button type="text" icon="delete" @click.stop="onDeleteClick(item._id, 'project')"></el-button>
        </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0" type="flex">
      <el-col :span="24">
        <h2 class="g-section__content__title">组件库
          <el-button type="primary" class="f-fr" @click="onCreateClick('library')">新建组件库</el-button></h2>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-for="item in libraries" :key="item._id || +new Date()" :sm="12" :md="8" :lg="6">
        <div @click="onItemClick(item._id, 'library')" class="m-project-card">
        <el-card :body-style="cardStyle">
          <div slot="header">
            <div class="f-tac">
              <h3 class="f-mb10">{{ item.name }}</h3>
              <span>{{ item.updatedAt | date }}</span>
            </div>
          </div>
          <el-button type="text" icon="setting" @click.stop="onSettingClick(item._id, 'library')"></el-button>
          <el-button type="text" icon="delete" @click.stop="onDeleteClick(item._id, 'library')"></el-button>
        </el-card>
        </div>
      </el-col>
    </el-row>
    <project-modal :id="currentProjectId" :visible="projectVisible" @close="onProjectModalClose" @refresh="getProjectList"></project-modal>
    <library-modal :id="currentLibraryId" :visible="libraryVisible" @close="onLibraryModalClose" @refresh="getLibraryList"></library-modal>
  </div>
</template>

<script>
import ProjectModal from './components/ProjectModal.vue';
import LibraryModal from './components/LibraryModel.vue';
import { getDashboard } from '@/api/user';
import { deleteProject } from '@/api/project';
import { getLibraries, deleteLibrary } from '@/api/library';

export default {
  components: {
    ProjectModal,
    LibraryModal
  },
  mounted() {
    this.getProjectList();
    this.getLibraryList();
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
      libraries: [],
      projectVisible: false,
      currentProjectId: null,
      libraryVisible: false,
      currentLibraryId: null
    };
  },
  methods: {
    async getProjectList() {
      try {
        const { data } = await getDashboard();
        this.projects = data.projects || [];
      } catch (err) {
        return;
      }
    },
    async getLibraryList() {
      try {
        const { data } = await getLibraries();
        this.libraries = data || [];
      } catch (err) {
        return;
      }
    },
    onCreateClick(type) {
      if(type === 'project') {
        this.currentProjectId = null;
        this.projectVisible = true;
      } else if(type === 'library') {
        this.currentLibraryId = null;
        this.libraryVisible = true;
      }
    },
    onItemClick(id, type) {
      const name = type === 'project' ? 'projectDetail' : 'components';
      this.$router.push({
        name,
        query: { id }
      });
    },
    onSettingClick(id, type) {
      if(type === 'project') {
        this.currentProjectId = id;
        this.projectVisible = true;
      } else if(type === 'library') {
        this.currentLibraryId = id;
        this.libraryVisible = true;
      }
    },
    async onDeleteClick(id, type) {
      try {
        if(type === 'project') {
          await this.$confirm('确认要删除项目？', '删除');
          await deleteProject({ id });
          this.getProjectList();
        } else {
          await this.$confirm('确认要删除组件库？', '删除');
          await deleteLibrary({ id });
          this.getLibraryList();
        }
      } catch (err) {
        return;
      }
    },
    onProjectModalClose() {
      this.projectVisible = false;
      this.currentProjectId = null;
    },
    onLibraryModalClose() {
      this.libraryVisible = false;
      this.currentLibraryId = null;
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
