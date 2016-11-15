import restate from 'regular-state';
import { Component } from 'nek-ui';
import App from './modules/app';
import Home from './modules/home';
import Detail from './modules/detail';
import Setting from './modules/setting';

const stateman = restate({ Component: Component });

stateman
  .state('app', App, '')
  .state('app.home', Home, '')
  .state('app.detail', Detail, 'detail')
  .state('app.setting', Setting, 'setting')
  .start({ html5: true, root: '/', prefix: '!' });
