<template>
  <q-page >
    <section class="bg-grey-10 q-pt-lg q-mb-xxl">
      <div class="container ">
        <div class="q-py-xl flex column items-center justify-between">
          <h3 class="text-white text-h3 text-bold q-mb-xl">Поиск техники</h3>
          <q-form class="full-width grid grid-3 gap-sm ">

            <q-select
              filled
              v-model="searchQuery"
              use-input
              hide-selected
              fill-input
              label="Что ищем?"
              class="bg-grey-1 rounded-borders "
              input-debounce="0"
              :options="searchResult"
              :option-label="(item) => item.is_filter_value ? `${item.filter_value_label} - ${item.type_name}` : `${item.type_name} - Категория`"

              @filter="filterResult"
            >
              <template v-slot:option="scope">
                      <q-item
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents">
<!--{{ `${scope.opt.type_name_slug},${scope.opt.filter_name_slug},${scope.opt.filter_value},${scope.opt.is_filter_value}` }}-->
                        <q-item-section>
<!--                          <q-item-label v-html="scope.opt.is_filter_value ? `${scope.opt.filter_value_label} - ${scope.opt.type_name}` : `${scope.opt.type_name}`" />-->
                          <q-item-label >
                            <div v-if="scope.opt.is_filter_value">
                    <span style="font-weight: bold; float: left; margin-right: 10px">{{ scope.opt.filter_value_label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ scope.opt.type_name }}</span>
                  </div>
                  <div v-else>
                     <span style="font-weight: bold; float: left; margin-right: 10px">{{ scope.opt.type_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">Категория</span>
                  </div>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
            </q-select>
            <q-select
                      filled
                    v-model="city"
                    use-input
                    hide-selected
                    fill-input
                    class="bg-grey-1 rounded-borders "
                    input-debounce="0"
                    label="Начните вводить"
                    :options="cities"
                    :option-label="(item) =>  item.city"
                    @filter="filterCity">

                    <template v-slot:option="scope">
                      <q-item
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents">

                        <q-item-section>
                          <q-item-label v-html="scope.opt.city" />
                          <q-item-label caption>{{ scope.opt.region }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select><!--   city_id       -->
            <q-btn class="col-3 offset-1 search-button full-width" @click="searchIt" size="lg" label="Найти" color="primary"/>
          </q-form>
        </div>
      </div>
    </section>
    <section>
      <h3 class="text-h3 text-center text-bold q-mb-xl">Каталог техники</h3>
      <div class="container">
        <div class="grid grid-3 gap-md q-mb-xl">
          <q-card v-if="item.is_show_at_index"
                  class="rounded-borders bg-grey-2 catalog-card"
                  flat

                  v-for="item in categories"
                  :key="item.id">
            <q-card-section
              horizontal>
              <q-card-section class="col-5 q-pr-none">
                <p class="text-h5 text-bold">{{item.name}}</p>
                <ul class="catalog-list">
                  <li v-for="(subcat,index) in item.types">
                    <router-link v-if="index<3"
                       :to="`catalog/${subcat.name_slug}`">
                      {{subcat.name}}
                    </router-link>
                    <router-link v-if="index===3"
                       to="/catalog"
                       @click.prevent="$router.push('/catalog')">еще...
                    </router-link>
                  </li>
                </ul>
              </q-card-section>
              <q-img
                class="col-7 catalog-image"
                :ratio="16/9"
                :src="item.image"/>
            </q-card-section>
          </q-card>
        </div>
        <div class="text-center q-mb-xxl">
          <q-btn color="primary" to="/catalog" style="width: 300px"  label="Показать все"/>
        </div>
      </div>
    </section>
    <section class="bg-grey-2 q-mb-xxl">
      <div class="container">
        <div class="row flex q-pt-xl q-pb-sm-xl justify-between">
          <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 q-mb-md text-center">
            <h3 class="text-h4 text-bold q-mb-md">Загрузите мобильное приложение</h3>
            <p class="text-h6 text-weight-thin">Получите ссылку для скачивания приложения</p>
            <div class="row flex  justify-center q-mb-md">
              <q-input
                outlined
                color="primary"
                dense
                v-model="phone"
                class="col-sm-4 col-xs-6 q-mr-md"
                label="Телефон"
                mask="+7 (###) ###-##-##"
              />
              <q-btn color="primary" class="col-sm-2 col-xs-5"  label="Отправить"/>
            </div>
            <div class="flex justify-center">
              <q-card flat class="col-1 q-pa-sm q-mr-md bg-deep-orange-2">
                <q-img contain style="width: 110px" src="../assets/aas.png"/>
              </q-card>
              <q-card flat class="col-1 q-pa-sm bg-deep-orange-2">
                <q-img contain style="width: 110px"  src="../assets/ggp.png"/>
              </q-card>

            </div>
          </div>
          <q-img class="col-4 col-md-4 gt-sm" style="width: 285px"  contain src="../assets/mobile.png"/>
        </div>
      </div>
    </section>
    <section >
      <div class="container">
        <h3 class="text-h3 text-bold text-center">Как это работает</h3>
        <div class="row flex justify-between items-start">
          <div  class="col-sm-4 col-xs-12 text-center">
            <q-img class="q-mb-md" contain style="width: 110px;height: 130px" src="../assets/hw1.png"/>
            <p class="text-h6" style="max-width: 190px; margin: 0 auto">Заполните критерии поиска</p>
          </div>
          <div  class="col-sm-4 col-xs-12 text-center">
            <q-img class="q-mb-md" contain style="width: 110px;height: 130px" src="../assets/hw2.png"/>
            <p class="text-h6" style="max-width: 300px; margin: 0 auto">Посмотрите подобранную технику</p>
          </div>
          <div  class="col-sm-4 col-xs-12 text-center">
            <q-img class="q-mb-md" contain style="width: 110px;height: 130px" src="../assets/hw3.png"/>
            <p class="text-h6" style="max-width: 335px; margin: 0 auto">Сделайте выбор и свяжитесь с владельцем техники</p>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  name: 'index',
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    return store.dispatch('categories/fetchCategories')
  },
  data () {
    return {
      city:[],
      searchQuery:null,
      cities:[],
      searchResult:[],
      phone:null
    }
  },
  computed:{
    ...mapGetters('categories',['categories'])
  },
  methods:{
    searchIt(){

      this.$router.push(`/catalog/${this.searchQuery.type_name_slug}?filter=${this.searchQuery.filter_id}&value=${this.searchQuery.filter_value}&city=${this.city.id}`)

      },
    filterCity (val, update, abort) {
      update(async() => {
        if (val && val.length >2 ) {
          const needle = val.toLowerCase()
          const result = await this.$api.get(`/api/v1/city/search?city=${val}`)
          this.cities = result.data
        }
      })
    },
     filterResult (val, update, abort) {
      update(async() => {
        if (val && val.length >2 ) {
          const needle = val.toLowerCase()
          const result = await this.$api.get(`/api/v1/technique/search/${val}`)
          this.searchResult = result.data
          console.log(this.searchResult)
        }else {
          this.searchResult=[]
        }
      })
    },



  }
}
</script>
<style lang="sass">
.catalog
  &-card
    height: 210px
  &-image
    & .q-img__image
      background-size: unset !important
      background-position: 100% 10% !important
</style>

{ "is_filter_value": true, "type_id": 53, "type_name_slug": "katok", "type_name": "Каток", "filter_id": 54, "filter_value_id": 525, "filter_value_label": "ЛЕГКИЙ (ДО 6Т)", "filter_value": "6t", "filter_name_slug": "ves-katka" }
{ "is_filter_value": false, "type_id": 1, "type_name_slug": "legkovyie-avto", "type_name": "Легковые авто", "filter_id": "", "filter_value_id": "", "filter_value_label": "", "filter_value": "", "filter_name_slug": "" }
