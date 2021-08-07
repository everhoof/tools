import Vue from 'vue';
import Router from 'vue-router';

import Empty from '~/pages/empty.vue';
import Preview from '~/pages/preview.vue';

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        name: 'home',
        component: Empty,
      },
      {
        path: '/preview',
        name: 'preview',
        component: Preview,
      },
      {
        path: '*',
        redirect: '/',
      },
    ],
  });
}
