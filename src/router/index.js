import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/dashboard.vue')
    },
    {
      path: '/create',
      name: 'create',
      component: () => import('@/views/Pages/CreatePlan.vue')
    },
    {
      path: '/show/:id(\\d+)',
      name: 'list',
      component: () => import('@/views/Pages/ViewPlan.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/Pages/NotFound.vue')
    },

    {
      path: '/test-localforage',
      name: 'test-localforage',
      component: () => import('@/views/Pages/TestLocalForge.vue')
    }
  ],
})

export default router
