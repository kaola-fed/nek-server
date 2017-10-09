<template>
  <el-dialog :title="!id ? '创建项目' : '编辑项目'" :visible="visible">
    <el-form>
      <el-form-item label="项目名称">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="Git URL">
        <el-input></el-input>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="ok">确定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProjectModal',
  props: {
    id: String,
    visible: Boolean
  },
  data() {
    return {};
  },
  methods: {
    ok() {
      if (this.id) {
        // create
      } else {
        // edit
      }
      this.$emit('close');
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
</style>
