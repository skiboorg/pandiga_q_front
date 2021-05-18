import Vue from 'vue'
import Vuex from 'vuex'

import componentState from './component-state-store'
import auth from './auth'
import categories from './categories-store'
import unit from './unit-store'
import order from './orders-store'
Vue.use(Vuex)

let store = null
export default function ({store}/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      componentState,
      auth,
      categories,
      unit,
      order
    },
    strict: process.env.DEBUGGING
  })
  store = Store
  return Store
}
