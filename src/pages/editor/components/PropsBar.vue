<template>
  <div class="g-props-bar">
    <div class="u-placeholder" v-if="attributes.length === 0">这里什么都没有 _(:з」∠)_</div>
    <el-row v-else>
      <el-col v-for="attr in attributes" :key="attr.name" :span="24" class="f-mb15">
        <div class="u-label">{{ attr.name }}</div>
        <div>
          <el-input v-if="attr.type === 'number'" v-model.number="attr.value" @change="debounceInputChange(attr)"></el-input>
          <el-checkbox v-else-if="attr.type === 'boolean'" @changed="onBoolChange(attr)" v-model="attr.value"></el-checkbox>
          <el-input v-else v-model="attr.value" @change="debounceInputChange(attr)"></el-input>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import debounce from 'throttle-debounce/debounce';

export default {
  name: 'PropsBar',
  props: {
    attributes: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  created() {
    this.debounceInputChange = debounce(600, value => this.update(value));
  },
  data() {
    return {};
  },
  methods: {
    onBoolChange(attr) {
      this.update(attr);
    },

    // 统一event的格式后再激活事件
    update(event) {
      this.$emit('change', event);
    }
  }
};
</script>

<style scoped>
.g-props-bar {
  white-space: nowrap;
  background-color: #313335;
  color: white;
  padding: 10px;

  .u-placeholder {
    text-align: center;
    padding: 10px;
    color: gray;
  }

  .u-label {
    overflow: hidden;
  }
}
</style>
