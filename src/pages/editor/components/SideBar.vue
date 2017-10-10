<template>
  <div class="g-side-bar" :style="sideBarStyle">
    <div class="g-side-wrapper" :style="wrapperStyle">
      <div class="m-side-tabs" v-if="tabs.length">
        <div v-for="(c, index) in tabs" :key="c.name"
             class="u-tab" :class="[{ 'z-active': index === currentTab }, tabClass]" @click="changeTab(c, index)"
        >
          {{ c.label }}
        </div>
      </div>
      <div class="m-body">
        <slot></slot>
      </div>
    </div>
    <div class="u-toggle-btn" @click="toggle" :style="toggleButtonStyle">
      <i :class="getToggleIcon()"></i>
    </div>
  </div>
</template>

<script>
const SIZE = {
  left: 250,
  right: 250,
  bottom: 350
};

export default {
  name: 'SideBar',
  props: {
    placement: {
      type: String, // left | right | bottom
      default: 'left'
    },
    tabs: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    sideBarStyle: function() {
      const size = `${this.size}px`;
      switch (this.placement) {
        case 'left':
        case 'right':
          return { width: size, 'z-index': 2 };
        case 'bottom':
          return { height: size, 'z-index': 1 };
        default:
          return {};
      }
    },
    wrapperStyle: function() {
      switch (this.placement) {
        case 'right':
          return { 'flex-direction': 'row-reverse' };
        case 'bottom':
          return { 'flex-direction': 'column-reverse' };
        default:
          return {};
      }
    },
    toggleButtonStyle: function() {
      const place = '-15px';
      switch (this.placement) {
        case 'left':
          return { right: place };
        case 'right':
          return { left: place };
        case 'bottom':
          return { top: '-37px', left: '48%', transform: 'rotate(90deg)' };
        default:
          return {};
      }
    },
    tabClass: function() {
      switch (this.placement) {
        case 'left':
        case 'right':
          return { 'u-tab-vertical': true };
        case 'bottom':
          return { 'u-tab-horizontal': true };
        default:
          return {};
      }
    }
  },
  data() {
    return {
      currentTab: 0,
      size: SIZE[this.placement]
    };
  },
  methods: {
    changeTab(tab, index) {
      this.currentTab = index;
      this.$emit('changed', tab);
    },
    toggle() {
      this.size = this.size ? 0 : SIZE[this.placement];
    },
    getToggleIcon() {
      let icon = '';
      if (this.placement === 'left') {
        icon = this.size ? 'left' : 'right';
      } else {
        icon = this.size ? 'right' : 'left';
      }
      return `el-icon-arrow-${icon}`;
    }
  }
};
</script>

<style scoped>
.g-side-bar {
  background-color: #3C3F41;
  position: relative;
  transition: 500ms;
  color: white;
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);

  .g-side-wrapper {
    display: flex;
    height: 100%;
    overflow-x: hidden;

    .m-side-tabs {
      .u-tab {
        cursor: pointer;
        text-align: center;
      }

      .u-tab-horizontal {
        display: inline-block;
        height: 20px;
        padding: 0 20px;
      }

      .u-tab-vertical {
        width: 20px;
        writing-mode: vertical-lr;
        padding: 20px 0;
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
    font-size: 12px;
    color: white;
    text-align: center;
    width: 15px;
    background-color: #4d4d4d;
    padding: 20px 0;
    cursor: pointer;
  }
}

:fullscreen {
  .g-side-bar {
    width: 0 !important;
    height: 0 !important;

    .u-toggle-btn {
      display: none;
    }
  }
}
</style>
