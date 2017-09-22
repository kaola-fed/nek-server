<template>
  <div>
    <el-row :gutter="20">
      <h2 class="g-section__content__title">最近项目</h2>
      <el-col v-for="item in projects" :key="item.id || +new Date()" :sm="12" :md="8" :lg="6">
        <el-card :body-style="cardStyle" class="f-mb20">
          <div slot="header">
            <div class="f-tac">
              <h3 class="f-mb10">{{ item.name }}</h3>
              <span>{{ item.updatedTime | date }}</span>
            </div>
          </div>
          <el-button type="text" icon="edit" @click="onEditClick(item.id)"></el-button>
          <el-button type="text" icon="setting" @click="onSettingClick(item.id)"></el-button>
          <el-button type="text" icon="delete" @click="onDeleteClick(item.id)"></el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDashboard } from '@/api/user';

export default {
  async mounted() {
    const { data } = await getDashboard();
    this.projects = data.projects;
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
      projects: []
    };
  },
  methods: {
    onEditClick(id) {
      this.$router.push({
        name: 'editor',
        query: { id }
      });
    },
    onSettingClick(id) {
      this.$router.push({
        name: 'projectSetting',
        query: { id }
      });
    },
    onDeleteClick() {
      this.$confirm('确认要删除项目？', '删除项目');
    }
  }
};
</script>

<style scoped>
</style>
