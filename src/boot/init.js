import { LocalStorage } from 'quasar'

const token = LocalStorage.getItem('auth_token')

export default async ({ app, router, Vue, store ,ssrContext}) => {

  console.info('boot: init entered')
  if (token) {
   await store.dispatch('auth/getUser',false,true)
   store.dispatch('auth/connectWS',store.state.auth.user.id)
  }

  Vue.prototype.$auth = store.state.auth


}
