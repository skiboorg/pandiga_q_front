<template>
  <q-page  class="container">

    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="las la-home" to="/" />
        <q-breadcrumbs-el label="Каталог" icon="las la-truck" to="/catalog" />
        <q-breadcrumbs-el :label="unit.type.name" :to="`/catalog/${$route.params.category_slug}`" icon="las la-list" />
        <q-breadcrumbs-el :label="unit.name"  />
      </q-breadcrumbs>
    </div>
    <!--     unit top start-->
    <div class="row q-mb-lg">
      <!--     unit left start-->
      <div class="col-lg-6 col-md-6 col-sm-4 col-xs-12 q-mb-sm">
        <q-carousel
          swipeable
          animated
          v-model="unit_current_image"
          thumbnails
          :fullscreen.sync="fullscreen"
          ref="carousel"
          infinite
        >
          <q-carousel-slide
            style="background-size: cover !important;"
            :name="index"
            :img-src="image.image"
            v-for="(image,index) in this.unit.images"
            :key="image.id"
          />

          <template v-slot:control>
            <q-carousel-control
              position="bottom-right"
              :offset="[18, 18]"
            >
              <q-btn
                 round dense color="white" text-color="primary"
                :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                @click="fullscreen = !fullscreen"
              />
            </q-carousel-control>
            <q-carousel-control
              position="bottom-right"
              :offset="[58, 18]"
              class="q-gutter-xs"
            >
              <q-btn
                 round dense color="white" text-color="primary" icon="arrow_left"
                @click="$refs.carousel.previous()"
              />
              <q-btn
                 round dense color="white" text-color="primary" icon="arrow_right"
                @click="$refs.carousel.next()"
              />
            </q-carousel-control>
          </template>
        </q-carousel>
      </div>
      <!--     unit left end-->
      <!--     unit right start-->
      <div class="col-lg-5 col-md-5 col-sm-6 col-xs-12 offset-lg-1 offset-md-1 offset-sm-1">
<!--        <q-badge class="q-px-lg q-py-sm" color="positive"  label="Cвободен"/>-->
        <div class="row items-center">
          <h1 class="col-10 text-h4 text-bold">{{unit.name}}, {{unit.year}}</h1>

             <FavoriteAdd v-if="$auth.loggedIn" :unit_id="unit.id" :is_in_favorites="$auth.user.favorites.includes(unit.id)"/>


        </div>
        <div class="q-mb-md" >
          <q-item-label class="flex"><p class="no-margin text-caption">Рейтинг :</p>
            <q-rating
              v-model="unit.rating"
              size="xs"
              color="primary"
              readonly
            /></q-item-label>
          <p class="no-margin text-caption">Отзывов : {{unit.rate_times}}</p>
        </div>
        <div class="flex items-center justify-between q-mb-lg">
          <p class="text-h6 text-primary text-bold q-mb-none">{{unit.rent_price}} &#8381;/ {{unit.rent_type? 'час' : 'день'}}</p>
          <p class="q-mb-none">Мин. время заказа: от {{unit.min_rent_time}} {{unit.rent_type? 'ч' : 'д'}}</p>
        </div>
        <div class="q-mb-lg q-gutter-md">
          <PrivateMsg  :is_icon="false" :owner_id="unit.owner.id" :unit_id="unit.id"/>
           <RentMsg :unit_id="unit.id" :owner_id="unit.owner.id"/>
        </div>
        <div class="flex items-center justify-start q-mb-lg">
          <p class="text-bold text-caption q-mr-md">Местонахождение: {{unit.city}}</p>
          <p  class="text-underline inline-block text-caption" @click="showMap=!showMap">{{showMap ? 'Скрыть карту' : 'Показать на карте'}}</p>
<!--          :class=" {ymapContanerHidden : !is_city_selected}"  -->



        </div>


      </div>
      <!--     unit right end-->
    </div>
    <!--     unit top end-->
    <!--     unit map start-->
    <q-no-ssr>
      <yandex-map
        v-if="showMap"
        :coords="coords"

        zoom="10"
        style="width: 100%; height: 440px; padding: 0;margin-bottom: 20px"
        :cluster-options="{ 1: {clusterDisableClickZoom: true} }"

        :controls="['trafficControl']"

        map-type="map">
        <ymap-marker
          markerId="1"
          marker-type="Placemark"
          :coords="coords">
        </ymap-marker>
      </yandex-map>
    </q-no-ssr>
    <!--     unit map end-->
    <!--     unit bottom start-->
    <div class="row q-mb-lg">
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-mb-sm">
        <q-card  flat class="bg-grey-2 q-pa-md">
          <p class="text-h6 text-bold no-margin">О владельце:</p>
          <q-card-section horizontal>
            <q-card-section class="col-3">
              <q-img :src="unit.owner.avatar"/>
            </q-card-section>
            <q-card-section class="col-8 offset-1">
              <p v-if="unit.owner.is_person"  class="text-h6 no-margin">{{unit.owner.fullname}}</p>
              <p v-else  class="text-h6 no-margin">{{unit.owner.organization_name}}</p>
              <div v-if="unit.owner.rate_times > 0" class="catalog-item__rating mb-10">
                <div class="flex items-center ">
                  <p class="no-margin text-caption">Рейтинг :</p>
                  <q-rating
                    v-model="unit.owner.rating"
                    size="xs"
                    color="primary"
                    readonly
                  />
                </div>


                <span class="text-caption">Отзывов: {{unit.owner.rate_times}}</span>
              </div>
              <p class="text-caption">г. {{unit.city}}</p>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-7 col-md-7 col-sm-7 col-xs-12 offset-lg-1 offset-md-1 offset-sm-1">
        <q-tabs
          v-model="tab"
          dense
          no-caps
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"

        >
          <q-tab name="description" label="Описание" />
          <q-tab name="info" label="Характеристики" />
          <q-tab name="feedback" label="Отзывы о технике" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="description">
            <div class="text-body2" v-html="unit.description"></div>

          </q-tab-panel>
          <q-tab-panel name="info">
            <ul class="catalog-list"  style="columns: 2; width: 80%">
              <li v-for="(item,index) in unit.filter">
                <p class="text-bold">{{item.placeholder}}: <span class="text-caption">{{unit.filter_value.find(x=>x.filter === item.id).label}}</span></p>
              </li>
            </ul>
          </q-tab-panel>
          <q-tab-panel name="feedback">
            <div v-if="unit.unit_feedbacks.length > 0">
              <p class="text-primary ">Отзывов о {{unit.name}} : {{unit.unit_feedbacks.length}}</p>
            <q-card flat class="no-padding" v-for="feedback in unit.unit_feedbacks" :key="feedback.id">
              <q-item class="no-padding">
                <q-item-section avatar >
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
              <q-card-section horizontal >
                <q-card-section class="no-padding">
                  <p class="flex items-center no-margin">Оценка :
                    <q-rating
                      v-model="feedback.value"
                      size="xs"
                      color="primary"
                      readonly
                    /></p>
                  <p class="no-margin">Отзыв: {{feedback.text}}</p>
                </q-card-section>
              </q-card-section>
              <q-separator class="q-my-sm"/>
            </q-card>
            </div>
            <div v-else>
              <p>Отзывов пока нет</p>
            </div>




          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <!--     unit bottom end-->

  </q-page>

</template>

<script>
import { mapActions,mapGetters} from 'vuex'
import {date} from "quasar";
import FavoriteAdd from "components/favorite_add";
import PrivateMsg from "components/owner-message";
import RentMsg from "components/rent-message";
export default {
  name: 'unit',
  components:{
    FavoriteAdd,
     PrivateMsg,
     RentMsg
  },

  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    return store.dispatch('unit/fetchItem', currentRoute.params.unit_slug)
  },

  data () {
    return {
      unit_current_image:0,
      fullscreen: false,
      showMap: false,
      tab: 'description'

    }
  },
  computed:{
    ...mapGetters('unit',['unit']),
    coords(){
      return this.unit.coords.replace('[','').replace(']','').split(',')
    }
  },
  methods: {
    ...mapActions('unit',['fetchItem']),

  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD.MM.YYYY, HH:mm')
    }
  }

}
</script>
<style lang="sass" scoped>
.q-carousel__slide
  background-size: contain
  background-repeat: no-repeat
  background-position: center

</style>
