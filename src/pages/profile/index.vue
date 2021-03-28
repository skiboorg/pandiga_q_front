<template>
  <q-page style="margin-bottom: 50px" class="container">
    <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person"  />
      </q-breadcrumbs>
    </div>
    <q-card class="q-pa-lg ">
      <q-card-section style="flex-wrap: wrap" horizontal class="row items-center flex justify-evenly">
        <q-card-section class="col-lg-8 col-md-8 col-sm-6 col-xs-12 items-center flex justify-evenly">
          <q-avatar size="200px">
            <img :src="$auth.user.avatar">
          </q-avatar>
          <div>
            <p v-if="$auth.user.is_person" class="text-h5 text-bold">{{$auth.user.first_name}} {{$auth.user.last_name}}</p>
            <p v-if="!$auth.user.is_person" class="text-h5 text-bold">{{$auth.user.organization_name}}<br>ИНН: {{$auth.user.inn}}<br>ОГРН: {{$auth.user.ogrn}}</p>
            <div v-if="$auth.user.rate_times > 0">
              <div class="flex"><p class="no-margin text-caption">Рейтинг :</p>
                <q-rating
                  v-model="$auth.user.rating"
                  size="xs"
                  color="primary"
                  readonly
                /></div>
              <p class="text-caption">Отзывов: {{$auth.user.rate_times}}</p>
            </div>
            <p>г. {{$auth.user.city.city}}</p>
          </div>

        </q-card-section>
        <q-card-section class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
          <p class="q-mb-sm">Баланс: <q-badge class="q-mx-sm" outline color="primary" :label="`${$auth.user.balance} руб`"/> </p>
          <div class="flex items-center q-mb-none">
            <p class="q-mb-none">Партнерский баланс: <q-badge class="q-mx-sm" outline color="primary" :label="`${$auth.user.partner_balance} руб`"/> </p>
            <q-btn size="sm" flat round color="dark" icon="info" >
              <q-tooltip anchor="center right" self="center left" :offset="[10, -10]">
                Информация о партнерке
              </q-tooltip>
            </q-btn>
          </div>
          <div class="flex items-center q-mb-lg">
            <p class="q-mb-none">Партнерский код: <q-badge class="q-mx-sm" outline color="primary" :label="`${$auth.user.partner_code}`"/> </p>
            <q-btn size="sm" flat round color="dark" icon="info" >
              <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                Информация о коде
              </q-tooltip>
            </q-btn>
          </div>
          <div class="q-mb-sm">
            <q-btn color="primary" outline :label="profile_caption"/>
            <q-popup-edit ref="profileEdit" v-model="profile_caption">
              <q-input  class="q-mb-sm" color="dark"  v-model="userData.email" dense autofocus>
                <template v-slot:prepend>
                  <q-icon name="alternate_email" color="dark" />
                </template>
              </q-input>
              <div v-if="this.$auth.user.is_person">
                <q-input  class="q-mb-sm" color="dark"  v-model="userData.first_name" dense >
                  <template v-slot:prepend>
                    <q-icon name="person" color="dark" />
                  </template>
                </q-input>
                <q-input  class="q-mb-sm" color="dark"  v-model="userData.last_name" dense >
                  <template v-slot:prepend>
                    <q-icon name="person" color="dark" />
                  </template>
                </q-input>

              </div>
              <div v-else>
                <q-input  class="q-mb-sm" color="dark"  v-model="userData.organization_name" dense >
                  <template v-slot:prepend>
                    <q-icon name="person" color="dark" />
                  </template>
                </q-input>
                <q-input  class="q-mb-sm" color="dark"  v-model="userData.inn" dense >
                  <template v-slot:prepend>
                    <q-icon name="person" color="dark" />
                  </template>
                </q-input>
                <q-input  class="q-mb-sm" color="dark"  v-model="userData.ogrn" dense >
                  <template v-slot:prepend>
                    <q-icon name="person" color="dark" />
                  </template>
                </q-input>
              </div>


              <q-btn size="sm" @click="updateUser" class="full-width" color="primary" label="Сохранить"/>
            </q-popup-edit>
          </div>
          <div class="">
            <q-btn class="q-px-md"  color="primary" :label="partner_caption"/>
            <q-popup-edit  ref="partnerCode" v-model="partner_caption" :cover="true" :offset="[0, 0]">
              <q-input mask="########" class="q-mb-sm" color="dark" type="number" v-model.number="partnerCode" dense autofocus>
                <template v-slot:prepend>
                  <q-icon name="keyboard" color="dark" />
                </template>
              </q-input>
              <q-btn size="sm" @click="sendPartnerCode" class="full-width" color="primary" label="Применить"/>
            </q-popup-edit>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>


    <div v-if="!$auth.user.is_customer" class="q-mb-lg">
      <h3 class="text-h4 text-bold">Ваша техника</h3>
      <div class="grid grid-3 gap-md">
        <q-card v-for="unit in $auth.units" :key="unit.id" class="my-card" flat bordered>
          <q-img :ratio="16/9" :src="unit.images[0].image"/>

          <q-card-section>
            <!--        <div class="text-overline text-primary q-mb-sm">{{unit.type.name}}</div>-->
            <div class="text-h5 q-mt-sm q-mb-xs flex items-center justify-between">
              <p class="q-mb-none">{{unit.name}}</p>

              <div v-if="unit.is_active" class="flex items-center ">
                <q-badge class="q-mx-sm" outline color="positive " label="Участвует в поиске"/>
                <q-btn @click="unitPromote(unit.id,false)" class="q-mr-sm" size="sm"  round color="positive" icon="arrow_upward" >
                  <q-tooltip anchor="center right" self="center left" :offset="[10, -10]">
                    Поднять в поиске за {{unit.ad_price}} руб
                  </q-tooltip>
                </q-btn>
                <q-btn @click="unitPromote(unit.id,true)" size="sm"  round color="positive" icon="vertical_align_top" >
                  <q-tooltip anchor="center right" self="center left" :offset="[10, -10]">
                    Поднять и закрепить в поиске за {{unit.ad_price + vip_price}} руб
                  </q-tooltip>
                </q-btn>
              </div>
              <div v-else class="flex items-center ">
                <q-badge class="q-mx-sm" outline color="primary " label="Не участвует в поиске"/>
                <q-btn @click="unitPay(unit.id)" size="sm"  round color="positive" icon="money" >
                  <q-tooltip anchor="center right" self="center left" :offset="[10, -10]">
                    Оплатить размещение {{unit.ad_price + vip_price}} руб
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
            <div class="text-caption text-grey">
              <p class="q-mb-none">{{unit.rent_price}} руб./ <span v-if="unit.rent_type"> час</span> <span v-if="!unit.rent_type"> день</span> </p>
            </div>
          </q-card-section>
          <q-card-actions class="flex justify-between">
            <q-btn @click="$router.push({name:'profile_edit_unit',params:{uuid:unit.uuid}})" color="primary" outline icon="edit" label="Редактировать" />
            <q-btn @click="deleteUnit(unit.id)" color="primary" icon="delete" label="Удалить" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
    <div v-else>
      <h3 v-if="$auth.feedbacks.length>0" class="text-bold text-h4">Отзывы</h3>
      <h3 v-else class="text-bold text-h4">Отзывов пока нет</h3>
      <q-card v-for="feedback in $auth.feedbacks" :key="feedback.id" class="q-mb-md">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src="feedback.author.avatar">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{feedback.author.fullname}}</q-item-label>
            <q-item-label caption>
              {{feedback.created_at | formatDate}}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section>
          {{feedback.text}}
        </q-card-section>
      </q-card>
    </div>
    </q-no-ssr>
  </q-page>
</template>

<script>
// import Header from "components/Header";
// import Footer from "components/Footer";
import {mapActions} from 'vuex'
import {date} from "quasar";
export default {
  name: 'catalog',
  // components:{
  //   Header,
  //   Footer
  // },

  data () {
    return {
      profile_caption:'Редактировать профиль',
      partner_caption:'Ввести код партнера',
      partnerCode:null,
      vip_price:100,
      userData: {
        email: this.$auth.user.email,
        organization_name: this.$auth.user.organization_name,
        inn: this.$auth.user.inn,
        ogrn: this.$auth.user.ogrn,
        orders_count: this.$auth.user.orders_count,
        rent_count: this.$auth.user.rent_count,
        city: this.$auth.user.city.city,
        first_name: this.$auth.user.first_name,
        last_name: this.$auth.user.last_name,
        phone: this.$auth.user.phone,
        is_customer: this.$auth.user.is_customer,

      }

    }
  },
  mounted() {
    this.getUser()
  },
  methods:{
    ...mapActions('auth',['getUser']),
    async deleteUnit(id){
      const response = await this.$api.post('/api/v1/technique/unit/delete/',{unit_id:id})
      await this.getUser(false)
    },
    async unitPay(id){
      const response = await this.$api.post('/api/v1/technique/pay',{unit_id:id})
      console.log(response)
      if(response.data.result){
        this.$q.notify({
          message: 'Ваша техника снова участвует в поиске',
          position:'top-right',
          color: 'positive'
        })
        await this.getUser(false)
      }else {
        this.$q.notify({
          message: 'Не хватает средств',
          position:'top-right',
          color: 'red'
        })
      }
    },
    async unitPromote(id,pin){
      const response = await this.$api.post('/api/v1/technique/promote',{unit_id:id,is_pin:pin})
      console.log(response)
      if(response.data.result){
        this.$q.notify({
          message: 'Ваша техника поднята в поиске',
          position:'top-right',
          color: 'positive'
        })
        await this.getUser(false)
      }else {

        this.$q.notify({
          message: 'Не хватает средств',
          position:'top-right',
          color: 'red'
        })
      }
    },
    async sendPartnerCode(){
      this.$refs.partnerCode.hide()
      const response = await this.$api.post('/api/v1/user/new_partner/',{code:this.partnerCode})
      console.log(response.data)
      if (response.data['status']){
        this.$q.notify({
          message: 'Код успешно применен',
          position:'top-right',
          color: 'positive',
        })
      }else {
        this.$q.notify({
          message: 'Код не действительный',
          position:'top-right',
          color: 'red',
        })
      }
      this.partnerCode = null
    },
    async updateUser(){
      this.$refs.profileEdit.hide()
      let formData = new FormData()
      formData.set('userData', JSON.stringify(this.userData))

      //formData.set('avatar',this.avatar)

      const response = await this.$api({
        method: 'post',
        headers:{
          'content-type': 'multipart/form-data'
        },
        url: '/api/v1/user/update/',
        data: formData
      })
      console.log(response.data)
      await this.getUser(false)
    },
  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD/MM/YYYY, HH:mm')
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
