<template>
  <div class="g-components">
      <ul class="g-lib">
        <li class="u-lib-header">{{ library.name }} ({{ library.version }})</li>
        <li v-for="component in library.components" :key="component.name" class="u-item"
            draggable="true" @dragstart="handleDragStart($event, library.name, component.tag)">
          {{ component.name }}
        </li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'ComponentBar',
  props: {
    library: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
    };
  },
  methods: {
    handleDragStart(event, libName, tagName) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('libName', libName);
      event.dataTransfer.setData('tagName', tagName);
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
  transition: 500ms;
  color: white;
  white-space: nowrap;

  .g-lib {
    list-style: none;
    margin: 0;
    padding: 0;

    .u-lib-header {
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
}
</style>
