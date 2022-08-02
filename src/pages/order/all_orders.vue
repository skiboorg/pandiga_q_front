<template>
  <q-page class="container">
    <q-inner-loading :showing="!orders.length>0">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="las la-home" to="/" />
        <q-breadcrumbs-el label="Заявки на технику" icon="las la-list"  />
      </q-breadcrumbs>
    </div>
    <div class="flex items-center justify-between">

      <h1 ref="top" v-if="cur_type_id === 0" class="text-h4 text-bold">Заявки на технику</h1>
    <h1 ref="top" v-else class="text-h4 text-bold">Заявки на {{cur_type_name}}</h1>
      <q-toggle
         v-if="cur_type_id!==0"
      :false-value="false"
      :label="!subscribe? 'Подписаться на уведомления':'Отписаться от уведомлений'"
      :true-value="true"
         @input="subscribeChange"
      color="primary"
      v-model="subscribe"
    />
    </div>

    <div class="row">
     <div class="col-12">
        <OrderCard
          :order="order"
          :fullInfo="false"
          :is_own="false"
          :has_units="order.apply_units.some(v =>$auth.units.includes(v))"
          v-for="order in orders"
          :key="order.id"/>
        <q-pagination
          v-if="total_pages>1"
          unelevated
          outline
          class="q-py-lg"

          v-model="current_page"
          v-on:refresh="changePage"
          :max="total_pages"
        />
      </div>
<!--      <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 q-pl-md">-->
<!--        <q-card class="order-categories">-->
<!--          <q-list >-->
<!--            <div v-for="category in categories"-->
<!--                 :key="category.id" >-->
<!--              <q-expansion-item-->
<!--                group="somegroup"-->
<!--                icon="explore"-->
<!--                :label="`${category.name} (${getNum(category.id)})`"-->
<!--                header-class="text-primary">-->
<!--                <q-card>-->
<!--                  <q-card-section class="q-pt-none">-->
<!--                    <q-list dense>-->
<!--                      <q-item clickable-->
<!--                              v-ripple-->
<!--                              v-for="type in category.types"-->
<!--                              :key="type.id">-->
<!--                        <q-item-section @click="getOrders(type.name_slug,type.id,type.name_lower,1)">-->
<!--                          <p class="flex items-center justify-between q-mb-none" >{{type.name}} <q-badge outline color="primary" :label="type.orders_count" /> </p>-->
<!--                        </q-item-section>-->
<!--                      </q-item>-->
<!--                    </q-list>-->
<!--                  </q-card-section>-->
<!--                </q-card>-->
<!--              </q-expansion-item>-->
<!--              <q-separator />-->
<!--            </div>-->
<!--          </q-list>-->
<!--        </q-card>-->
<!--      </div>-->
    </div>
  </q-page>
</template>

<script>
import OrderCard from "components/order-card";
// import Footer from "components/Footer";
import { mapGetters, mapActions } from 'vuex'
import {date} from "quasar";
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
export default {
  name: 'catalog',
  components:{
    OrderCard,
  },

  data () {
    return {
      orders:[],
      total_pages:0,
      current_page:1,
      last_page:1,
      subscribe_text:'Подписаться на уведомления',
      subscribe:false,
      cur_type_id:0,
      applyUnits:0,
      cur_type_name:'',
      cur_type_slug:'all',
    }
  },
  async beforeMount() {
    await this.page_init()
  },
  methods:{
    ...mapActions('auth',['getUser']),
    async page_init(){
      const response = await this.$api.get(`/api/v1/order/get_orders?type_slug=all&city=${this.$auth.loggedIn ? this.$auth.user.city.id : 0}`)
      this.total_pages = response.data.page_count
      this.orders = response.data.results
    },
    async subscribeChange(){
        if(this.subscribe){
          const response = await this.$api.get(`/api/v1/order/subscribe?type=add&type_id=${this.cur_type_id}`)
          await this.getUser(false)
        }
        else{
          const response = await this.$api.get(`/api/v1/order/subscribe?type=del&type_id=${this.cur_type_id}`)
          await this.getUser(false)
        }
      },
    async getOrders(slug,id,name,page){
      const response_orders = await this.$api.get(`/api/v1/order/get_orders?type_slug=${slug}&page=${page}&city=${this.$auth.user ? this.$auth.user.city.id : 0}`)
      this.orders = response_orders.data.results
      this.cur_type_id=id
      this.cur_type_name=name
      this.cur_type_slug=slug
      this.total_pages = response_orders.data.page_count
      this.$auth.user.subscribe_type.includes(id) ? this.subscribe = true : this.subscribe = false
      this.scrollToElement(this.$refs.top)
    },
    changePage(){
      if (this.current_page !== this.last_page){
        this.getOrders(this.cur_type_slug,this.cur_type_id,this.cur_type_name,this.current_page)
        this.last_page = this.current_page
      }
    },
    getNum(id){
      let cat = this.categories.find(x => x.id === id)
      let orders_count = 0
      for(let t of cat.types){
        orders_count += t.orders_count
      }
      return orders_count
    },
    scrollToElement (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 300
      setScrollPosition(target, offset, duration)
    }
  },
  computed:{
    ...mapGetters('categories',['categories'])
  },


}
</script>
<style lang="sass" scoped>
.order-categories
  position: sticky
  top: 110px
</style>
