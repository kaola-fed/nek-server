import Vue from 'vue';
import 'highlight.js/styles/atom-one-dark.css';
import Hljs from 'highlight.js';

Vue.directive('highlight', {
  componentUpdated: function(el) {
    setTimeout(() => {
      Hljs.highlightBlock(el);
    }, 10);
  },
});
