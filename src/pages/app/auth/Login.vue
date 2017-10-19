<template>
  <div class="g-login">
    <div class="m-login-panel">
      <p class="u-title"><span>N</span>EK <span>S</span>ERVER</p>
      <el-button @click="login" type="info">OpenId 登录</el-button>
    </div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  beforeRouteEnter(to, from, next) {
    if (store.getters.isLogin) {
      next('/app/dashboard');
    } else {
      next();
    }
  },
  data() {
    return {};
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        returnUrl: this.$route.params.returnUrl || '/app/dashboard'
      });
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
    background-color: white;
    text-align: center;
    padding: 20px;
    border-radius: 5px;

    .u-title {
      font-size: 16px;
      font-weight: bold;

      span {
        font-size: 22px;
      }
    }
  }
}
</style>
