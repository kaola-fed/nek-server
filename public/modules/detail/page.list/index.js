import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import categoryList from '../../../categoryList';

const PageList = Component.extend({
    name: 'page.list',
    template,
    config() {
        this.defaults({
            
        });
        this.supr();
    }
});

export default PageList;
