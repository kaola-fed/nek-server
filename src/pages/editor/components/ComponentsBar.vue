<template>
  <div class="g-components" :style="{width: `${width}px`}">
    <div class="g-wrapper">
      <ul v-for="lib in libraries" :key="lib.name" class="g-lib">
        <li class="u-header">{{ lib.name }} ({{ lib.version }})</li>
        <li v-for="component in lib.components" :key="component.name" class="u-item"
            draggable="true" @dragstart="handleDragStart($event, component)">
          {{ component.name }}
        </li>
      </ul>
    </div>
    <div class="u-toggle-btn" @click="width = width ? 0 : 250">
      <i :class="`el-icon-arrow-${width ? 'left' : 'right'}`"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentBar',
  props: {
    libraries: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      width: 250
    };
  },
  methods: {
    handleDragStart(event, component) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', component.name);
      this.$emit('dragStart', event);
    }
  }
};
</script>

<style scoped>
.g-components {
  height: 100%;
  background-color: #313335;
  position: relative;
  transition: 300ms;

  .g-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .g-lib {
    list-style: none;
    margin: 0;
    padding: 0;
    color: white;

    .u-header {
      font-size: 14px;
      padding: 10px 20px;
      background-color: #2b2b2b;
    }

    .u-item {
      font-size: 12px;
      padding: 5px 30px;
      border-bottom: 1px solid #4b4b4b;
      cursor: pointer;
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
  }
}
</style>
