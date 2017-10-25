<template>
  <span v-if="!!nodeId" v-html="`<style>.g-preview [ns-id='${nodeId}'] {box-shadow: 0 0 5px rgba(0, 100, 255, 0.6) !important;}</style>`"></span>
</template>

<script>
export default {
  name: 'highlightCurrent',
  props: {
    nodeId: String
  }
};
</script>

<style scoped>
</style>
