<template>
  <el-dialog title="新建页面" :visible="visible">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="页面URL" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="页面模板">
        <el-radio-group v-model="form.type">
          <el-radio-button :label="1">列表页</el-radio-button>
          <el-radio-button :label="2">空白页</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="ok">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createPage } from '@/api/project';

export default {
  name: 'CreatePageModal',
  props: {
    visible: Boolean,
    projectId: String
  },
  data() {
    return {
      form: {
        url: '',
        name: '',
        type: 1
      },
      rules: {
        url: [{
          required: true, trigger: 'blur', message: '请输入页面url'
        }]
      }
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
    },
    ok() {
      this.$refs.form.validate(async (valid) => {
        if(valid) {
          try {
            await createPage({ ...this.form, projectId: this.projectId });
            this.close();
            this.$emit('refresh');
          } catch (err) {
            return;
          }
        }
      });
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
</style>
