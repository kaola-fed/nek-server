<template>
  <header class="header">
    <div class="header-title">NEK Server<a href="/app" class="header-title__link"></a></div>
    <div class="header-right">
      hi&nbsp;<a class="header-right__link">User</a>&nbsp;<a class="header-right__link">退出</a>
    </div>
  </header>
</template>

<script>
export default {
  methods: {}
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

&:before {
   content: '';
   display: inline-block;
   width: 34px;
   height: 34px;
   margin-right: 9px;
   background-image: url(//haitao.nos.netease.com/2fecfadc7d48464b90c2fe9b5d92412a.svg);
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
