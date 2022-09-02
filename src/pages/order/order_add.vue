<template>
  <q-page class="container">
    <h1 class="text-h4 text-bold">Создание заявки на технику</h1>
    <p class="q-mb-xxl">Вы можете создать заявку на поиск техники и владельцы техники сами откликнуться на нее</p>
    <div class="row">

      <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 full-height">
        <q-splitter

          v-model="splitterModel"
          style="flex-wrap: wrap"
          :horizontal="!$q.screen.gt.sm"
          class="full-height">
          <template v-slot:before>
            <q-tabs
              v-model="tab"
              no-caps
              :vertical="$q.screen.gt.sm"
              inline-label
              align="left"
              class="text-primary order-tabs">
              <q-tab name="info" icon="mail" class="justify-start" label="Информация" />
              <q-tab name="filters" :disable="!tab_filters_active" icon="alarm" class="justify-start" label="Фильтры" />
              <q-tab name="description" :disable="!tab_description_active" icon="movie" label="Описание" />
            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              class="q-mt-md"
              transition-prev="jump-up"
              transition-next="jump-up">
              <q-tab-panel name="info" class="q-py-none">
                <q-form
                  ref="infoForm"
                  class="q-mb-sm "
                  @submit="infoFormSubmit">
                  <q-select
                    behavior="menu"
                    outlined
                    v-model="selectedCategory"
                    :options="categories"
                    :dense="!$q.screen.gt.sm"
                    :option-label="(item) =>  item.name"
                    lazy-rules
                    :rules="[val => val || 'Выберите категорию']"
                    label="Выберите категорию *" />
                  <q-select
                    behavior="menu"
                    outlined
                    v-model="order.selectedType"
                    :dense="!$q.screen.gt.sm"

                    :options="selectedCategory ? categories.find(x=>x.id===selectedCategory.id).types : null"
                    :option-label="(item) =>  item.name"
                    @input="typeSelected"
                    lazy-rules
                    :rules="[val => val || 'Выберите тип техники']"
                    :label="selectedCategory ? 'Выберите тип техники *' : 'Сначала выберите категорию'" />
                  <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-lg-2 col-md-3 col-sm-3 col-xs-12  q-mb-none ">Вид аренды</p>
                    <q-btn-toggle unelevated no-caps :dense="!$q.screen.gt.sm" v-model="order.rent_type" toggle-color="primary"
                                  :options="[
                                      {label: 'Почасовая', value: true},
                                      {label: 'Посуточная', value: false},
                                  ]" />
                  </div>

                  <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-lg-2 col-md-3 col-sm-3 col-xs-12 q-mb-none ">Выберите дату</p>
                    <q-input :dense="!$q.screen.gt.sm" outlined v-model="rentData.date" class="no-padding" >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer ">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="rentData.date" mask="YYYY-MM-DD" :options="dateFn">
                              <div class="row items-center justify-end">
                                <q-btn no-caps unelevated v-close-popup label="Выбрать" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div v-if="order.rent_type">
                    <div  class="q-gutter-sm row items-center">
                      <p class="col-lg-2 col-md-3 col-sm-3 col-xs-12 q-mb-sm ">Выберите время начала</p>
                      <q-input :dense="!$q.screen.gt.sm" class="q-mb-sm " outlined v-model="rentData.time" >
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
                      <p class="col-lg-2 col-md-3 col-sm-3 col-xs-4 q-mb-sm ">Количество часов</p>
                      <q-input
                        :dense="!$q.screen.gt.sm"
                        v-model.number="rentData.hours"
                        type="number"
                        outlined
                        style="max-width: 100px"
                      />
                    </div>
                  </div>
                  <div v-else>
                    <div  class="q-gutter-sm row items-center">
                      <p class="col-lg-2 col-md-3 col-sm-3 col-xs-4 q-mb-sm ">Количество суток</p>
                      <q-input

                        v-model.number="rentData.days"
                        type="number"
                        outlined
                        style="display: none"
                      /> <q-input
                      v-model.number="rentData.days"
                      :dense="!$q.screen.gt.sm"
                      type="number"
                      outlined
                      style="max-width: 100px"
                    />
                    </div>
                  </div>
                </q-form>
                <q-btn color="primary" no-caps @click="$refs.infoForm.submit()" label="Продолжить"/>
              </q-tab-panel>

              <q-tab-panel  name="filters">
                <q-form
                  ref="filterForm"
                  class="q-mb-sm "
                  @submit="filterFormSubmit">
                  <div class="filter-group" v-for="(filter,index) in all_filters.filter">

                    <q-select
                      behavior="menu"
                      v-if="filter.type==='select'"
                      outlined
                      v-model="filter.value"

                      dense
                      fill-input
                      input-debounce="0"
                      class="q-mb-sm"
                      :options="filter.values"
                      :option-label="(item) =>  item.label"
                      :option-value="(item) => item === null ? null : item.value"
                      :label="filter.placeholder"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <div v-if="filter.type==='radio'" class="flex items-center justify-start q-mb-sm">
                      <p v-if="filter.title" class="q-mr-sm q-mb-none  text-bold">{{filter.title}}</p>
                      <q-btn-toggle  unelevated no-caps  v-model="filter.value" toggle-color="primary"
                                        :options="filter.values" />
                    </div>

                  </div>
                </q-form>
                <q-btn color="primary" @click="$refs.filterForm.submit()" no-caps label="Продолжить"/>
              </q-tab-panel>
              <q-tab-panel  name="description">
                <q-form
                  ref="descriptionForm"
                  class="q-mb-sm "
                  @submit="descriptionFormSubmit">
                  <p>Название заявки</p>
                  <q-input
                    ref="input"
                    outlined
                    :dense="!$q.screen.gt.sm"
                    v-model="order.name"
                    label="Кратко опишите заявку *"
                    counter
                    :rules="[
                      val => !!val || 'Это обязательное поле',
                      val => val.length < 70 || 'Не более 70 символов',
                    ]"
                    lazy-rules />
                  <p class="q-mb-md col-2"  >Выберите город</p>
                  <!--                   @input="citySelected"-->
                  <q-select
                    behavior="menu"
                    outlined
                    :dense="!$q.screen.gt.sm"
                    v-model="order.city"
                    use-input
                    hide-selected
                    fill-input
                    class="col-6"
                    input-debounce="0"
                    label="Начните вводить"
                    :options="cities"
                    :option-label="(item) =>  item.city"
                    @filter="filterCity"
                    lazy-rules
                    :rules="[val => val !== null || 'Выберите город из списка']">
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

                  <p>Описание заявки</p>
                  <q-editor class="q-mb-md" v-model="order.description" min-height="5rem" />

                </q-form>
                <q-btn color="primary" no-caps :loading="loading" @click="$refs.descriptionForm.submit()" label="Завершить">
                         <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                </template>
                </q-btn>
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>
      </div>
      <div class="col-lg-4 col-md-4 gt-sm">
        <q-card class="q-pa-md">
          <h3 class="text-h6 text-bold q-mt-none q-mb-md">{{side_question}}</h3>
          <q-separator class="q-mb-md"/>
          <div v-html="info_text"></div>
        </q-card>

      </div>
    </div>


  </q-page>
</template>

<script>
// import Header from "components/Header";
// import Footer from "components/Footer";
import { date } from 'quasar'
import {mapGetters} from "vuex";

export default {
  name: 'catalog',
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    return store.dispatch('categories/fetchCategories')
  },
  data () {
    return {
      tab: 'info',
      tab_filters_active:false,
      tab_description_active:false,
      splitterModel: 20,
      side_question: '',
      selectedCategory:null,
      cities:[],
      is_city_selected: false,
      loading: false,
      rentData:{
        type:true,
        date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
        hours: 1,
        days: 1,
        time:date.formatDate(Date.now(), 'HH:mm'),
      },
      order:{
        city:null,
        selectedType:'',
        name:'',
        rent_type:true,
        description:'',
        coords:[55,55],
      },
      all_filters:{
        filter: []
      },
    }
  },
  methods:{
    infoFormSubmit(){
      console.log('infoForm submit')
      this.tab_filters_active = true
      this.tab = 'filters'

    },
    filterFormSubmit(){
      console.log('filterFormSubmit submit')
      this.tab_description_active = true
      this.tab = 'description'

    },
    descriptionFormSubmit(){
      console.log('descriptionFormSubmit submit')
      this.loading = true
      this.createOrder()
    },
    async createOrder(){
      this.is_loading = true
      let formData = new FormData()
      formData.set('rent_data', JSON.stringify(this.rentData));
      formData.set('order', JSON.stringify(this.order));
      formData.set('filters', JSON.stringify(this.all_filters.filter));
      const response = await this.$api({
        method: 'post',
        headers:{
          'content-type': 'multipart/form-data'
        },
        url: '/api/v1/order/add/',
        data: formData
      })
      this.$q.notify({
            message: 'Заявка успешно добавлена',
            color: 'positive',
            position:'top-right',
          })
      this.$router.push({name:'profile_orders'})
    },
    async typeSelected(){
      console.log('selected type',this.order.selectedType)
      const  response = await this.$api.get(`/api/v1/technique/filters/${this.order.selectedType.name_slug}/`)
      this.all_filters.filter = response.data

    },
    citySelected(){
      console.log('citySelected')
      console.log('selected city',this.order.city.id)
      console.log(this.cities.find(x => x.id === this.order.city.id).city)
      ymaps.geocode(this.cities.find(x => x.id === this.order.city.id).city, {
        results: 1
      }).then( (res) => {
        var firstGeoObject = res.geoObjects.get(0)
        this.order.coords = firstGeoObject.geometry.getCoordinates()
        this.is_city_selected = true
      });
    },
    mapClick(e){
      console.log('data',e.get('coords'))
      this.order.coords = e.get('coords');
    },
    filterCity (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      update(async() => {
        if (val && val.length >2 ) {
          const needle = val.toLowerCase()
          const result = await this.$api.get(`/api/v1/city/search?city=${val}`)
          this.cities = result.data
        }
      })
    },
    dateFn (date) {
      return date >= new Date().toISOString().split('T')[0].replace('-','/').replace('-','/')
    },
  },

  computed:{
    ...mapGetters('categories',['categories']),
    info_text(){
      if (this.tab==='info'){
        this.side_question =  'Какая техника Вам нужна?'
        let text= `<p>Выберите категорию и подкатегорию нужной техники</p>
                    <p>Далее укажите вид, выберите дату, время, количество часов или дней планируемой аренды</p>`
        return text
      }
      if (this.tab==='description'){
        this.side_question =  'Для чего это нужно?'
        let text= `<p>Напишите название Вашей заявки и краткое описание, а также выберите город, в котором нужно выполнить заявку</p>
                    <p>Вы можете указать точное местоположение на карте</p>`
        return text
      }
    }
  },
}
</script>
<style lang="sass" scoped>
.order-tabs
  & .q-tab
    justify-content: flex-start
.order-map
  height: 0
  overflow: hidden
  transition: all .2s linear
  &.is_visible
    height: 300px



</style>
