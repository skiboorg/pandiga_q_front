<template>
  <q-page style="margin-bottom: 50px" class="container">
      <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Оповещения" icon="notifications"   />
      </q-breadcrumbs>
    </div>
     <h3 class="text-h4 text-bold">{{$auth.notifications.length>0 ? 'Оповещения' : 'Оповещений нет'}}</h3>
    <div class="row">

      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 q-pr-lg">
    <div v-if="$auth.notifications.length>0">
       <q-card class="q-mb-md" v-for="notify in $auth.notifications" :key="notify.id">
      <q-card-section horizontal>
        <q-card-section class="col-3 text-caption">{{notify.created_at | formatDate}}</q-card-section>
        <q-card-section class="col-6">{{notify.text}}</q-card-section>
        <q-card-section class="col-4">
          <q-btn color="primary" @click="$router.push(notify.url)" size="sm" class="q-mr-sm"  label="перейти"/>
          <q-btn color="primary" @click="deleteNotify(notify.id)" size="sm" outline label="удалить"/>
        </q-card-section>
      </q-card-section>
    </q-card>
    </div>


      </div>
<!--      <div class="col-3 offset-1 gt-md">-->
<!--        <ProfileMenu/>-->
<!--      </div>-->
    </div>
      </q-no-ssr>
  </q-page>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import ProfileMenu from 'components/user_profile_menu'
import {date} from "quasar";
export default {
  name: 'catalog',
  components:{
    ProfileMenu
  },


  data () {
    return {

    }
  },
  mounted() {
    //this.fetchUserNotifications(this.$auth.user.id)
    this.setRead()
  },
  methods:{
    ...mapActions('auth',['fetchUserNotifications']),
    async deleteNotify(id){
      await this.$api.post('/api/v1/notification/delete/',{id:id})
      await this.fetchUserNotifications(this.$auth.user.id)
    },
    async setRead(){
       const set_read = await this.$api.post('/api/v1/notification/set_read/')
       if (set_read.status === 200){
          await this.fetchUserNotifications(this.$auth.user.id)
       }
    }
  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD.MM.YYYY, HH:mm')
    }
  },
}
</script>
<style lang="sass" scoped>

</style>
