<template>
<q-no-ssr>
  <q-btn
    color="primary"
    no-caps
    unelevated
    label="Взять в аренду"
    v-if="$auth.loggedIn && $auth.user.is_customer"
    icon="las la-calendar" >
    <q-menu ref="messageMenu" fit>
      <q-list>
        <q-item class="flex column">
           <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-3  q-mb-none ">Вид аренды</p>
                    <q-btn-toggle unelevated no-caps v-model="rentData.type" toggle-color="primary"
                                  :options="[
                                      {label: 'Почасовая', value: true},
                                      {label: 'Посуточная', value: false},
                                  ]" />
                  </div>

                  <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-3 q-mb-none ">Выберите дату</p>
                    <q-input dense outlined v-model="rentData.date" class="no-padding" >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer ">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="rentData.date" mask="YYYY-MM-DD" :options="dateFn">
                              <div class="row items-center justify-end">
                                <q-btn no-caps v-close-popup label="Выбрать" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div v-if="rentData.type">
                    <div  class="q-gutter-sm row items-center">
                      <p class="col-3 q-mb-sm ">Выберите время начала</p>
                      <q-input class="q-mb-sm " outlined dense v-model="rentData.time" >
                        <template v-slot:append>
                          <q-icon name="access_time" class="cursor-pointer">
                            <q-popup-proxy transition-show="scale" transition-hide="scale">
                              <q-time v-model="rentData.time" format24h>
                                <div class="row items-center justify-end">
                                  <q-btn no-caps v-close-popup label="Выбрать" color="primary" flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div  class="q-gutter-sm row items-center">
                      <p class="col-3 q-mb-sm ">Количество часов</p>
                      <q-input
                        dense
                        v-model.number="rentData.hours"
                        type="number"
                        outlined
                        style="max-width: 100px"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <div  class="q-gutter-sm row items-center">
                      <p class="col-3 q-mb-sm ">Количество суток</p>
                      <q-input
                        dense
                        v-model.number="rentData.days"
                        type="number"
                        outlined
                        style="display: none"
                      /> <q-input
                      v-model.number="rentData.days"
                      dense
                      type="number"
                      outlined
                      style="max-width: 100px"
                    />
                    </div>
                  </div>
          <q-btn no-caps  @click="sendMsg" :loading="loading" color="primary" label="Отправить">
             <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                </template>
          </q-btn>
        </q-item>

      </q-list>
    </q-menu>
  </q-btn>
</q-no-ssr>
</template>

<script>
import { mapActions} from 'vuex'
import {date} from "quasar";
export default {
  props:['is_icon','owner_id','unit_id'],
  data () {
    return {
      loading:false,
      rentData:{
        type:true,
        date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        days: 1,
        time:date.formatDate(Date.now(), 'HH:mm'),
        hours:1,
      },
    }
  },
  methods:{
    async sendMsg(){
      this.loading=true
      await this.$api.post(`/api/v1/chat/new_message/${this.owner_id}`,{isRentMessage:true,
        rentUnit:this.unit_id,
        rentType:this.rentData.type,
        rentDate:this.rentData.date,
        rentDays:this.rentData.days,
        rentTime:this.rentData.time,
        rentHours:this.rentData.hours,
      })
      this.$refs.messageMenu.hide()
      this.$q.notify({
            message: 'Сообщение отправлено',
            color: 'positive',
            position:'top-right',
          })
      this.loading=false
    },
    dateFn (date) {
      return date >= new Date().toISOString().split('T')[0].replace('-','/').replace('-','/')
    },
  }
}
</script>
