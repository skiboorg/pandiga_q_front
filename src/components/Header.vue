<template>
  <div >
    <q-no-ssr>
    <q-header class="bg-white q-py-lg" bordered>
    <div class="container">
      <div class="flex items-center justify-between">
        <div class="logo">
          <router-link to="/">
            <img  src="~assets/logo.svg"/>
          </router-link>
          <div v-if="$auth.loggedIn && $auth.user.is_customer" class="logo-text text-caption ">Заказчик</div>
          <div v-if="$auth.loggedIn && !$auth.user.is_customer" class="logo-text text-caption">Исполнитель</div>
        </div>

        <div v-if="!this.$auth.loggedIn" class="flex items-center justify-between gt-sm">
<!--          <q-btn color="primary" to="/catalog" class="q-mr-sm" icon="las la-truck" label="Каталог техники"/>-->
          <q-btn  color="primary" to="/login" no-caps class="q-mr-sm" outline label="Войти"/>
          <q-btn  color="primary" to="/register" no-caps outline label="Зарегистрироваться"/>
        </div>
        <div v-else class="flex items-center justify-between gt-sm">
<!--          <q-btn color="primary" to="/catalog" class="q-mr-sm" icon="local_shipping" label="Каталог техники"/>-->
          <q-btn v-if="this.$auth.loggedIn && !this.$auth.user.is_customer" color="primary" :to="{name:'all_orders'}" class="q-mr-sm" no-caps outline label="Заявки на технику"/>
          <q-btn v-if="this.$auth.loggedIn && !this.$auth.user.is_customer" color="primary" :to="{name:'add_unit'}" class="q-mr-sm" no-caps outline label="Добавить технику"/>
          <q-btn v-if="this.$auth.loggedIn && this.$auth.user.is_customer" color="primary" no-caps icon="las la-plus" :to="{name:'new_order'}" class="q-mr-sm" outline label="Заявка на технику"/>
          <q-btn :to="{name:'profile_favorite'}" v-if="this.$auth.user.is_customer" color="primary" flat round icon="las la-heart">
            <q-tooltip>
              Избранное
            </q-tooltip>
             <q-badge v-if="$auth.favorite.length>0" rounded color="dark" floating>{{$auth.favorite.length}}</q-badge>
          </q-btn>
          <q-btn :to="{name:'profile_chats'}" color="primary" flat round icon="lar la-comments">
            <q-tooltip>
              Чат
            </q-tooltip>
            <q-badge v-if="$auth.messages_count>0" rounded color="dark" floating>{{$auth.messages_count}}</q-badge>
          </q-btn>
          <q-btn color="primary" :to="{name:'profile_notifications'}" flat round icon="las la-bell">
            <q-tooltip>
              Оповещения
            </q-tooltip>
             <q-badge v-if="$auth.notifications_count>0" rounded color="dark" floating>{{$auth.notifications_count}}</q-badge>
          </q-btn>
          <q-btn color="primary" icon="lar la-user" flat round @mouseenter="is_menu_show=!is_menu_show">
            <q-menu @mouseleave="is_menu_show=!is_menu_show" auto-close v-model="is_menu_show">
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <q-list   class="rounded-borders text-primary">
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_index'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-id-card" /></q-item-section>
                      <q-item-section>Профиль</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'"  :to="{name:'profile_notifications'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-bell" /></q-item-section>
                      <q-item-section>Оповещения</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_chats'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="lar la-comments" /></q-item-section>
                      <q-item-section>Сообщения</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_favorite'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-heart" /></q-item-section>
                      <q-item-section>Избранное</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_orders'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-list" /></q-item-section>
                      <q-item-section>Заявки</q-item-section>
                    </q-item>
                    <q-item v-else clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_applies'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-list" /></q-item-section>
                      <q-item-section>Мои предложения</q-item-section>
                    </q-item>
<!--                    <q-item clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_refferal'}"  @click="link = 'inbox'" active-class="my-menu-link">-->
<!--                      <q-item-section avatar><q-icon name="people_alt" /></q-item-section>-->
<!--                      <q-item-section>Партнеры</q-item-section>-->
<!--                    </q-item>-->
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_balance'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-wallet" /></q-item-section>
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
                    unelevated

                    no-caps
                    @click="logoutUser"
                    size="sm"
                    v-close-popup
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>

        </div>
         <q-btn class="lt-md" @click="drawer=!drawer" round flat color="primary" icon="menu"/>
      </div>
    </div>

  </q-header>

     <q-drawer v-model="drawer" side="right" overlay  elevated :breakpoint="300"
        >
       <div v-if="!$auth.loggedIn" class="flex column q-pa-sm ">
         <q-btn  color="primary" to="/catalog" class="q-mb-md" icon="local_shipping" label="Каталог техники"/>
          <q-btn  color="primary" to="/login" class="q-mb-md" outline label="Войти"/>
          <q-btn  color="primary" to="/register" class="q-mb-xl" outline label="Зарегистрироваться"/>
       </div>
       <div v-else>

         <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="$auth.user.avatar">
            </q-avatar>
            <div class="text-weight-bold">{{$auth.user.fullname}}</div>
            <div><q-icon class="q-mr-sm" color="white" name="las la-wallet"/>  {{$auth.user.balance}} &#8381;</div>
          </div>
        </q-img>
         <div style="margin-top: 150px">
            <q-list   class="rounded-borders text-primary">
                <q-item clickable  v-ripple :active="link === 'inbox'" to="/catalog"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-truck" /></q-item-section>
                      <q-item-section>Каталог техники</q-item-section>
                    </q-item>
                    <q-item clickable v-if="$auth.loggedIn && !$auth.user.is_customer" v-ripple :active="link === 'inbox'" :to="{name:'all_orders'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-list" /></q-item-section>
                      <q-item-section>Заявки на технику</q-item-section>
                    </q-item>
              <q-item clickable v-if="$auth.loggedIn && !$auth.user.is_customer" v-ripple :active="link === 'inbox'" :to="{name:'add_unit'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-plus" /></q-item-section>
                      <q-item-section>Добавить технику</q-item-section>
                    </q-item>
              <q-item clickable v-if="$auth.loggedIn && $auth.user.is_customer"  v-ripple :active="link === 'inbox'" :to="{name:'new_order'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-plus" /></q-item-section>
                      <q-item-section>Заявка на технику</q-item-section>
                    </q-item>
              <q-separator/>
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_index'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-id-card" /></q-item-section>
                      <q-item-section>Профиль</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'"  :to="{name:'profile_notifications'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-bell" /></q-item-section>
                      <q-item-section>Оповещения</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_chats'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-comments" /></q-item-section>
                      <q-item-section>Сообщения</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_favorite'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-heart" /></q-item-section>
                      <q-item-section>Избранное</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_orders'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-list" /></q-item-section>
                      <q-item-section>Заявки</q-item-section>
                    </q-item>
                    <q-item v-else clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_applies'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-list" /></q-item-section>
                      <q-item-section>Мои предложения</q-item-section>
                    </q-item>
<!--                    <q-item clickable dense v-ripple :active="link === 'inbox'" :to="{name:'profile_refferal'}"  @click="link = 'inbox'" active-class="my-menu-link">-->
<!--                      <q-item-section avatar><q-icon name="people_alt" /></q-item-section>-->
<!--                      <q-item-section>Партнеры</q-item-section>-->
<!--                    </q-item>-->
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_balance'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-wallet" /></q-item-section>
                      <q-item-section>Баланс</q-item-section>
                    </q-item>
              <q-separator/>
              <q-item clickable  v-ripple :active="link === 'inbox'"  @click="logoutUser" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="las la-sign-out-alt" /></q-item-section>
                      <q-item-section>Выход</q-item-section>
                    </q-item>


                  </q-list>
         </div>

       </div>

    </q-drawer>
      </q-no-ssr>
  </div>

</template>

<script>
import {mapActions,mapGetters} from 'vuex'

export default {

  data () {
    return {
      is_menu_show:false,
      drawer: false,
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
