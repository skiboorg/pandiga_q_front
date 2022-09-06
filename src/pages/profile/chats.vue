<template>
  <q-page style="margin-bottom: 50px" class="container">
    <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Сообщения" icon="chat"   />
      </q-breadcrumbs>
    </div>

    <div class="row q-col-gutter-lg">
      <div  class="gt-xs col-sm-3 ">
        <q-toolbar class="bg-primary text-white ">
        <q-toolbar-title >Контакты</q-toolbar-title>
      </q-toolbar>
        <q-list bordered>
          <div v-for="chat in chats" :key="chat.id">
            <q-item  @click="openChat(chat.id)"
                     v-if="chat.starter.id === $auth.user.id"
                     class="q-my-sm"
                     :class="[current_chat_id===chat.id?'bg-grey-4':'']"
                     clickable
                     v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="chat.opponent.avatar">
                   <q-badge v-if="chat.opponent.is_online" floating color="positive" style="height: 10px;border-radius: 50%; width: 5px" icon="lens">

                   </q-badge>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ chat.opponent.fullname }}</q-item-label>
                <q-item-label caption lines="1">{{chat.last_message}}</q-item-label>
              </q-item-section>
<!--              <q-item-section side>-->
<!--                <q-icon name="chat_bubble" :color="chat.opponent.is_online? 'positive':'grey-1'" />-->
<!--              </q-item-section>-->
            </q-item>
            <q-item @click="openChat(chat.id,)" v-else class="q-my-sm" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="chat.starter.avatar">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ chat.starter.fullname }}</q-item-label>
                <q-item-label caption lines="1">{{chat.last_message}}</q-item-label>
              </q-item-section>
              <q-item-section side>

                <q-icon size="10px" name="fiber_manual_record" :color="chat.opponent.is_online? 'positive':'grey-1'" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>

      </div>
      <div v-if="current_chat_id===0" class="lt-sm col-12 ">
        <q-toolbar class="bg-primary text-white ">
          <q-toolbar-title >Контакты</q-toolbar-title>
        </q-toolbar>
        <q-list bordered>
          <div v-for="chat in chats" :key="chat.id">
            <q-item  @click="openChat(chat.id)"
                     v-if="chat.starter.id === $auth.user.id"
                     class="q-my-sm"
                     :class="[current_chat_id===chat.id?'bg-grey-4':'']"
                     clickable
                     v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="chat.opponent.avatar">
                  <q-badge v-if="chat.opponent.is_online" floating color="positive" style="height: 10px;border-radius: 50%; width: 5px" icon="lens">
                  </q-badge>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ chat.opponent.fullname }}</q-item-label>
                <q-item-label caption lines="1">{{chat.last_message}}</q-item-label>
              </q-item-section>
              <!--              <q-item-section side>-->
              <!--                <q-icon name="chat_bubble" :color="chat.opponent.is_online? 'positive':'grey-1'" />-->
              <!--              </q-item-section>-->
            </q-item>
            <q-item @click="openChat(chat.id,)" v-else class="q-my-sm" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="chat.starter.avatar">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ chat.starter.fullname }}</q-item-label>
                <q-item-label caption lines="1">{{chat.last_message}}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chat_bubble" :color="chat.opponent.is_online? 'positive':'grey-1'" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>

      </div>

      <div v-if="current_chat_id>0" class="col-12 col-sm-9 relative-position " style="height: 85vh">
        <q-card flat bordered class="relative-position">
          <q-toolbar  class="bg-primary text-white ">
            <q-toolbar-title >
              {{chats.find(x=>x.id===current_chat_id).starter.id === $auth.user.id
              ? chats.find(x=>x.id===current_chat_id).opponent.fullname
              : chats.find(x=>x.id===current_chat_id).starter.fullname}}
            </q-toolbar-title>
            <q-btn class="lt-sm" label="Назад" @click="current_chat_id=0" outline no-caps/>

          </q-toolbar>
          <q-card-section>
            <q-scroll-area
              :thumb-style="thumbStyle"

              ref="messages" style="height: 65vh">

              <q-chat-message
                class="message"
                v-for="message in chat_messages"
                :key="message.id"
                :name="message.user.fullname"
                :avatar="message.user.avatar"
                :sent="message.user.id !== $auth.user.id"
                :text="[message.message]"
                :stamp="message.createdAt | formatDate"
                :bg-color="message.user.id === $auth.user.id ? 'grey-2' : 'red-2'"

              >
                <q-card class="bg-primary text-white q-pa-sm" v-if="message.isRentMessage">
                  <p v-if="message.rentType">{{message.rentDate}} c {{message.rentTime}} хочу арендовать {{message.rentUnit.name}} на {{message.rentHours}} час.</p>
                  <p v-else>С {{message.rentDate}} на {{message.rentDays}} сут. хочу арендовать {{message.rentUnit.name}} </p>
                </q-card>

              </q-chat-message>

            </q-scroll-area>

          </q-card-section>
          <q-card-section>
            <div>
              <q-input dense  outlined bottom-slots v-model="new_msg"    >
                <template v-slot:before>
                  <q-avatar size="40px">
                    <img :src="$auth.user.avatar">
                  </q-avatar>
                </template>
                <template v-slot:after>
                  <q-btn :disabled="!new_msg" :loading="loading" @click="sendMgs" color="primary" round  flat icon="lar la-paper-plane" >
                    <template v-slot:loading>
                      <q-spinner-comment class="on-left" />
                    </template>
                  </q-btn>


                </template>
              </q-input>
            </div>
          </q-card-section>

        </q-card>

      </div>

      <div v-else class="col-12 col-sm-9 " >
        <q-card style="height: 80vh" flat bordered class="flex column items-center justify-center">
          Выберите чат
        </q-card>

      </div>

<!--      <div class="col-2 gt-md">-->
<!--        <ProfileMenu/>-->
<!--      </div>-->

    </div>
 </q-no-ssr>
  </q-page>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import {date} from "quasar";
import ProfileMenu from "components/user_profile_menu";
export default {
  name: 'catalog',
  components:{
    ProfileMenu
  },


  data () {
    return {
      thumbStyle: {
        right: '-5px',
        borderRadius: '5px',
        backgroundColor: '#8d8d8d',
        width: '2px',
        opacity: 0.5
      },
      loading:false,
      chats:[],
      new_msg:null,
      get_chat_interval:'',
      position: 100000,
      current_chat_id:0,
      baseUrl:process.env.IMG_URL,
      chat_messages:[],
      socket:null

    }
  },
  async created() {
    await this.page_init()
  },
  beforeDestroy() {
    console.log('destroy')
    try{
      this.socket.close()
    }catch (e) {
      console.log('not connected')
    }
  },
  methods:{
    ...mapActions('auth',['fetchUserNotifications']),
    async page_init(){
      const  response = await this.$api.get(`/api/v1/chat/all/`)
      this.chats = response.data
      //this.chats.length>0 ? this.openChat(this.chats[0].id) : null


    },
    async openChat(chat_id){
      try{
        this.socket.close()
      }catch (e) {
        console.log('not connected')
      }

      this.socket = new WebSocket(`${process.env.WS}/ws/chat/${chat_id}`)
      const opened_chat = await this.$api.get(`/api/v1/chat/get_chat?chat_id=${chat_id}`)
      if (this.$auth.user.id === opened_chat.data.opponent.id ){
        await this.$api.post(`/api/v1/chat/set_chat_read/${chat_id}`)
        await this.fetchUserNotifications(this.$auth.user.id)
      }
      const response = await this.$api.get(`/api/v1/chat/get_chat_messages?chat_id=${chat_id}`)
      if (response.status === 200){
        this.chat_messages = response.data
        this.current_chat_id = chat_id
        //await this.$api.post(`/api/v1/chat/set_chat_read/${chat_id}`)
        await  this.page_init()
        this.$refs.messages.setScrollPosition(this.position, 3000)
      }else{
        console.log('chat error')
      }

      this.socket.onmessage = (res) =>{
        //this.page_init()
        console.log('message in chat',JSON.parse(res.data))
        let data = JSON.parse(res.data)['message']
        console.log('data.user.id',data.user.id)
        console.log('get chats')
        if(data.chat === this.current_chat_id){
          this.new_msg = null
          this.loading = false
          this.chat_messages.push({
            createdAt: Date.now(),
            message: data.message,
            isUnread: this.$auth.user.id !== opened_chat.data.opponent.id,
            user:{
              id: data.user.id,
              fullname:data.user.fullname,
              avatar:this.baseUrl+data.user.avatar
            }
          })
          try {
            this.$refs.messages.setScrollPosition(this.position, 30000)
          }catch (e){
          }

        }

      }
    },

    async sendMgs(){
      this.loading = true
      await  this.$api.post(`/api/v1/chat/add/${this.current_chat_id}`,{message:this.new_msg})


    }

  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD.MM.YYYY, HH:mm')
    },
  }
}
</script>
<style lang="sass" >
.message
  & .q-message-stamp
    opacity: .4
    font-size: 10px !important

</style>
