<template>
  <section class="main">
    <div class="g-container">
      <router-view></router-view>
    </div>
    <p class="main__foot">{{ text }}</p>
  </section>
</template>

<script>
export default {
  mounted() {
    setInterval(() => {
      this.text = this.flag ? '（╯‵□′）╯︵┴─┴' : ' ┬─┬ ノ( \' - \'ノ) ';
      this.flag = !this.flag;
    }, 2000);
  },
  data() {
    return {
      text: '（╯‵□′）╯︵┴─┴',
      flag: false
    };
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

.g-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
