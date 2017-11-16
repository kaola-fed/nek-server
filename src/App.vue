<template>
  <div id="app">
    <router-view name="header"></router-view>
    <router-view name="body"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  beforeCreate() {
    this.$store.dispatch('isLogin');
  }
};
</script>

<style>
#app {
  height: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 12px;
  color: #333;
}
</style>
