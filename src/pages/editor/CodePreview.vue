<template>
  <div>
    <tools-bar projectName="返回" pageName="代码预览" :show-save="false"></tools-bar>
    <div class="main">
      <el-card>
        <el-tabs v-model="currentTab">
          <el-tab-pane label="aaa">
          </el-tab-pane>
        </el-tabs>
        <div class="m-code-container">
          <pre><code>{{sourcecode}}</code></pre>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import Main from '@/components/layout/Main.vue';
import ToolsBar from './components/ToolsBar.vue';

export default {
  name: 'code-preview',
  components: {
    Main,
    ToolsBar
  },
  props: {
    codes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTab: '',
      sourcecode: 'var code = 1;'
    };
  },
  methods: {}
};
</script>

<style scoped>
  .main {
    margin: 10px;

    .m-code-container {
      height: 800px;
      overflow: auto;
      background: #fafafa;
    }
  }
</style>
