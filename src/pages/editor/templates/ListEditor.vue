<template>
  <div>
    <tools-bar projectName="Project" :buttons="toolsBarButtons"></tools-bar>
  </div>
</template>

<script>
import ToolsBar from '../components/ToolsBar.vue';

export default {
  components: {
    ToolsBar
  },
  data() {
    return {
      toolsBarButtons: [{
        tip: '进入编辑器',
        icon: 'iconfont-edit',
        onClick: () => {
          this.$router.push({ name: 'editor', id: this.$route.query.id });
        }
      }]
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>
