<template>
  <q-card flat class="q-mb-md bg-grey-2" >

    <q-item v-if="false">
      <q-item-section avatar>
        <q-avatar>
          <img :src="order.owner.avatar">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="order.owner.is_person">{{order.owner.fullname}}</q-item-label>
        <q-item-label v-else>{{order.owner.organization_name}}</q-item-label>
        <q-item-label caption>
          Размещено заявок: {{order.owner.orders_count}}
        </q-item-label>
      </q-item-section>
      <q-item-section v-if="!order.owner.rate_times > 0">
        <q-item-label class="flex"><p class="no-margin text-caption">Рейтинг :</p>
          <q-rating

            v-model="order.owner.rating"
            size="xs"
            color="primary"
            readonly
          /></q-item-label>
        <q-item-label caption>Отзывов: {{order.owner.rate_times}}</q-item-label>
      </q-item-section>
    </q-item>


    <q-card-section style="flex-wrap: wrap" horizontal class="row">
      <q-card-section class="col-lg-8 col-md-8 col-sm-6 col-xs-12">
        <q-card-section class="no-padding q-mb-md">


            <h3 v-if="!fullInfo"
                class="text-h6 q-mt-none q-mb-sm text-weight-medium text-primary ">№{{order.id}} {{order.name}}</h3>
            <div v-if="fullInfo" class="">
              <p class="q-mb-sm text-bold text-h6">Необходимые характеристики</p>

              <p class="q-mb-sm " v-for="(filter,key) in order.filter">
                <span class="text-bold q-mr-sm">{{filter.placeholder}}:</span> <span >{{order.filter_value.find(x=>x.filter === filter.id).label}}</span>
              </p>
            </div>



                      <div :class="[!fullInfo ? 'ellipsis-3-lines' : '']" >
                        <p style="line-break: anywhere;" v-html="order.comment"></p>
                      </div>
                    </q-card-section>

                    <q-card-section class="no-padding">
                      <q-item class="no-padding cursor-pointer"  >
                        <q-item-section avatar @click="$router.push(`/user/${order.owner.id}`)">
                          <q-avatar>
                            <img :src="order.owner.avatar">
                          </q-avatar>
                        </q-item-section>
                        <q-item-section @click="$router.push(`/user/${order.owner.id}`)">
                          <q-item-label v-if="order.owner.is_person">{{order.owner.fullname}}</q-item-label>
                          <q-item-label v-else>{{order.owner.organization_name}}</q-item-label>
                          <q-item-label caption>
                            Размещено заявок: {{order.owner.orders_count}}
                          </q-item-label>
                          <p></p>
                          <q-item-label >
                            <div v-if="order.owner.rate_times > 0" @click="$router.push(`/user/${order.owner.id}`)">
                              <q-item-label class="flex"><p class="no-margin text-caption">Рейтинг :</p>
                                <q-rating
                                  v-model="order.owner.rating"
                                  size="xs"
                                  color="primary"
                                  readonly
                                />
                              </q-item-label>
                              <q-item-label caption>Отзывов: {{order.owner.rate_times}}</q-item-label>
                            </div>
                          </q-item-label>
                        </q-item-section>


                      </q-item>
                    </q-card-section>



                  </q-card-section>
                  <q-card-section class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <p class="text-caption">Дата размещения {{new Date(order.created_at) | formatDate}}</p>
                    <p class="text-caption q-mb-sm ">Город {{order.owner.city.city}}</p>
                    <p class="q-mb-sm text-caption">Заявка на  <q-badge  align="middle">{{order.type.name}}</q-badge></p>

                    <p v-if="order.rent_type !== null" class="text-caption">Тип заявки    <q-badge  align="middle">{{order.rent_type ? 'Почасовая':'Посуточная'}}</q-badge></p>
                    <p v-else class="text-caption">Тип заявки    <q-badge  align="middle">По километрам</q-badge></p>

                    <div v-if="order.rent_type !== null" class="flex items-center justify-start q-mb-lg text-subtitle2 text-bold">
                      <p class="q-mb-none q-mr-sm">c {{order.rentDate | formatOnlyDate}}</p>
                      <p class="q-mb-none q-mr-sm" v-if="order.rent_type">{{order.rentTime | formatTime}}</p>
                      <p class="q-mb-none" v-if="order.rent_type">на {{order.rentDays}} час.</p>
                      <p class="q-mb-none" v-else>на {{order.rentHours}} сут.</p>
                    </div>

                    <div v-else class="flex items-center justify-start q-mb-lg text-subtitle2 text-bold">
                      <p class="q-mb-none q-mr-sm">{{order.rentDate | formatOnlyDate}}</p>

                      <p class="q-mb-none" >на {{order.rentKm}} км</p>

                    </div>

                    <div v-if="!is_own">

                      <q-badge v-if="has_units" outline class="q-mb-sm" color="positive" label="Есть предложенная Вами техника" />
                      <p class="q-mb-sm" v-if="has_decine_units"><q-badge class="text-h6"  color="primary" label="Заказчик отказал" /></p>
                      <div class="" v-if="has_worker && order.is_finished">
                        <p class="q-mb-sm"><q-badge class="text-h6"  color="positive"
                                                                           label="Выполнена" /></p>
                      </div>
                      <div class="" v-if="has_worker && !order.is_finished">
                        <p class="q-mb-sm"><q-badge class="text-h6"  color="positive"
                                                    :label="has_worker.id === $auth.user.id? 'Вас выбрали' : 'Выполняется'" /></p>
                      </div>
                      <div class="" v-if="has_worker">
                        <q-btn v-if="has_worker.id === $auth.user.id" class="q-mr-sm" unelevated no-caps @click="$router.push({name:'profile_apply_info',params:{order_slug:order.name_slug}})" outline color="primary" label="Подробнее"/>

                      </div>

                      <div class="" v-if="!has_decine_units && !has_worker">
                        <q-btn v-if=" !fullInfo " color="primary" outline unelevated no-caps :to="{name:'order_info',params: { order_slug:order.name_slug }}" :label="has_units ? 'Подробнее' : 'Предложить технику'"/>
                      </div>


                   </div>
                    <div v-else>
                      <q-separator class="q-mb-sm"/>
                      <div v-if="!order.is_finished">
                        <p class="text-caption q-mb-none text-bold">Просмотров: {{order.views }}</p>
                        <p class="text-caption q-mb-md text-bold">Предложений: {{order.apply_units.length }}</p>
                      </div>
                      <div v-else class="">
                        <p class="text-bold text-positive">Выполнена</p>
                      </div>

                      <q-btn class="q-mr-sm" unelevated no-caps v-if="!is_apply"
                 @click="$router.push({name:'profile_order_info',params:{order_slug:order.name_slug}})" outline color="primary" label="Открыть"/>
          <q-btn class="q-mr-sm" unelevated no-caps v-else
                 @click="$router.push({name:'profile_apply_info',params:{order_slug:order.name_slug}})" outline color="primary" label="Детали"/>
<!--          <q-btn v-if="!order.worker" color="primary" unelevated no-caps @click="deleteOrder(order.id)" label="Удалить"/>-->
        </div>

      </q-card-section>
    </q-card-section>



  </q-card>
</template>

<script>
import { date } from 'quasar'
import {mapActions} from "vuex";

export default {
  name: 'order-card',
  props:['order','fullInfo','has_units','is_own','is_apply','has_decine_units','has_worker'],
  data () {
    return {

    }
  },
  methods:{
    async deleteOrder(id){
      const respond = await this.$api.post('/api/v1/order/delete/',{
        order_id:id
      })
      this.$emit('refresh', {})
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
.unit-card__bagde
  height: 10px
  padding: 10px 5px
  top: 5px
  left: 5px
</style>
