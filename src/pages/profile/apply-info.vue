<template>
  <q-page style="margin-bottom: 50px" class="container">
      <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Заявки на технику" :to="{name:'all_orders'}" icon="list"   />
        <q-breadcrumbs-el :label="`Детали заявки № ${order.id}`" />
      </q-breadcrumbs>
    </div>
    <p class="text-h4 text-bold">Заявка №: {{order.id}} | {{order.name}}</p>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div class="bg-grey-2 q-pa-md q-mb-md">
          <p class="text-bold">Дата размещения {{new Date(order.created_at) | formatDate}}</p>
          <p class="text-bold q-mb-sm ">Город {{order.owner.city.city}}</p>
          <p class="q-mb-none ">Заявка на  {{order.type.name}}</p>
          <p class="">Тип заявки    {{order.rent_type ? 'Почасовая':'Посуточная'}}</p>
          <p class="q-mb-none q-mr-sm text-bold">Дата/Время заявки:  </p>
          <p class="q-mb-none" >c {{order.rentDate | formatOnlyDate}}</p>
          <p class=" q-mb-none" v-if="order.rent_type">{{order.rentTime | formatTime}}</p>
          <p class="" v-if="order.rent_type">на {{order.rentDays}} час.</p>
          <p class="" v-else>на {{order.rentHours}} сут.</p>
          <p class=" text-bold">Просмотров: {{order.views }}</p>
        </div>
        <div class="bg-grey-2 q-pa-md q-mb-md">
        <p class="q-mb-sm text-bold text-h6">Необходимые характеристики</p>

        <p class="q-mb-sm " v-for="(filter,key) in order.filter">
          <span class="text-bold q-mr-sm">{{filter.placeholder}}:</span> <span >{{order.filter_value.find(x=>x.filter === filter.id).label}}</span>
        </p>
        <p class="q-mb-sm text-bold text-h6">Описание заявки</p>
        <div v-html="order.comment" class="q-mb-md"></div>
        <div v-if="order.worker" class="order__middle">
          <p class="text-bold">Телефон заказчика: {{order.owner.phone}}</p>
        </div>
        <div v-if="!order.is_finished">

          <p v-if="order.worker" class="text-h6 text-positive text-bold">Выполнятся с: {{order.update_at | formatDate  }}</p>
        </div>
        <div v-else>
          <p class="text-bold text-h6 text-positive" >Выполнена</p>
        </div>
        </div>
        <!--      -->
           <div v-if="order.is_finished && !order.worker_feedback">
              <q-form>
                <p class="q-mb-sm text-bold text-h6">Оцените заказчика</p>
                <q-rating
                  v-model="feedbackData.rate_value"
                  size="2em"
                  :max="5"
                  color="primary"
                  class="q-mb-lg"
                >
                  <template v-slot:tip-1>
                    <q-tooltip>Не советую</q-tooltip>
                  </template>
                  <template v-slot:tip-2>
                    <q-tooltip>Плохо</q-tooltip>
                  </template>
                  <template v-slot:tip-3>
                    <q-tooltip>Средне</q-tooltip>
                  </template>
                  <template v-slot:tip-4>
                    <q-tooltip>Хорошо</q-tooltip>
                  </template>
                  <template v-slot:tip-5>
                    <q-tooltip>Отлично</q-tooltip>
                  </template>
                </q-rating>
                <p class="q-mb-sm text-bold text-h6">Ваш отзыв</p>
                <q-input
                  v-model="feedbackData.rate_text"
                  outlined

                  class="q-mb-md"
                  type="textarea"
                />
                <q-btn unelevated no-caps color="primary" @click="sendFeedback" label="Оставить отзыв"/>
              </q-form>
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
      order:{
        apply_units:[],
        type:{
          name:'',
        }
      },
      feedbackData:{
        rate_value:0,
        rate_text:'',
      },
    }
  },
  async created() {
    await this.page_init()
  },
  methods:{
    async sendFeedback(){
        await this.$api.post('/api/v1/user/add_feedback/',{data:this.feedbackData,order:this.order.id})
        this.$router.push({name:'profile_index'})
      },
    async page_init(){
      const response = await this.$api.get(`/api/v1/order/get_lk_order/${this.$route.params.order_slug}`)
      this.order = response.data
    },
    async applyAccept(worker_id,worker_unit_id){
      const respond = await this.$api.post('/api/v1/order/apply/accept/',{
        order_id:this.order.id,
        worker_id:worker_id,
        worker_unit_id:worker_unit_id
      })
      console.log(respond)
      this.$router.push({name:'profile_orders'})
    },
    async applyDecline(worker_id,apply_unit_id){
      const respond = await this.$api.post('/api/v1/order/apply/decline/',{
        order_id:this.order.id,
        worker_id:worker_id,
        apply_unit_id:apply_unit_id
      })
      console.log(respond)
      this.$router.push({name:'profile_orders'})
    },
    async closeOrder(id){
      const respond = await this.$api.post('/api/v1/order/close/',{
        order_id:id
      })
      this.$router.push({name:'profile_orders'})
    },


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
