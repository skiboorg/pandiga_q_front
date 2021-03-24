<template>
  <q-header class="bg-white q-py-lg" elevated>
    <div class="container">
      <div class="flex items-center justify-between">
        <div class="logo">
          <router-link to="/">
            <img  src="~assets/logo.svg"/>

            <p v-if="$auth.loggedIn && $auth.user.is_customer" class="logo-text text-caption ">Заказчик</p>
            <p v-if="$auth.loggedIn && !$auth.user.is_customer" class="logo-text text-caption">Исполнитель</p>
          </router-link>
        </div>
        <div v-if="!$auth.loggedIn" class="flex items-center justify-between">
          <q-btn color="primary" to="/catalog" class="q-mr-sm" icon="local_shipping" label="Каталог техники"/>
          <q-btn  color="primary" to="/login" class="q-mr-sm" outline label="Войти"/>
          <q-btn  color="primary" to="/register" outline label="Зарегистрироваться"/>
        </div>
        <div v-else class="flex items-center justify-between">
          <q-btn color="primary" to="/catalog" class="q-mr-sm" icon="local_shipping" label="Каталог техники"/>
          <q-btn v-if="$auth.loggedIn && !$auth.user.is_customer" color="primary" :to="{name:'all_orders'}" class="q-mr-sm" outline label="Заявки на технику"/>
          <q-btn v-if="$auth.loggedIn && !$auth.user.is_customer" color="primary" :to="{name:'add_unit'}" class="q-mr-sm" outline label="Добавить технику"/>
          <q-btn v-if="$auth.loggedIn && $auth.user.is_customer" color="primary" icon="add" :to="{name:'new_order'}" class="q-mr-sm" outline label="Заявка на технику"/>
          <q-btn :to="{name:'profile_favorite'}" v-if="$auth.user.is_customer" color="primary" flat round icon="favorite">
            <q-tooltip>
              Избранное
            </q-tooltip>
          </q-btn>
          <q-btn :to="{name:'profile_chats'}" color="primary" flat round icon="chat">
            <q-tooltip>
              Чат
            </q-tooltip>
          </q-btn>
          <q-btn color="primary" :to="{name:'profile_notifications'}" flat round icon="notifications">
            <q-tooltip>
              Оповещения
            </q-tooltip>
          </q-btn>

          <q-btn color="primary" icon="person" flat round @mouseenter="is_menu_show=!is_menu_show">
            <q-menu @mouseleave="is_menu_show=!is_menu_show" auto-close v-model="is_menu_show">
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list   class="rounded-borders text-primary">

                    <q-item clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_index'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
                      <q-item-section>Профиль</q-item-section>
                    </q-item>
                    <q-item clickable dense v-ripple :active="link === 'inbox'"  :to="{name:'profile_notifications'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="notifications_active" /></q-item-section>
                      <q-item-section>Оповещения</q-item-section>
                    </q-item>
                    <q-item clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_chats'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="chat" /></q-item-section>
                      <q-item-section>Сообщения</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_favorite'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="favorite" /></q-item-section>
                      <q-item-section>Избранное</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_orders'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="list" /></q-item-section>
                      <q-item-section>Заявки</q-item-section>
                    </q-item>
                    <q-item v-else clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_applies'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="view_list" /></q-item-section>
                      <q-item-section>Мои предложения</q-item-section>
                    </q-item>
                    <q-item clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_refferal'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="people_alt" /></q-item-section>
                      <q-item-section>Партнеры</q-item-section>
                    </q-item>
                    <q-item clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_balance'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="local_atm" /></q-item-section>
                      <q-item-section>Баланс</q-item-section>
                    </q-item>


                  </q-list>
                </div>

                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <q-avatar size="72px">
                    <img :src="$auth.user.avatar">
                  </q-avatar>


                  <div style="width: 100px" class="ellipsis text-center q-my-sm">
                    {{$auth.user.first_name}} {{$auth.user.last_name}}
                  </div>
                  <p class="text-caption flex items-center justify-center">
                    <q-icon class="q-mr-sm" color="primary" name="account_balance_wallet"/>  {{$auth.user.balance}} &#8381;
                  </p>


                  <q-btn
                    color="primary"
                    label="Выход"
                    push
                    @click="logoutUser"
                    size="sm"
                    v-close-popup
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>

        </div>






      </div>

    </div>
  </q-header>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'

export default {

  data () {
    return {
      is_menu_show:false,
      link:'',
      socket:null,
      ws_connect:false,
    }
  },
  updated() {
    // if(this.isLoggedIn && !this.ws_connect){
    //   this.connectWS()
    // }
  },
  methods:{
    ...mapActions('auth',['logoutUser']),
    connectWS(){
      this.ws_connect = true
      this.socket = new WebSocket(process.env.WS+'/ws/user/online/')

      this.socket.onopen = () => {
        console.log('ws users connected')
        this.socket.send(JSON.stringify({'user_id':this.$auth.user.id,'message':'user online'}))

        this.socket.onmessage = (res) =>{
          console.log('message',JSON.parse(res.data))
          let data = JSON.parse(res.data)
          if (data.event==='chat'){
            this.$q.notify({
              message: data.message,
              position:'top-right',
              color: 'red',
            })
          }
          if(data.event==='order'){
            this.$q.notify({
              message: data.message,
              position:'top-right',
              color: 'red',
            })
          }
        }

      }
    }
  },

  computed:{
    ...mapGetters('auth',['isLoggedIn'])
  }
}
</script>
<style lang="sass">
.logo
  position: relative
  &-text
    margin: 0
    position: absolute
    bottom: -10px
    right: 11px
    color: $grey-10

</style>
