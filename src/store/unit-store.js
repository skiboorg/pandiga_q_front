import { api } from 'boot/axios'

const state = () => ({
  item:null

})

const mutations = {
  updateItem(state,data){
    state.item = data
  }

}

const actions = {
  async fetchItem({commit},unit_slug){
    // const delay = ms => new Promise(res => setTimeout(res, ms));
    // await delay(5000);
    try{
      console.log('try fetchItem')
      const categories_data = await api.get(`/api/v1/technique/unit/${unit_slug}`)
      commit('updateItem',categories_data.data)
      console.log('result fetchItem',categories_data.data)
    } catch (e) {
      throw e
    }
  },
  async clearItem({commit}){
    await  commit('updateItem',null)
  }
}

export const getters = {
  unit: (state) => state.item
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
