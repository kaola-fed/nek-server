<template lang="html">
    <div class="g-bd">
        <div class="g-lsb">
            <ul>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-input')" @dragend="dragEnd">kl-input</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-card')">kl-card</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-button')">kl-button</a>
              </li>
            </ul>
        </div>
        <div class="g-main" @dragenter="drageEnter" @dragover.prevent="" @dragleave="dragLeave" @drop="drop" ref="preview">

        </div>
        <div class="g-rsb">
            <ul>
              <li>
                <button @click="refresh('kl-card')">kl-card</button>
              </li>
              <li>
                <button @click="refresh('kl-button')">kl-button</button>
              </li>
              <li>
                <button @click="refresh('kl-input')">kl-input</button>
              </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {install} from 'nek-ui';
import Regular from 'regularjs';


const BaseComponent = Regular.extend({}).directive('r-tag', (elem, value) => {
  console.log('r-tag', elem, value);
  debugger;
});
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
    dragStart(event, type) {
      event.dataTransfer.dropEffect = 'move';
      event.dataTransfer.setData('text/plain', type);
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
      const path = event.path;
      const componentsName = event.dataTransfer.getData('text');
      let flag = false;
      for(let i = 0; i < path.length; i++) {
        if(path[i].className && path[i].className.indexOf('r-tag') > -1) {
          this.refresh(componentsName, path[i]);
          flag = true;
          break;
        }
      }
      if(!flag) {
        this.refresh(componentsName);
      }
    },
    render(tpl, node = preview) {
      // while(node.firstChild) {
      //   node.removeChild(node.firstChild);
      // }
      const RootComponent = new BaseComponent({
        template: tpl
      });
      RootComponent.$inject(node);
    },
    refresh(flag, node) {
      let tpl = '';
      switch(flag) {
        case 'kl-input':
          tpl = '<kl-input placeholder="请输入" ref="root-input" class="root-input r-tag" r-tag="root-input" />';
          break;
        case 'kl-button':
          tpl = '<kl-button title="哈哈" ref="root-button" class="root-button r-tag" r-tag="root-button" />';
          break;
        case 'kl-card':
          tpl = '<kl-card title="用户信息" ref="root-card" class="root-card r-tag" r-tag="root-card"></kl-card>';
          break;
        default:
          tpl = '<kl-card title="用户信息" ref="root-card" class="root-card r-tag" r-tag="root-card"></kl-card>';
          break;
      }
      this.render(tpl, node);
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
    overflow: auto;
}
.g-main {
    position: absolute;
    display: inline-block;
    left: 120px;
    right: 120px;
    width: calc(100vw - 240px);
    height: calc(100vh - 60px);
    overflow: auto;
}
.g-rsb {
    position: absolute;
    right: 0;
    display: inline-block;
    width: 120px;
    height: calc(100vh - 60px);
    border-left: 1px solid #ccc;
    overflow: auto;
}
</style>
