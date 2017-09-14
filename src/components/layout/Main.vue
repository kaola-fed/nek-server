<template>
  <section class="main">
    <router-view></router-view>
    <p class="main__foot">（╯‵□′）╯︵┴─┴</p>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
@b main {
  position: absolute;
  left: 0;
  top: 60px;
  right: 0;
  bottom: 0;
  background: #EAEDF3;
  padding: 10px 13px;
  overflow:auto;

  @e foot {
    margin-top: 4px;
    color: #9FA6AF;
    text-align: center;
  }
}
</style>
