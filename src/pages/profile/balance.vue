<template>
  <q-page style="margin-bottom: 50px" class="container">
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Пополнение счета" icon="account_balance_wallet"   />
      </q-breadcrumbs>
    </div>
    <h3 class="text-bold text-h4">Выберите способ оплаты</h3>
    <div class="row">
      <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">


        <div class="flex column justify-start items-start">
           <q-radio name="shape" class="q-mb-md" v-model="payment.pay_type" v-for="type in payment_types" :key="type.id" :val="type.method"  >
          <q-card style="width: 200px" class="q-pa-sm flex column justify-center items-center">
             <img style="width: 100px;height: 50px;object-fit: contain" :src="type.icon" >
          <p class="q-mb-none">{{type.name}}</p>
          </q-card>
        </q-radio>
        </div>
 <h3 class="text-bold text-h4">Сумма платежа</h3>
        <q-input
      v-model.number="payment.amount"
      type="number"
      class="q-mb-lg"
      filled
      style="max-width: 250px"/>
        <q-btn
          :disabled="!payment.amount || !payment.pay_type"
          color="primary"
          :loading="loading"
          @click="sendPayment"
          style="width: 250px"
          label="Оплатить">
          <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
      </template>
        </q-btn>
          <h3 class="text-bold text-h4">История платежей</h3>
        <q-card >
          <q-card-section horizontal v-for="payment in payments" :key="payment.id">
            <q-card-section class="col-3">{{payment.created_at | formatDate}}</q-card-section>
            <q-card-section class="col-6">{{payment.amount}} руб ({{payment.type.name}})</q-card-section>
            <q-card-section class="col-3">
              <q-badge v-if="payment.is_payed" color="positive">Оплачено</q-badge>
              <q-badge v-else color="зкшьфкн">Ожидание оплаты</q-badge>
            </q-card-section>
            <q-separator/>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3 offset-1 gt-md">
        <ProfileMenu/>
      </div>
    </div>

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
      shape:false,
      loading:false,
      payment:{
        amount:100,
        pay_type:'bank_card',
      },
      payment_types:[],
      payments:[]
    }
  },
  async created() {
    await this.page_init()
  },
  async mounted() {
      if(this.$route.query['pay_id']){
        console.log(this.$route.query['pay_id'])
        await this.$api.post(`/api/v1/user/check_payment/`,{pay_id:this.$route.query['pay_id']})
        this.page_init()

      }
    },
  methods:{

    async page_init(){
      const  response_payment_types = await this.$api.get(`/api/v1/user/all_payment_types/`)
      const  response_payments = await this.$api.get(`/api/v1/user/all_payments?user_id=${this.$auth.user.id}`)
      this.payment_types = response_payment_types.data
      this.payments = response_payments.data
    },
    async sendPayment(){
         this.loading=true
         const response = await this.$api.post(`/api/v1/user/new_payment/`,this.payment)
         console.log(response)
         if (response.status === 200){
           window.location.href = response.data
         }
       },



  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD/MM/YYYY, HH:mm')
    },
    formatOnlyDate(val){
      return date.formatDate(val, 'DD/MM/YYYY')
    },
    formatTime(val){
      return val.split(':').splice(0,2).join(':')
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
