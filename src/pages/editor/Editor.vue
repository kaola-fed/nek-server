<template lang="html">
    <div class="g-bd">
        <div class="g-lsb">
            <ul>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-input')">kl-input</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-card')">kl-card</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-button')">kl-button</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-row')">kl-row</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-1')">kl-col-1</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-2')">kl-col-2</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-3')">kl-col-3</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-4')">kl-col-4</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-5')">kl-col-5</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-6')">kl-col-6</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-7')">kl-col-7</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-8')">kl-col-8</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-9')">kl-col-9</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-10')">kl-col-10</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-11')">kl-col-11</a>
              </li>
              <li>
                <a href="javascript:;" draggable="true" @dragstart="dragStart($event, 'kl-col-12')">kl-col-12</a>
              </li>
            </ul>
        </div>
        <div class="g-main" @dragover.prevent="" @drop="drop" ref="preview">

        </div>
        <div class="g-rsb">

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
    drop(event) {
      const path = event.path;
      let componentsName = event.dataTransfer.getData('text');
      let slot = '';
      if(componentsName.indexOf('kl-col') > -1) {
        slot = componentsName.split('-').pop();
        componentsName = 'kl-col';
      }
      let flag = false;
      for(let i = 0; i < path.length; i++) {
        if(path[i].className && path[i].className.indexOf('r-tag') > -1) {
          this.refresh(componentsName, path[i], slot);
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
    refresh(flag, node, slot) {
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
        case 'kl-row':
          tpl = '<kl-row type="flex" gutter="0" class="root-row r-tag"></kl-row>';
          break;
        case 'kl-col':
          tpl = `<kl-col span="${slot}" class="root-col r-tag"></kl-col>`;
          break;
        default:
          tpl = '<kl-row type="flex" gutter="0" class="root-row r-tag"></kl-row>';
          break;
      }
      this.render(tpl, node);
    }
  }
};
</script>

<style>
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
    width: calc(100vw - 260px);
    height: calc(100vh - 80px);
    margin: 10px;
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
.g-row {
  min-height: 50px;
  border: 1px dashed #ddd;
}
.g-col {
  min-height: 45px;
  border: 1px dashed #ddd;
}
</style>
