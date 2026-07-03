import Vue from 'vue'
import Vuex from 'vuex'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Vuex)

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
<<<<<<< HEAD
    const store = new Vuex.Store({
      modules: {
        hello: {
          state: { hello: 'Welcome to Your Vue.js App' },
          actions: { hello: () => {} },
          mutations: {}
=======
    const hello = jest.fn()
    const store = new Vuex.Store({
      modules: {
        hello: {
          state: {
            hello: 'Welcome to Your Vue.js App'
          },
          actions: {
            hello
          }
>>>>>>> origin/master
        }
      }
    })
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor({ store }).$mount()
<<<<<<< HEAD
=======

>>>>>>> origin/master
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
    expect(hello).toHaveBeenCalled()
  })
})
