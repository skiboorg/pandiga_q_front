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

    </div>
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-select outlined v-model="selected_type" label="Выберите тип техники" @popup-hide="type_change" :options="user_unit_types"/>
      </div>
      <div class="col-12 col-md-3">
        <q-select outlined v-model="order_status" label="Выберите фильтр" @popup-hide="filter_change" :options="order_statuses"/>
      </div>
      <div class="col-12 col-md-3 gt-sm"></div>
      <div class="col-12 col-md-3">
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

    </div>
<!--<pre>-->
<!--  {{$auth.units}}-->
<!--</pre>-->
    <div class="row">
     <div class="col-12">
        <OrderCard
          :order="order"
          :fullInfo="false"
          :is_own="false"
          :has_units="order.apply_units.some(x=>$auth.units.filter(y=>y.id===x))"
          :has_decine_units="order.decline_units.some(x=>$auth.units.filter(y=>y.id===x))"
          :has_worker = "order.worker"

          v-for="order in filtered_orders"
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
      filtered_orders:[],
      total_pages:0,
      current_page:1,
      last_page:1,
      subscribe_text:'Подписаться на уведомления',
      subscribe:false,
      cur_type_id:0,
      applyUnits:0,
      cur_type_name:'',
      cur_type_slug:'all',
      selected_type:{label:'Все заявки',value:'all',id:0},
      user_unit_types:[],
      order_status:{label:'Без фильтров',value:'all'},
      order_statuses:[
        {label:'Без фильтров',value:'all'},
        {label:'Вас выбрали исполнителем',value:'worker'},
        {label:'С предложенной техникой',value:'apply'},
        {label:'С отказанной техникой',value:'decline'},
      ]
    }
  },
  async beforeMount() {
    await this.page_init()
    this.user_unit_types.push({label:'Все заявки',value:'all',id:0, name:''})
    for (let x of this.$auth.units){
      this.user_unit_types.push({label:x.type.name,value:x.type.name_slug,id:x.type.id,name:x.type.name_lower})
    }

  },
  methods:{
    ...mapActions('auth',['getUser']),
    async type_change(){
      console.log(this.selected_type)
      await this.getOrders(this.selected_type.value,this.selected_type.id,this.selected_type.name,1)
    },

    filter_change(){
      console.log(this.order_status)
      if (this.order_status.value === 'worker'){
        this.filtered_orders = this.orders.filter(order=>order.worker ? order.worker.id === this.$auth.user.id : null)
      }
      if (this.order_status.value === 'apply'){
        this.filtered_orders = this.orders.filter(order=>order.apply_units.some(x=>this.$auth.units.filter(y=>y.id===x)))
      }
      if (this.order_status.value === 'decline'){
        this.filtered_orders = this.orders.filter(order=>order.decline_units.some(x=>this.$auth.units.filter(y=>y.id===x)))
      }
      if (this.order_status.value === 'all'){
        this.filtered_orders = this.orders
      }
      console.log(this.orders.filter(order=>order.decline_units.some(x=>this.$auth.units.filter(y=>y.id===x))))
    },
    async page_init(){
      const response = await this.$api.get(`/api/v1/order/get_orders?type_slug=all&city=${this.$auth.loggedIn ? this.$auth.user.city.id : 0}`)
      this.total_pages = response.data.page_count
      this.orders = response.data.results
      console.log(this.orders)
      this.filtered_orders = this.orders
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
      this.order_status = {label:'Без фильтров',value:'all'}
      const response_orders = await this.$api.get(`/api/v1/order/get_orders?type_slug=${slug}&page=${page}&city=${this.$auth.user ? this.$auth.user.city.id : 0}`)
      this.orders = response_orders.data.results
      this.filtered_orders = this.orders
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
