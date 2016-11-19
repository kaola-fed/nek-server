import { Component } from 'nek-ui';
import template from '!raw!./index.html';

const PageList = Component.extend({
    name: 'page.list',
    template,
    config() {
        this.defaults({
            pageList: [],
        });
        this.supr();
    }
});

export default PageList;
