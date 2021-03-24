<template>
  <q-page style="margin-bottom: 50px" class="container">
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Мои заявки на технику" :to="{name:'profile_orders'}" icon="list"   />
        <q-breadcrumbs-el :label="`Детали заявки № ${order.id}`" />
      </q-breadcrumbs>
    </div>
    <p class="text-h4 text-bold">Заявка №: {{order.id}} | {{order.name}}</p>
    <div class="row">
     <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">
        <p class="">Дата размещения {{new Date(order.created_at) | formatDate}}</p>
        <p class="q-mb-sm ">Заявка на  {{order.type.name}}</p>
        <p class="">Тип заявки    {{order.rent_type ? 'Почасовая':'Посуточная'}}</p>
        <p class=" text-bold">Просмотров: {{order.views }}</p>

        <div class="flex items-center justify-start q-mb-lg text-subtitle2 text-bold">
          <p class="q-mb-none q-mr-sm text-bold">Дата/Время</p>
          <p class="q-mb-none q-mr-sm">c {{order.rentDate | formatOnlyDate}}</p>
          <p class="q-mb-none q-mr-sm" v-if="order.rent_type">{{order.rentTime | formatTime}}</p>
          <p class="q-mb-none" v-if="order.rent_type">на {{order.rentDays}} час.</p>
          <p class="q-mb-none" v-else>на {{order.rentHours}} сут.</p>
        </div>
        <p class="q-mb-sm text-bold text-h6">Необходимые характеристики</p>

        <p class="q-mb-sm " v-for="(filter,key) in order.filter">
          <span class="text-bold q-mr-sm">{{filter.placeholder}}:</span> <span >{{order.filter_value.find(x=>x.filter === filter.id).label}}</span>
        </p>
        <p class="q-mb-sm text-bold text-h6">Описание заявки</p>
        <div v-html="order.comment"></div>
        <div v-if="order.worker" class="order__middle">
          <p>Телефон исполнителя: {{order.worker.phone}}</p>
        </div>
        <div v-if="!order.is_finished">

          <p v-if="order.worker" class="text-h6 text-positive text-bold">Выполнятся с: {{order.update_at | formatDate  }}</p>
        </div>
        <div v-else>
          <p class="text-bold text-h6 text-positive" >Выполнена</p>
        </div>
        <q-btn v-if="order.worker && !order.is_finished" @click="closeOrder(order.id)" color="positive" label="Завершить"/>
        <!--      -->
        <div class="">
          <div v-if="!order.is_finished ">
            <div v-if="!order.worker" class="">
              <h3 v-if="order.apply_units.length >0"  class="text-h4 text-bold">Предложения от исполнителей</h3>
              <h3 v-else  class="text-h4 text-bold">Предложении от исполнителей пока не поступало</h3>
              <div class="grid grid-3 gap-md">
                <q-card v-for="unit in order.apply_units" :key="unit.id" class="my-card" flat bordered>
                  <q-img class="cursor-pointer" @click="$router.push(`/catalog/${unit.type.name_slug}/${unit.name_slug}`)" :ratio="16/9" :src="unit.images[0].image"/>
                  <q-card-section>
                    <div class="text-h5 q-mt-sm q-mb-xs flex items-center justify-between">
                      <router-link class="no-underline" :to="`/catalog/${unit.type.name_slug}/${unit.name_slug}`">
                        <p class="text-h5 cursor-pointer q-mb-sm ">{{unit.name}}, {{unit.year}}</p>
                      </router-link>
                    </div>
                    <div class="text-caption text-grey">
                      <p class="q-mb-none">Мин. время заказа: от {{unit.min_rent_time}} {{unit.rent_type? 'час' : 'день'}}</p>
                      <p class="q-mb-none">{{unit.rent_price}} руб./ <span v-if="unit.rent_type"> час</span> <span v-if="!unit.rent_type"> день</span> </p>
                    </div>
                    <div class="flex"><p class="no-margin text-caption">Рейтинг :</p>
                      <q-rating
                        v-model="unit.rating"
                        size="xs"
                        color="primary"
                        readonly
                      /></div>
                    <div class=" text-caption">Отзывов: {{unit.rate_times}}</div>
                    <p class=" text-caption">Расположение г.{{unit.city}}</p>
                  </q-card-section>
                  <q-card-actions class="flex justify-between">
                    <q-btn @click="applyAccept(unit.owner,unit.id)" color="positive" style="flex-basis: 49%" icon="check" label="Принять" />
                    <q-btn @click="applyDecline(unit.owner,unit.id)" color="primary" style="flex-basis: 45%" icon="delete" label="Отменить" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>
          <div  v-else>
            <div v-if="!order.customer_feedback">
              <q-form>
                <p class="mb-20">Оцените исполнителя</p>
                <q-rating
                  v-model="feedbackData.rate_value"
                  size="2em"
                  :max="5"
                  color="primary"
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
                <p>Ваш отзыв</p>
                <q-input
                  v-model="feedbackData.rate_text"
                  filled
                  type="textarea"
                />
                <q-btn color="primary" @click="sendFeedback" label="Оставить отзыв"/>
              </q-form>
            </div>
          </div>
        </div>
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
      order:{
        apply_units:[],
        type:{
          name:'',
        }
      },
      feedbackData:{
        rate_value:null,
        rate_text:'',
      },
    }
  },
  async created() {
    await this.page_init()
  },
  methods:{
    async sendFeedback(){
        const respond = await this.$api.post('/api/v1/technique/add_feedback/',{data:this.feedbackData,to:this.order.worker_unit.id,order:this.order.id})
        this.$router.push({name:'profile_orders'})
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
