<template>
  <q-page style="margin-bottom: 50px" class="container">
      <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Мои предложения" icon="list"   />
      </q-breadcrumbs>
    </div>

    <div class="row">
     <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
         <div v-if="orders_accepted.length>0">
               <h3 class="text-bold text-h4">Принятые</h3>
            <OrderCard
          :order="order"
          :fullInfo="false"
          @refresh="page_init"
          :is_own="true"
            :is_apply="true"
          v-for="order in orders_accepted"
          :key="order.id"/>
         </div>
          <div v-if="orders.length>0">
               <h3 class="text-bold text-h4">Все</h3>
            <OrderCard
          :order="order"
          :fullInfo="false"
          @refresh="page_init"
          :is_own="true"
          :is_apply="true"

          v-for="order in orders"
          :key="order.id"/>
         </div>
      </div>
      <div class="col-3 offset-1 gt-md">
        <ProfileMenu/>
      </div>
    </div>
      </q-no-ssr>
  </q-page>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import OrderCard from "components/order-card";
import ProfileMenu from "components/user_profile_menu";
export default {
  name: 'catalog',
  components:{
    OrderCard,
    ProfileMenu
  },



  data () {
    return {
      total_pages:0,
      orders:[],
      orders_accepted:[],
    }
  },
  async beforeMount() {
    await this.page_init()
  },
  methods:{
    async page_init(){
      const response_orders = await this.$api.get(`/api/v1/order/get_user_orders_applyed/`)
        const response_orders_accepted = await this.$api.get(`/api/v1/order/get_user_orders_accepted/`)
        this.total_pages = response_orders.data.page_count -1
        this.orders = response_orders.data.results
        this.orders_accepted = response_orders_accepted.data.results
    },

}
}
</script>
<style lang="sass" scoped>

</style>
