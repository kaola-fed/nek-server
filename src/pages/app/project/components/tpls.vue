<template>
  <el-card>
    <div slot="header">
      <span class="u-card-title">项目模板</span>
    </div>
    <el-tabs class="f-mt10" v-model="currentTab">
      <el-tab-pane label="entry" name="entry">
        <el-input type="textarea" class="m-textarea f-mb10" v-model="project.entry" placeholder="请输入entry模板"></el-input>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleSave('entry')">保存</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="ftl" name="ftl">
        <el-input type="textarea" class="m-textarea f-mb10" v-model="project.ftl" placeholder="请输入ftl模板"></el-input>
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="handleSave('ftl')">保存</el-button>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import { updateTpl } from '@/api/project';

export default {
  props: {
    project: Object
  },
  data() {
    return {
      currentTab: 'entry'
    };
  },
  methods: {
    async handleSave(type) {
      try {
        await updateTpl({ id: this.project._id, type, tpl: this.project[type] });
        this.$message.success('保存成功！');
      } catch (err) {
        return;
      }
    }
  }
};
</script>
