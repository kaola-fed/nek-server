<template>
  <el-dialog :title="!id ? '创建组件库' : '编辑组件库'" :visible.sync="visible" :before-close="handleBeforeClose" @open="handleOpen">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="组件库名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="组件库描述" prop="desc">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="组件库版本" prop="version">
        <el-input v-model="form.version"></el-input>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="ok">确定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { addLibrary, editLibrary, getDetail } from '@/api/library';
export default {
  name: 'LibraryModal',
  props: {
    id: String,
    visible: Boolean
  },
  data() {
    const required = message => ({ required: true, trigger: 'blur', message: `请输入${message}`});
    return {
      form: {
        name: '',
        desc: '',
        version: '',
      },
      rules: {
        name: required('组件库名称'),
        version: required('组件库版本')
      }
    };
  },
  methods: {
    async handleOpen() {
      if(!this.id) {
        return;
      }
      try {
        const { data } = await getDetail({ id: this.id });
        this.form = data || {};
      } catch (err) {
        return;
      }
    },
    ok() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const Api = this.id ? editLibrary : addLibrary;
            await Api({
              id: this.id,
              ...this.form
            });
            this.$emit('close');
            this.$emit('refresh');
          } catch (err) {
            return;
          }
        }
      });
    },
    handleBeforeClose() {
      this.$emit('update:visible', false);
      this.$emit('close');
      this.$refs.form.resetFields();
    },
    close() {
      this.handleBeforeClose();
    }
  }
};
</script>

<style scoped>
</style>
