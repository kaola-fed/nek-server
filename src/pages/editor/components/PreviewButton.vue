<template>
  <div class="u-fs-hint" @click="quitPreview"></div>
</template>

<script>
import _ from '@/widget/util';

export default {
  name: 'previewButton',
  data() {
    return {};
  },
  methods: {
    quitPreview() {
      _.exitFullScreen();
    },
  }
};
</script>

<style scoped>
.u-fs-hint {
  display: none;
}
:fullscreen {
  .u-fs-hint {
    display: block;
    position: fixed;
    right: 0;
    bottom: 20px;
    width: 145px;
    text-align: center;

    background-color: rgba(43, 43, 43, 0.6);
    color: white;
    padding: 10px 20px;
    cursor: pointer;

    &:before {
      content: '按下 ESC 退出预览';
    }
    &:hover:before {
      content: '退出预览';
    }
  }
}
</style>
