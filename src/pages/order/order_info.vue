<template>
  <q-page class="container">
    <div  class="q-gutter-sm q-my-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Главная" icon="las la-home" to="/" />
      <q-breadcrumbs-el label="Заявки на технику" icon="las la-list" :to="{name:'all_orders'}" />
      <q-breadcrumbs-el :label="`Заявка №${order.id} - ${order.name}`"   />
    </q-breadcrumbs>
    </div>
    <div class="q-mt-xl">
      <h1 class="text-h5 text-bold">{{order.name}}</h1>
      <OrderCard :order="order" :fullInfo="true"/>
    </div>



    <h3  class="text-h5 text-bold">Какую технику предложить</h3>
    <div class="grid grid-3 gap-md q-pb-md">
      <q-card  v-if="unit.type.id === order.type.id && order.city.id === unit.city_id"
               v-for="unit in user_units"
               :key="unit.id"
               class="my-card bg-grey-2"
               flat
      >


      <q-card-section>
        <q-img
          :ratio="16/9"
          :src="unit.images[0].image"
        />
<!--        <div class="text-overline text-primary q-mb-sm">{{unit.type.name}}</div>-->
        <div class="text-h5 q-mt-sm q-mb-xs text-primary">{{unit.name}}</div>
        <div class="text-caption text-grey">
          <p v-if="unit.rent_type !== null" class="q-mb-none">{{unit.rent_price}} руб./ <span v-if="unit.rent_type"> час</span> <span v-if="!unit.rent_type"> день</span> </p>
          <p v-else class="q-mb-none">{{unit.rent_price}} руб/км </p>
        </div>
      </q-card-section>

      <q-card-actions>
        <div v-if="!order.decline_units.includes(unit.id)" class="full-width">
          <q-btn v-if="!order.apply_units.includes(unit.id)" class="full-width" unelevated no-caps color="primary" @click="applyUnit(unit.id)" label="Предложить" />
          <q-btn v-else color="primary" no-caps outline class="full-width" disable label="Техника уже предложена" />
        </div>
        <div v-else>
          <p class="q-mb-none text-primary text-center">Заказчик отказал</p>
        </div>
      </q-card-actions>


    </q-card>
    </div>



  </q-page>
</template>

<script>

import OrderCard from "components/order-card";
import {mapGetters} from "vuex";


export default {
  name: 'order-info',
  components:{
    OrderCard

  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    return store.dispatch('order/fetchOrder', currentRoute.params.order_slug)
  },
  data () {
    return {
      //order:{ "id": 29, "owner": {}, "name": "", "name_slug": "", "comment": "", "rent_type": true, "rentDate": "", "rentDays": 1, "rentTime": "", "rentHours": 1, "created_at": "2021-05-18T11:57:32.019814+03:00", "filter": [], "filter_value": [], "type": { "id": 9, "name": "Автовышка", "name_lower": "автовышка", "name_slug": "ekskavatoryi", "orders_count": 4 }, "worker": null, "worker_unit": null, "apply_units": [], "views": 0, "update_at": "2021-05-18T11:57:32.019891+03:00", "is_finished": false, "coords": "[55, 55]", "city": { "id": 1, "city": "Москва", "cityAlias": null, "region": "Москва и Московская обл.", "coefficient": "1.00", "sub_domain": null, "is_default": false }, "decline_units": [] } ,
      user_units:[],
      offer_units:0,
      coords:[],
      is_city_selected:false

    }
  },
  mounted() {
     this.page_init()
  },
  computed:{
    ...mapGetters('order',['order'])
  },
  methods:{
    async page_init(){
      //const  response_order= await this.$api.get(`/api/v1/order/get_order/${this.$route.params.order_slug}`)
      const  user_units_temp = await this.$api.get(`/api/v1/technique/user/units?user_id=${this.$auth.user.id}`)
      this.user_units = user_units_temp.data
      //this.order = response_order.data
      if (this.order.coords.length >0) {
        this.coords = this.order.coords.replace('[', '').replace(']', '').split(',')
      }
    },
    showMap(){
      this.is_city_selected = true
    },
    async applyUnit(u_id){
      const respond = await this.$api.post('/api/v1/order/apply/',{order_id:this.order.id,unit_id:u_id})
      console.log(respond)
      this.$router.push({name:'all_orders'})
    }
  }

}
</script>
<style lang="sass" scoped>

</style>
