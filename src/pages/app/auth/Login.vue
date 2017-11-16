<template>
  <div class="g-login">
    <div class="m-login-panel">
      <p class="u-title">NEK Server</p>
      <div class="u-login-button" @click.stop="login"><i class="iconfont-start"></i></div>
    </div>
    <canvas id="particles"></canvas>
  </div>
</template>

<script>
import Particles from 'particlesjs';

export default {
  mounted() {
    Particles.init({
      selector: '#particles',
      connectParticles: true,
      color: '#dadada'
    });
  },
  data() {
    return {};
  },
  methods: {
    login() {
      window.location = '/openid';
    }
  }
};
</script>

<style scoped>
.g-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #EAEDF3;

  .m-login-panel {
    position: absolute;
    top: calc(50% - 90px);
    left: calc(50% - 75px);
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 180px;

    .u-title {
      font-size: 28px;
    }

    .u-login-button {
      cursor: pointer;
      color: white;
      background-color: #56c969;
      text-align: center;
      width: 40px;
      height: 40px;
      line-height: 36px;
      border-radius: 20px;
      font-size: 24px;
      transition: 500ms;
      overflow: hidden;
      padding-left: 4px;

      &:hover {
        width: 180px;
      }

      &:hover:after {
        content: 'OpenId 登录';
        font-size: 18px;
        margin-left: 10px;
      }
    }
  }
}
</style>
