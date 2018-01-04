<template>
  <el-dialog title="代码预览" :visible.sync="visible" @open="handleOpen" :before-close="handleBeforeClose">

  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data() {
    return {};
  },
  methods: {
    handleOpen() {
      console.log('open');
    },
    handleBeforeClose() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style>

</style>


