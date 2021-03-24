import { LocalStorage } from 'quasar'

const token = LocalStorage.getItem('auth_token')

export default async ({ app, router, Vue, store }) => {
  console.info('boot: init entered', store)
  if (token) {
    console.log('get user & connect ws')
   await store.dispatch('auth/getUser',false,true)
   store.dispatch('auth/connectWS',store.state.auth.user.id)


  }
  Vue.prototype.$auth = store.state.auth
  console.info('boot: init exited')
}
