<template>
  <div class="g-components">
    <ul v-for="lib in libraries" :key="lib.name" class="g-lib">
      <li class="u-lib-header">{{ lib.name }} ({{ lib.version }})</li>
      <li v-for="component in lib.components" :key="component.name" class="u-item"
          draggable="true" @dragstart="handleDragStart($event, component)">
        {{ component.name }}
      </li>
    </ul>
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
