<template>
  <header class="header">
    <div class="header-title">
      <el-badge value="Alpha">
        <div class="header-title__logo"></div>
      </el-badge>
      <router-link :to="{name: 'dashboard'}" class="header-title__link"></router-link>
    </div>
    <div class="header-right">
      hi&nbsp;<a class="header-right__link">{{ userInfo.fullname }}</a>&nbsp;<a class="header-right__link" @click="logout">退出</a>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      userInfo: state => (state.userInfo || {})
    })
  },
  methods: {
    ...mapActions(['logout'])
  }
};
</script>

<style scoped>
@b header {
  height: 60px;
  padding: 13px 30px;
  background: #3C3F41;
}

@b header-title {
  position: relative;
  display: flex;
  float: left;
  height: 34px;
  align-items: center;
  font-size: 18px;
  color: #fff;

  @e logo {
    content: '';
    display: inline-block;
    width: 210px;
    height: 26px;
    mask-image: url(//haitao.nos.netease.com/57a406f8c4c74e7cac07d0f8e925713d.svg);
    mask-repeat: no-repeat;
    background: white no-repeat;
    vertical-align: middle;
  }

  @e link {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    text-decoration: none;
  }
}

@b header-right {
  float: right;
  height: 34px;
  line-height: 34px;
  color: #fff;

  @e link {
    color: #fff;
  &:hover {
     color: #fff;
   }
  }
}
</style>
