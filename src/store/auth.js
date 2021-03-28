import { LocalStorage } from 'quasar'
import { api } from 'boot/axios'

import { Notify } from 'quasar'

const state = () => ({
  user:{
    city:{}
  },
  units:[],
  favorite:[],
  feedbacks:[],
  notifications:[],
  messages_count:[],
  notifications_count:[],
  loggedIn:false,
  socket:null

})

const mutations = {
 updateUser(state,data){
    state.user = data
  },
  updateUserStatus(state,data){
    state.loggedIn = data
  },
  updateUserUnits(state,data){
    state.units = data
  },
  updateUserFavorite(state,data){
    state.favorite = data
  },
  updateUserFeedbacks(state,data){
      state.feedbacks = data
    },
  updateUserNotifications(state,data){
      state.notifications = data
    },
  updateUserNotificationsCount(state,data){
      state.notifications_count = data
    },
  updateUserMessagesCount(state,data){
      state.messages_count = data
    },
  updateSocket(state,data){
      state.socket = data
    },

}

const actions = {
  async fetchUserUnits({commit},user_id){
    const response = await api.get(`/api/v1/technique/user/units?user_id=${user_id}`)
    commit('updateUserUnits',response.data)
  },
  async fetchUserFavorite({commit},user_id){
    const response = await api.get(`/api/v1/user/fav_get/`)
    commit('updateUserFavorite',response.data)
  },
  async fetchUserFeedbacks({commit},user_id){
    const response = await api.get(`/api/v1/user/get_user_feedback?user_id=${user_id}`)
    commit('updateUserFeedbacks',response.data)
  },
  async fetchUserNotifications({commit},user_id){
    const response_all = await api.get(`/api/v1/notification/get/`)
    const response_other = await api.get(`/api/v1/notification/get_other_count/`)
    const response_messages = await api.get(`/api/v1/notification/get_messages_count/`)
    commit('updateUserNotifications',response_all.data)
    commit('updateUserNotificationsCount',response_other.data['new_messages'])
    commit('updateUserMessagesCount',response_messages.data['new_messages'])
  },
  connectWS({commit,dispatch},id) {
    console.log('connecting WS')
     const socket = new WebSocket(process.env.WS+'/ws/user/online/')
     commit('updateSocket',socket)
       socket.onopen = () => {
        console.log('ws connected')
        socket.send(JSON.stringify({'user_id':id,'message':'user online'}))
        socket.onmessage = (res) =>{
          dispatch('fetchUserNotifications',id)
          console.log('message',JSON.parse(res.data))
          let data = JSON.parse(res.data)
          console.log('cur path',this.$router.currentRoute.path)
          if (data.event==='chat' && this.$router.currentRoute.path!=='/profile/chats'){
             Notify.create({
              message: data.message,
              color: 'primary',
                icon: 'chat',
               progress: true,
               position:'top-right',
               classes: 'glossy',
               actions: [
                { label: 'Открыть', color: 'primary', handler: () => { this.$router.push('/profile/chats') } }
              ]
            })
          }
          if(data.event==='order'){
            Notify.create({
              message: data.message,
              color: 'primary',
                icon: 'chat',
               progress: true,
               position:'top-right',
               classes: 'glossy',
               actions: [
                { label: 'Открыть', color: 'primary', handler: () => { this.$router.push('/profile/chats') } }
              ]
            })
          }
        }
      }
  },

  loginUser({dispatch},data){
    api.post('/auth/token/login/',data)
      .then(response=>{
        LocalStorage.set('auth_token',response.data.auth_token)
        api.defaults.headers.common['Authorization'] = 'Token ' + response.data.auth_token
        dispatch('getUser',true)
      })
      .catch(function (error) {
          Notify.create(
            {
              message: 'Неверный пароль',
              position:'top-right',
              color: 'red'
            }
          )
      })

  },
  async getUser ({commit,dispatch},redirect,connect_ws){
    console.log('getting user')

   const response = await api.get( '/api/v1/user/me/')
    console.log('getUser', response.data)
    commit('updateUser', response.data)
    commit('updateUserStatus', true)
    dispatch('fetchUserUnits',response.data.id)
    dispatch('fetchUserFeedbacks',response.data.id)
    dispatch('fetchUserFavorite',response.data.id)
    dispatch('fetchUserNotifications',response.data.id)
    if (redirect){
      dispatch('connectWS',response.data.id)
      this.$router.push('/')
    }

  },
  logoutUser({commit}){
    api.post( '/auth/token/logout/')
      .then(response=>{
        console.log('logoutUser', response)
        api.defaults.headers.common['Authorization'] = null
        LocalStorage.remove('auth_token')
        commit('updateUser', {})
        commit('updateUserStatus', false)
      })
      .catch(function (error) {
      })
  }
}

export const getters = {
  isLoggedIn: (state) => state.loggedIn,
  user: (state) => state.user,
  units: (state) => state.units,
  favorite: (state) => state.favorite,
  feedbacks: (state) => state.feedbacks,
  notifications: (state) => state.notifications,
  notifications_count: (state) => state.notifications_count,
  messages_count: (state) => state.messages_count,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
