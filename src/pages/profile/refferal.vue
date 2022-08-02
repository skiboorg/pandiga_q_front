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
     <h3 class="text-bold text-h4">Ваш партнерский баланс: {{$auth.user.partner_balance}}</h3>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

        <div v-if="this.$auth.user.partner_balance>0" class="mb-50">
          <p class="section-sub-header mb-20">Перечислить на основной баланс</p>
          <div class="q-gutter-md row">
            <q-input filled  v-model.number="partner_balance" type="number" ></q-input>
            <q-btn type="primary" :disable="!partner_balance>0 || partner_balance>this.$auth.user.partner_balance" @click="sendMoney" color="primary" label="Перечислить"/>
          </div>
        </div>
        <div v-if="refferals.length>0" class="">
          <h3  class="text-bold text-h4">История начислений</h3>

          <q-card >
          <q-card-section horizontal v-for="refferal in refferals" :key="refferal.id">
            <q-card-section class="col-3">{{refferal.created_at | formatDate}}</q-card-section>
            <q-card-section class="col-6">{{refferal.refferal.fullname}}</q-card-section>
            <q-card-section class="col-3">
              <q-badge  color="positive" :label="`${refferal.earned} руб`"/>
            </q-card-section>
            <q-separator/>
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
import {date} from "quasar";
import ProfileMenu from "components/user_profile_menu";
export default {
  name: 'catalog',
  components:{
    ProfileMenu
  },


  data () {
    return {
      partner_balance:this.$auth.user.partner_balance,
      refferals:[]
    }
  },
  created() {
    this.page_init()
  },
  methods: {
    ...mapActions('auth',['getUser']),
    async page_init(){
      const response = await this.$api.get(`/api/v1/user/get_refferals/`)
      this.refferals = response.data
    },
    async sendMoney(){
      await this.$api.post('/api/v1/user/bonuses_to_money',{amount:this.partner_balance})
      await this.getUser(false)
      this.partner_balance = this.$auth.user.partner_balance
    }

  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD.MM.YYYY, HH:mm')
    },
    formatOnlyDate(val){
      return date.formatDate(val, 'DD.MM.YYYY')
    },
    formatTime(val){
      return val.split(':').splice(0,2).join(':')
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
