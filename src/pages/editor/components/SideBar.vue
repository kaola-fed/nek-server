<template>
  <div class="g-side-bar" :style="{width: `${width}px`}">
    <div class="g-side-wrapper" :class="{'f-reverse': placement === 'right'}">
      <div class="m-side-tabs">
        <div v-for="(c, index) in tabs" :key="c.name"
             class="u-tab" :class="{'z-active': index === currentTab}" @click="changeTab(c, index)"
        >
          {{ c.label }}
        </div>
      </div>
      <div class="m-body">
        <slot></slot>
      </div>
    </div>
    <div class="u-toggle-btn" @click="toggle" :style="getStyle()">
      <i :class="getToggleIcon()"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    placement: {
      type: String, // left | right
      default: 'left'
    },
    tabs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      currentTab: 0,
      width: 270
    };
  },
  methods: {
    changeTab(tab, index) {
      this.currentTab = index;
      this.$emit('changed', tab);
    },
    toggle() {
      this.width = this.width ? 0 : 250;
    },
    getStyle() {
      const place = '-15px';
      return this.placement === 'left'
        ? { right: place }
        : { left: place };
    },
    getToggleIcon() {
      let icon = '';
      if (this.placement === 'left') {
        icon = this.width ? 'left' : 'right';
      } else {
        icon = this.width ? 'right' : 'left';
      }
      return `el-icon-arrow-${icon}`;
    }
  }
};
</script>

<style scoped>
.g-side-bar {
  height: 100%;
  background-color: #3C3F41;
  position: relative;
  transition: 500ms;
  color: white;

  .g-side-wrapper {
    display: flex;
    height: 100%;
    overflow-x: hidden;

    .m-side-tabs {
      height: 100%;

      .u-tab {
        width: 20px;
        writing-mode: vertical-lr;
        padding: 20px 0;
        cursor: pointer;
        text-align: center;
      }

      .z-active {
        background-color: #313335;
      }
    }

    .m-body {
      flex: 1;
      height: 100%;
      background-color: #313335;
    }
  }

  .u-toggle-btn {
    position: absolute;
    top: 48%;
    right: -15px;
    font-size: 12px;
    color: white;
    text-align: center;
    width: 15px;
    background-color: #4d4d4d;
    padding: 20px 0;
    cursor: pointer;
  }
}

.f-reverse {
  flex-direction: row-reverse;
}

:fullscreen {
  .g-side-bar {
    width: 0 !important;

    .u-toggle-btn {
      display: none;
    }
  }
}
</style>
