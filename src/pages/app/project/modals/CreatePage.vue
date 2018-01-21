<template>
  <div>
    <el-dialog title="新建页面" :visible.sync="visible" @open="handleOpen" :before-close="handleBeforeClose">
      <el-form :model="form" :rules="rules" ref="form" label-position="right" label-width="100px">
        <el-row>
          <div class="session-title">基础配置</div>
          <el-col :span="8">
            <el-form-item label="页面URL" prop="url">
              <el-input v-model="form.url"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="页面名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="页面NEI" prop="key">
              <el-select v-model="form.key" placeholder="请选择">
                <el-option v-for="item in keyOptions" :key="item._id" :label="item.name" :value="item._id"></el-option>
              </el-select>
              <el-button type="text" @click="createKeyVisible = true" class="f-ml10">新增NEI key</el-button>
            </el-form-item>
          </el-col>
          <div class="session-title">页面模板</div>
          <el-col :span="24">
            <div class="templates">
              <div class="tpl-item tpl-list" :class="{active: form.type === pageTypes.List}" @click="onTemplateClick(pageTypes.List)">
                列表页
              </div>
              <div class="tpl-item tpl-blank" :class="{active: form.type === pageTypes.Empty}" @click="onTemplateClick(pageTypes.Empty)">
                空白页
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </el-dialog>
    <create-key-modal :projectId="projectId" :visible.sync="createKeyVisible" :modal="false"
                      @refresh="getNEIKeys" @close="createKeyVisible = false">
    </create-key-modal>
  </div>
</template>

<script>
import { createPage, updatePageSetting, getPageDetail } from '@/api/page';
import { getKeyList } from '@/api/key';
import { PageTypes } from '@/../utils/enums';

import CreateKeyModal from './CreateKey.vue';

export default {
  name: 'CreatePageModal',
  components: {
    CreateKeyModal
  },
  props: {
    visible: Boolean,
    projectId: String,
    pageId: String
  },
  data() {
    return {
      createKeyVisible: false,
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
          required: true, trigger: 'change', message: '请选择NEI key'
        }]
      },
      keyOptions: []
    };
  },
  methods: {
    handleOpen() {
      this.getNEIKeys();
      this.initForm();
    },
    async getNEIKeys() {
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
    onTemplateClick(type) {
      this.form.type = type;
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
  .session-title {
    font-weight: bold;
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
    padding-bottom: 5px;
  }

  .templates {
    .tpl-item {
      display: inline-block;
      width: 150px;
      height: 150px;
      color: #EAE9EE;
      background-color: #EAE9EE;
      padding: 5px;
      margin: 5px 10px;
      cursor: pointer;
      transition: 0.3s;
      text-align: center;

      &:hover {
        color: #878D99;
      }
      &.active {
        color: #878D99;
        background-color: #878D99;
      }

      &:before {
        content: " ";
        display: block;
        width: 140px;
        height: 140px;
        margin-bottom: 5px;
      }
    }

    .tpl-list {
      &:before {
        background-image: url(//haitao.nos.netease.com/a07fe5b1799d49d3a0fc51634ef1398c.svg);
      }

      &:hover:before, &.active:before {
        background-image: url(//haitao.nos.netease.com/3ea1215e95404be29a0647f627d17bea.svg);
      }
    }

    .tpl-blank {
      &:before {
        background-image: url(//haitao.nos.netease.com/3451d50f49f44490a7faf1ea42e07302.svg);
      }

      &:hover:before, &.active:before {
        background-image: url(//haitao.nos.netease.com/1d6700ac6aee462bacabf80f4818812c.svg);
      }
    }
  }
</style>
