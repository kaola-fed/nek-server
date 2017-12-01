<template>
  <el-dialog title="新建页面" :visible="visible" @open="handleOpen">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="页面URL" prop="url">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="页面名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="页面nei" prop="key">
        <el-select v-model="form.key" placeholder="请选择">
          <el-option v-for="item in keyOptions" :key="item._id" :label="item.name" :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="页面模板">
        <el-radio-group v-model="form.type" :disabled="!!pageId">
          <el-radio-button :label="pageTypes.List">列表页</el-radio-button>
          <el-radio-button :label="pageTypes.Empty">空白页</el-radio-button>
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
import { createPage, updatePageSetting, getPageDetail } from '@/api/page';
import { getKeyList } from '@/api/key';
import { PageTypes } from '@/../utils/enums';
export default {
  name: 'CreatePageModal',
  props: {
    visible: Boolean,
    projectId: String,
    pageId: String
  },
  data() {
    return {
      pageTypes: PageTypes,
      form: {
        url: '',
        name: '',
        key: '',
        type: PageTypes.List
      },
      rules: {
        url: [{
          required: true, trigger: 'blur', message: '请输入页面url'
        }],
        key: [{
          required: true, trigger: 'change', message: '请选择nei key'
        }]
      },
      keyOptions: []
    };
  },
  methods: {
    handleOpen() {
      this.initOptions();
      this.initForm();
    },
    async initOptions() {
      try {
        const { data } = await getKeyList({ projectId: this.projectId });
        this.keyOptions = data;
      } catch (err) {
        return;
      }
    },
    async initForm() {
      if (!this.pageId) {
        return;
      }
      try {
        const { data } = await getPageDetail({ id: this.pageId });
        this.form = data;
        this.form.key = data.key._id;
      } catch (err) {
        return;
      }
    },
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
          const Api = this.pageId ? updatePageSetting : createPage;
          try {
            await Api({ ...this.form, projectId: this.projectId, id: this.pageId });
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
      this.$refs.form.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
