<template>
  <div class="g-tools-bar">
    <div class="m-tools">
      <a @click="handleBack" class="u-back" href="javascript:;">
        <i class="el-icon-arrow-left"></i>&nbsp;&nbsp;{{ projectName }}
      </a>
      <el-tooltip content="保存" effect="light" placement="bottom">
        <a class="m-button" id="saveBtn"><i class="iconfont-save" @click="onSave"></i></a>
      </el-tooltip>
      <!-- <el-tooltip content="预览" effect="light" placement="bottom">
        <a class="m-button" @click="onPreviewClick"><i class="iconfont-start"></i></a>
      </el-tooltip> -->
      <!-- 自定义按钮 -->
      <el-tooltip v-for="(item, index) in buttons" :key="`toolBtn_${item.tip}_${index}`"
                  :content="item.tip" effect="light" placement="bottom">
        <a class="m-button" @click="item.onClick"><i :class="item.icon"></i></a>
      </el-tooltip>
    </div>
    <div class="u-tools-title">{{ pageName }}</div>
    <span class="u-tools-message">{{ message }}</span>
  </div>
</template>

<script>
import _ from '@/widget/util';

export default {
  name: 'ToolsBar',
  props: {
    projectName: String,
    buttons: {
      type: Array,
      default: () => []
    },
    pageName: String,
    message: String,
    backLink: {
      type: String,
      default: 'dashboard'
    }
  },
  data() {
    return {};
  },
  methods: {
    onPreviewClick() {
      _.requestFullScreen();
    },
    onSave() {
      this.$emit('save');
    },
    handleBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped>
.g-tools-bar {
  width: 100%;
  height: 50px;
  background-color: #3C3F41;
  transition: 500ms;
  z-index: 3;
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;

  padding: 0 30px;

  .u-back {
    color: white;
    font-size: 16px;
    margin-right: 10px;
  }

  .u-back:hover {
    text-decoration: none;
  }

  .m-tools {
    flex: 1;
    .m-button {
      color: white;
      width: 30px;
      height: 30px;
      font-size: 14px;
      margin: 10px;
      text-align: center;
      text-decoration: none;
    }
  }
  .u-tools-title {
    flex: 1;
    display: flex;
    justify-content: center;
    color: white;
    font-size: 16px;
  }
  .u-tools-message {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    color: white;
    font-size: 14px;
  }
}

:fullscreen {
  .g-tools-bar {
    height: 0;
    overflow: hidden;
  }
}
</style>
