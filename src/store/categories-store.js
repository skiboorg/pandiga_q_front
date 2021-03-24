import { api } from 'boot/axios'
const state = () => ({
  items:[]

})

const mutations = {
  updateItems(state,data){
    state.items = data
  }

}

const actions = {
  async fetchCategories({commit}){
    try{
      const categories_data = await api.get('/api/v1/technique/categories/')
      commit('updateItems',categories_data.data)
    } catch (e) {
      throw e
    }
  }
}

export const getters = {
  categories: (state) => state.items
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
