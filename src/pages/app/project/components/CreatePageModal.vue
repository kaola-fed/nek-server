<template>
  <el-dialog title="新建页面" :visible="visible">
    <el-form>
      <el-form-item label="页面URL">
        <el-input></el-input>
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
    return {};
  },
  methods: {}
};
</script>

<style scoped>
</style>
