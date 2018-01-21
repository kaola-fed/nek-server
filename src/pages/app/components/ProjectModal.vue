<template>
  <el-dialog :title="!id ? '创建项目' : '编辑项目'" :visible.sync="visible" :before-close="handleBeforeClose" @open="handleOpen">
    <el-form :model="form" :rules="rules" ref="form" label-width="110px">
      <el-row>
        <el-col :span="24">
          <h3>基础设置</h3>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目描述" prop="desc">
            <el-input v-model="form.desc"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Git URL" prop="git">
            <el-input v-model="form.git"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="type">
            <el-select v-model="form.type">
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组件库" prop="library">
            <el-select v-model="form.library">
              <el-option v-for="item in libraries" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <h3 class="m-other-setting" @click="moreConfig = !moreConfig">
            其他设置
            <small>
              <i v-if="moreConfig" class="el-icon-arrow-down"></i>
              <i v-else class="el-icon-arrow-right"></i>
            </small>
          </h3>
        </el-col>
        <template v-if="moreConfig">
          <el-col :span="12">
            <el-form-item label="BaseComponent" prop="basePath">
              <el-input v-model="form.basePath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ListComponent" prop="listPath">
              <el-input v-model="form.listPath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="BaseModal" prop="modalPath">
              <el-input v-model="form.modalPath"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Util path" prop="utilPath">
              <el-input v-model="form.utilPath"></el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="ok">确定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { create, update, getDetail } from '@/api/project';
import { getLibraries } from '@/api/library';
import { ProjectTypes } from '@/../utils/enums';
export default {
  name: 'ProjectModal',
  props: {
    id: String,
    visible: Boolean
  },
  data() {
    const required = (message, trigger = 'blur') => ({ required: true, trigger, message: `请输入${message}`});
    return {
      form: {
        name: '',
        desc: '',
        git: '',
        type: 1,
        library: '',
        basePath: 'pro/widget/BaseComponent',
        listPath: 'pro/components/ListComponent',
        modalPath: 'pro/components/modal/modal',
        utilPath: 'pro/base/util'
      },
      rules: {
        name: required('项目名称'),
        git: required('Git 地址'),
        library: required('组件库', 'change'),
        basePath: required('BaseComponent'),
        listPath: required('ListComponent'),
        modalPath: required('BaseModal'),
        utilPath: required('Util path')
      },
      types: [
        {id: ProjectTypes.NEJ, name: 'nej老项目'},
        {id: ProjectTypes.Webpack, name: 'webpack单页'}
      ],
      libraries: [],
      moreConfig: false
    };
  },
  methods: {
    async handleOpen() {
      try {
        const { data } = await getLibraries();
        this.libraries = data;
      } catch (err) {
        return;
      }
      if(this.id) {
        try {
          const { data } = await getDetail({ id: this.id });
          this.form = data || {};
        } catch (err) {
          return;
        }
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
            this.handleBeforeClose();
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
  .m-other-setting {
    display: inline-block;
    cursor: pointer;
    user-select: none;
  }
</style>
