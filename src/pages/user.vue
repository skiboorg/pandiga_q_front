<template>
  <q-page style="margin-bottom: 50px" class="container">
    <q-no-ssr>
      <div  class="q-gutter-sm q-my-md">
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Главная" icon="home" to="/" />
          <q-breadcrumbs-el label="Профиль" icon="person"  />
          <q-breadcrumbs-el :label="user.first_name + ' ' +user.last_name" icon="person"  />
        </q-breadcrumbs>
      </div>
      <q-card flat bordered class="q-pa-lg ">
        <q-card-section style="flex-wrap: wrap" horizontal class="row items-center flex justify-start">
          <q-card-section class="col-lg-8 col-md-8 col-sm-6 col-xs-12 items-center flex justify-evenly">
            <q-avatar  class="relative-position" size="200px">
              <img style="object-fit: contain" :src="user.avatar">
            </q-avatar>


            <div>
              <p v-if="user.is_person" class="text-h5 text-bold">{{user.first_name}} {{user.last_name}}</p>
              <p v-if="!user.is_person" class="text-h5 text-bold">{{user.organization_name}}<br>ИНН: {{user.inn}}<br>ОГРН: {{user.ogrn}}</p>
              <div v-if="user.rate_times > 0">
                <div class="flex"><p class="no-margin text-caption">Рейтинг :</p>
                  <q-rating
                    v-model="user.rating"
                    size="xs"
                    color="primary"
                    readonly
                  /></div>
                <p class="text-caption">Отзывов: {{user.rate_times}}</p>
              </div>
              <p>г. {{user.city.city}}</p>
<!--              <p>{{user.email}}</p>-->
<!--              <p>{{user.phone}}</p>-->
            </div>
<q-card-section></q-card-section>
          </q-card-section>

        </q-card-section>
      </q-card>



      <div >
        <h3 v-if="feedbacks.length>0" class="text-bold text-h4">Отзывы</h3>
        <h3 v-else class="text-bold text-h4">Отзывов пока нет</h3>
        <q-card flat bordered v-for="feedback in feedbacks" :key="feedback.id" class="q-mb-md">
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
import {api} from "boot/axios";
export default {
  name: 'catalog',
  // components:{
  //   Header,
  //   Footer
  // },

  data () {
    return {
      feedbacks:[],
      user:{city:{city:''}},
      profile_caption:'Редактировать профиль',
      partner_caption:'Ввести код партнера',
      partnerCode:null,
      vip_price:100,
      avatar:null,


    }
  },
  beforeMount() {
    console.log(this.$route.params.u_id)
    this.getUser()
  },
  methods:{

    async getUser(){
      const response = await api.get( `/api/v1/user/get_user/${this.$route.params.u_id}`)
      console.log('getUser', response.data)
      this.user=response.data
      const response_f = await api.get( `/api/v1/user/get_user_feedback?user_id=${this.$route.params.u_id}`)
      this.feedbacks = response_f.data
    },

  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD.MM.YYYY, HH:mm')
    }
  }
}
</script>
<style lang="sass" scoped>

</style>
