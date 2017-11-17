<template>
  <el-dialog :title="!id ? '创建项目' : '编辑项目'" :visible="visible" @open="handleOpen">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="desc">
        <el-input v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item label="Git URL" prop="git">
        <el-input v-model="form.git"></el-input>
      </el-form-item>
      <el-form-item label="nei key" prop="neiKey">
        <el-input v-model="form.neiKey"></el-input>
      </el-form-item>
      <el-form-item label="项目类型" prop="type">
        <el-select v-model="form.type">
          <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="ok">确定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { create, update, getDetail } from '@/api/project';
export default {
  name: 'ProjectModal',
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
        git: '',
        neiKey: '',
        type: 1
      },
      rules: {
        name: required('项目名称'),
        git: required('Git 地址'),
        neiKey: required('nei key')
      },
      types: [
        {id: 1, name: 'nej老项目'},
        {id: 2, name: 'webpack单页'},
        {id: 3, name: 'webpack多页'}
      ]
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
            const Api = this.id ? update : create;
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
    close() {
      this.$emit('close');
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
