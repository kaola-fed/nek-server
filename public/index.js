import restate from 'regular-state';
import { Component } from 'nek-ui';
import App from './modules/app';
import Home from './modules/home';
import Detail from './modules/detail';
import Setting from './modules/setting';

const stateman = restate({ Component });

stateman
  .state('app', App, '')
  .state('app.home', Home, '')
  .state('app.detail', Detail, 'detail')
  .state('app.setting', Setting, 'setting')
  .on('notfound', () => {
    this.go('app.home', { replace: true });
  })
  .start({ html5: false, root: '/', prefix: '!' });
