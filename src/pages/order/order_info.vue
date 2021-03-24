<template>
  <q-page class="container">
    <div  class="q-gutter-sm q-my-md">
    <q-breadcrumbs>
      <q-breadcrumbs-el label="Главная" icon="home" to="/" />
      <q-breadcrumbs-el label="Заявки на технику" icon="list" :to="{name:'all_orders'}" />
      <q-breadcrumbs-el :label="`Заявка №${order.id} - ${order.name}`"   />
    </q-breadcrumbs>
    </div>
    <div class="q-mt-xl">
      <h1 class="text-h4 text-bold">{{order.name}}</h1>
      <OrderCard :order="order" :fullInfo="true"/>
    </div>

    <h3  class="text-h4 text-bold">Предложите технику</h3>
    <div class="grid grid-3 gap-md">
      <q-card v-if="unit.type.id === order.type.id" v-for="unit in user_units" :key="unit.id" class="my-card" flat bordered>
      <q-img
        :ratio="16/9"
        :src="unit.images[0].image"
      />

      <q-card-section>
<!--        <div class="text-overline text-primary q-mb-sm">{{unit.type.name}}</div>-->
        <div class="text-h5 q-mt-sm q-mb-xs">{{unit.name}}</div>
        <div class="text-caption text-grey">
          <p class="q-mb-none">{{unit.rent_price}} руб./ <span v-if="unit.rent_type"> час</span> <span v-if="!unit.rent_type"> день</span> </p>
        </div>
      </q-card-section>

      <q-card-actions>
        <div v-if="!order.decline_units.includes(unit.id)">
          <q-btn v-if="!order.apply_units.includes(unit.id)" color="primary" @click="applyUnit(unit.id)" label="Предложить" />
          <q-btn v-else color="dark"  label="Техника уже предложена" />
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


export default {
  name: 'order-info',
  components:{
    OrderCard

  },

  data () {
    return {
      order:[],
      user_units:[],
      offer_units:0,
      coords:[],
      is_city_selected:false

    }
  },
  mounted() {
     this.page_init()
  },
  methods:{
    async page_init(){
      const  response_order= await this.$api.get(`/api/v1/order/get_order/${this.$route.params.order_slug}`)
      const  user_units_temp = await this.$api.get(`/api/v1/technique/user/units?user_id=${this.$auth.user.id}`)
      this.user_units = user_units_temp.data
      this.order = response_order.data
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
