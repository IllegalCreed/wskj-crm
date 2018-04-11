// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import 'es6-promise/auto'
import store from './store'

Vue.use(iView)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requiredAuth)) {
    if (localStorage.getItem("token")) {
      
    } else {
      next({
        path: '/login'
      })
    }
  }
  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
