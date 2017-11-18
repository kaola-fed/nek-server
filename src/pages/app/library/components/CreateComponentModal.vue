<template>
  <el-dialog title="新建组件" :visible="visible" @open="handleOpen">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-row :gutter="40">
        <el-col :span="8">
          <el-form-item label="组件名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="组件tag" prop="tag">
            <el-input v-model="form.tag"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="isLayout" prop="isLayout">
            <el-switch v-model="form.isLayout" on-text="" off-text=""></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="bodyClass" prop="bodyClass">
            <el-input v-model="form.bodyClass"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="事件" prop="events">
            <el-input v-model="form.events"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <p>attributes</p>
      <el-row :gutter="40" v-for="(item, index) in form.attributes" :key="index">
        <el-col :span="7">
          <el-form-item label="name">
            <el-input v-model="item.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="type">
            <el-select v-model="item.type">
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="default">
            <el-input v-model="item.default"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item label-width="0">
            <a href="javascript:;" @click="onDeleteClick(index)"><i class="el-icon-close"></i></a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="addAttribute">添加</el-button>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="ok">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addComponent, editComponent, getComponentDetail } from '@/api/library';

export default {
  name: 'CreatePageModal',
  props: {
    visible: Boolean,
    libraryId: String,
    componentId: String
  },
  data() {
    const required = message => ({required: true, trigger: 'blur', message: `请输入${message}`});
    return {
      form: {
        name: '',
        tag: '',
        isLayout: false,
        bodyClass: '',
        events: '',
        attributes: [{ name: '', type: 'string', default: ''}]
      },
      rules: {
        name: required('组件名'),
        tag: required('组件tag')
      },
      types: [{
        value: 'string',
        name: 'string'
      }, {
        value: 'number',
        name: 'number'
      }, {
        value: 'boolean',
        name: 'boolean'
      }, {
        value: 'array',
        name: 'array'
      }, {
        value: 'object',
        name: 'object'
      }]
    };
  },
  methods: {
    addAttribute() {
      this.form.attributes.push({
        name: '',
        type: 'string',
        default: ''
      });
    },
    onDeleteClick(index) {
      this.form.attributes.splice(index, 1);
    },
    ok() {
      this.$refs.form.validate(async (valid) => {
        if(valid) {
          try {
            const Api = this.componentId ? editComponent : addComponent;
            const bodyClass = this.form.bodyClass.split(',').map(item => item.trim());
            const events = this.form.events.split(',').map(item => item.trim());
            await Api({ ...this.form, library: this.libraryId, id: this.componentId, events, bodyClass });
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
      this.form.attributes = [{ name: '', type: 'string', default: ''}];
    },
    async handleOpen() {
      if(!this.componentId) {
        return;
      }
      try {
        const { data } = await getComponentDetail({ id: this.componentId });
        data.events = data.events.join(',');
        data.bodyClass = data.bodyClass.join(',');
        this.form = data;
      } catch (err) {
        return;
      }
    }
  }
};
</script>

<style scoped>
</style>
