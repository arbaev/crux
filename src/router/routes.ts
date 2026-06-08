import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'builder', component: () => import('pages/BuilderPage.vue') },
      { path: 'routes', name: 'routes', component: () => import('pages/RoutesPage.vue') },
      { path: 'view', name: 'view', component: () => import('pages/ViewRoutePage.vue') },
      { path: 'about', name: 'about', component: () => import('pages/AboutPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
