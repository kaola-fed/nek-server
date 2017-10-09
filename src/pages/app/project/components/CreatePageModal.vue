<template>
  <el-dialog title="新建页面" :visible="visible">
    <el-form>
      <el-form-item label="页面URL">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="页面模板">
        <el-button @click="onListClick">列表页</el-button>
        <el-button @click="onBlankClick">空白页</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'CreatePageModal',
  props: {
    visible: Boolean
  },
  data() {
    return {
      url: ''
    };
  },
  methods: {
    onListClick() {
      if (!this.checkURL(this.url)) {
        return;
      }

      this.$router.push({
        name: 'listTemplate',
        params: {
          url: this.url
        }
      });
    },
    onBlankClick() {
      if (!this.checkURL(this.url)) {
        return;
      }

      this.$router.push({
        name: 'editor',
        params: {
          url: this.url
        }
      });
    },

    // 检查格式
    checkURL(url) {
      console.log(url);
      return true;
    }
  }
};
</script>

<style scoped>
</style>
