<template>
  <div class="container">
    <div class="left-menu">
      <el-menu :default-active="activeMenu" @select="handleSelect">
        <el-menu-item index="page">页面管理</el-menu-item>
        <el-menu-item index="tpl">模板管理</el-menu-item>
        <el-menu-item index="key">key管理</el-menu-item>
        <el-menu-item index="member">成员管理</el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <page-card :projectId="projectId" v-if="activeMenu == 'page'"></page-card>
      <tpl-card :projectId="projectId" v-if="activeMenu == 'tpl'"></tpl-card>
      <key-card :projectId="projectId" v-if="activeMenu == 'key'"></key-card>
    </div>
  </div>
</template>

<script>
import PageCard from './components/pages.vue';
import TplCard from './components/tpls.vue';
import KeyCard from './components/keys.vue';

export default {
  data() {
    return {
      activeMenu: 'page'
    };
  },
  components: {
    PageCard,
    TplCard,
    KeyCard
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

