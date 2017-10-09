<template>
  <div>
    <h1>项目详情</h1>
    <el-button @click="onCreateClick">新建页面</el-button>
    <p>这里是目录</p>
    <create-page-modal :visible="createPageVisible"></create-page-modal>
  </div>
</template>

<script>
import CreatePageModal from './components/CreatePageModal.vue';

export default {
  components: {
    CreatePageModal
  },
  data() {
    return {
      createPageVisible: false
    };
  },
  methods: {
    onCreateClick() {
      this.createPageVisible = true;
    }
  }
};
</script>

<style scoped>
</style>
