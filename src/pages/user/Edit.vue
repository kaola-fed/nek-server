<template lang="html">
    <div class="g-bd">
        <div class="g-lsb">
            <ul>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart" @dragend="dragEnd">kl-input</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true">kl-card</a>
              </li>
              <li>
                <a href="javascript;;" draggable="true">kl-button</a>
              </li>
            </ul>
        </div>
        <div class="g-main" @dragenter="drageEnter" @dragover.prevent="" @dragleave="dragLeave" @drop="drop" ref="preview">

        </div>
        <div class="g-rsb">
            <button @click="refresh(1)">点我</button>
            <button @click="refresh(2)">点我</button>
            <button @click="refresh(3)">点我</button>
        </div>
    </div>
</template>

<script>
import {install} from 'nek-ui';
import Regular from 'regularjs';

const BaseComponent = Regular.extend({});
install(Regular);
let preview = '';
export default {
  data() {
    return {

    };
  },
  mounted() {
    preview = this.$refs.preview;
  },
  methods: {
    dragStart(event) {
      console.log('dragStart', event);
      event.dataTransfer.effectAllowed = 'move';
    },
    dragEnd(event) {
      console.log('dragEnd', event);
    },
    drageEnter(event) {
      console.log('drageEnter', event);
    },
    dragLeave(event) {
      console.log('dragLeave', event);
    },
    drop(event) {
      console.log('drop', event);
    },
    render(tpl) {
      while(preview.firstChild) {
        preview.removeChild(preview.firstChild);
      }
      const RootComponent = new BaseComponent({
        template: tpl,
        config: function() {
          console.log(this.$refs);
        }
      });
      RootComponent.$inject(preview);
    },
    refresh(flag) {
      let tpl = '';
      switch(flag) {
        case 1:
          tpl = '<kl-input placeholder="请输入" ref="input" />';
          break;
        case 2:
          tpl = '<kl-button title="哈哈" ref="button" />';
          break;
        default:
          tpl = '<kl-card title="用户信息" ref="card"></kl-card>';
          break;
      }
      this.render(tpl);
    }
  }
};
</script>

<style scoped>
.g-lsb {
    position: absolute;
    left: 0;
    display: inline-block;
    width: 120px;
    height: calc(100vh - 60px);
    border-right: 1px solid #ccc;
}
.g-main {
    position: absolute;
    display: inline-block;
    left: 120px;
    right: 120px;
    width: calc(100vw - 240px);
    height: calc(100vh - 60px);
}
.g-rsb {
    position: absolute;
    right: 0;
    display: inline-block;
    width: 120px;
    height: calc(100vh - 60px);
    border-left: 1px solid #ccc;
}
</style>
