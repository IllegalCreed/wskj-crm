import Vue from 'vue'
import Vuex from 'vuex'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Vuex)

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
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
        }
      }
    })
    const Constructor = Vue.extend(HelloWorld)
    const vm = new Constructor({ store }).$mount()

    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
    expect(hello).toHaveBeenCalled()
  })
})
