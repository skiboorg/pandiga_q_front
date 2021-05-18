import { api } from 'boot/axios'

const state = () => ({
  order:{}

})

const mutations = {
  updateOrder(state,data){
    state.order = data
  }

}

const actions = {
  async fetchOrder({commit},order_slug){
    // const delay = ms => new Promise(res => setTimeout(res, ms));
    // await delay(5000);
    try{
      console.log('try fetchOrder')
      // const order_data = await api.get(`/api/v1/order/get_order/${order_slug}`)
      const order_data = await api.get(`/api/v1/order/get_order?order_slug=${order_slug}`)
      commit('updateOrder',order_data.data)

    } catch (e) {
      throw e
    }
  },
  async clearOrder({commit}){
    await  commit('updateOrder',null)
  }
}

export const getters = {
  order: (state) => state.order
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
