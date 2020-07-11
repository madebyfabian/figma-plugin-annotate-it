import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

// @ts-ignore
import Home from './views/Main.view.vue'

// @ts-ignore
import About from './views/About.view.vue'

// @ts-ignore
import Test from './views/Test.view.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },

  {
    path: '/about',
    name: 'About',
    component: About
  },

  // {
  //   path: '/',
  //   name: 'Test',
  //   component: Test
  // }
]

const router = new VueRouter({
  routes
})

export default router
