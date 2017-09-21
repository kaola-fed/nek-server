<template>
  <div class="g-tools-bar">
    <router-link :to="{name: 'dashboard'}" class="u-back">
      <i class="el-icon-arrow-left"></i>&nbsp;&nbsp;{{ projectName }}
    </router-link>
    <div class="m-tools">
      <el-tooltip content="设置" effect="light" placement="bottom">
        <a class="m-button"><i class="el-icon-setting"></i></a>
      </el-tooltip>
      <el-tooltip content="保存" effect="light" placement="bottom">
        <a class="m-button"><i class="el-icon-upload"></i></a>
      </el-tooltip>
      <el-tooltip content="随便什么" effect="light" placement="bottom">
        <a class="m-button"><i class="el-icon-more"></i></a>
      </el-tooltip>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ToolsBar',
  props: {
    projectName: String
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.g-tools-bar {
  width: 100%;
  height: 50px;
  background-color: #3C3F41;

  display: flex;
  align-items: center;

  padding: 0 30px;

  .u-back {
    color: white;
    font-size: 16px;
  }

  .u-back:hover {
    text-decoration: none;
  }

  .m-tools {
    margin: 0 30px;

    .m-button {
      color: white;
      width: 30px;
      height: 30px;
      font-size: 14px;
      margin: 10px;
      text-align: center;
    }
  }
}
</style>
