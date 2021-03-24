<template>
  <q-page style="margin-bottom: 50px" class="container">
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Мои заявки на технику" icon="list"   />
      </q-breadcrumbs>
    </div>
    <h1 class="text-h4 text-bold">Мои заявки на технику</h1>
    <div class="row">
      <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
         <OrderCard
          :order="order"
          :fullInfo="false"
          @refresh="page_init"
          :is_own="true"
          :is_apply="false"
          v-for="order in orders"
          :key="order.id"/>
      </div>
     <div class="col-3 offset-1 gt-md">
        <ProfileMenu/>
      </div>
    </div>

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
      orders:[],
      total_pages:0,
      current_page:1,
    }
  },
  async beforeMount() {
    await this.page_init()
  },
  methods:{
    async page_init(){
      const response = await this.$api.get(`/api/v1/order/get_user_orders/`)
      this.total_pages = response.data.page_count
      this.orders = response.data.results
    },

  }

}
</script>
<style lang="sass" scoped>

</style>
