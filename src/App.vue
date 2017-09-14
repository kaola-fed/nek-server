<template>
  <div id="app">
    <router-view name="header"></router-view>
    <router-view name="main"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
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
