<template>
  <div>
    <template v-for="menu in menus">
      <el-submenu :index="menu.key" :key="menu.key" v-if="menu.icon == 'folder'">
        <template slot="title"><i class="iconfont-folder"></i> {{ menu.name }} </template>
          <folder :menus="menu.items"></folder>
      </el-submenu>
      <el-menu-item :index="menu.key" :key="menu.key" v-else>
        <i :class="[menu.icon == 'js' ? 'iconfont-js' : 'iconfont-html']"></i>
        {{ menu.name }}
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'folder',
  props: ['menus'],
  data() {
    return {};
  }
};
</script>

<style>

</style>
