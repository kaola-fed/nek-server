<template>
  <div class="container">
    <div class="left-menu">
      <el-menu :default-active="activeMenu" @select="handleSelect">
        <el-menu-item v-for="item in menuItems" :key="item.name" :index="item.name">{{ item.label }}</el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <keep-alive>
        <component :is="activeMenu" :project="project" :projectId="project._id"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { getDetail } from '@/api/project';

import PageCard from './components/pages.vue';
import TplCard from './components/tpls.vue';
import KeyCard from './components/keys.vue';
import MembersCard from './components/members.vue';

export default {
  components: {
    PageCard,
    TplCard,
    KeyCard,
    MembersCard
  },
  mounted() {
    this.getProjectSetting();
  },
  data() {
    return {
      activeMenu: 'PageCard',
      project: {},
      menuItems: [
        { label: '页面管理', name: 'PageCard' },
        { label: '模板管理', name: 'TplCard' },
        { label: 'Key 管理', name: 'KeyCard' },
        { label: '成员管理', name: 'MembersCard' },
      ]
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
  methods: {
    handleSelect(index) {
      this.activeMenu = index;
    },
    async getProjectSetting() {
      try {
        const { data } = await getDetail({ id: this.$route.query.id });
        this.project = data;
      } catch (err) {
        return err;
      }
    }
  }
};
</script>

<style>
.u-card-title {
  font-size: 20px;
  font-weight: bold;

  &:before {
    content: " ";
    position: relative;
    top: 3px;
    display: inline-block;
    background-color: black;
    height: 20px;
    width: 5px;
    margin-right: 8px;
  }
}

.m-textarea {
  .el-textarea__inner {
    min-height: 500px;
  }
}
</style>
<style scoped>
.container {
  display: flex;
}
.left-menu {
  width: 180px;
  margin-right: 20px;
}
.el-menu {
  border: 1px solid rgb(229, 209, 209);
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, .12), 0px 0px 6px 0px rgba(0, 0, 0, .04);
}
.el-menu-item {
  border-bottom: 1px solid #e1e4e8;
  height: 38px;
  line-height: 38px;
}
.el-menu-item:last-child {
  border-bottom: 0;
}
.main {
  flex: 1;
}
</style>

