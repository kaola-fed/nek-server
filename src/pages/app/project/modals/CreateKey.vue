<template>
  <el-dialog title="新建NEI key" :visible.sync="visible" @open="handleOpen" :before-close="handleBeforeClose" size="tiny">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" label-position="right">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="name" label="名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="key" label="key">
            <el-input v-model="form.key"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="ok">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { createKey, updateKey, getKeyDetail } from '@/api/key';
export default {
  name: 'CreateKeyModal',
  props: {
    visible: Boolean,
    keyId: String,
    projectId: String
  },
  data() {
    const required = message => [{ required: true, trigger: 'blur', message: `请输入${message}` }];
    return {
      form: {
        name: '',
        key: ''
      },
      rules: {
        name: required('名称'),
        key: required('key')
      }
    };
  },
  methods: {
    handleOpen() {
      this.initForm();
    },
    async initForm() {
      if (!this.keyId) {
        return;
      }
      try {
        const { data } = await getKeyDetail({ id: this.keyId });
        this.form = data;
      } catch (err) {
        return;
      }
    },
    ok() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const Api = this.keyId ? updateKey : createKey;
          try {
            await Api({ ...this.form, projectId: this.projectId, id: this.keyId });
            this.close();
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

<style>

</style>
