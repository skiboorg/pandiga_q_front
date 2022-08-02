<template>
  <q-page class="container">
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Каталог" icon="local_shipping" to="/catalog" />
        <q-breadcrumbs-el label="Добавление новой техники"  />
      </q-breadcrumbs>
    </div>
    <h1 class="text-h4 text-bold">Добавить технику в каталог</h1>
    <div class="row">
      <div class="col-8 full-height">
        <q-splitter
          disable
          v-model="splitterModel"
          class="full-height">
          <template v-slot:before>
            <q-tabs
              v-model="tab"
              vertical
              no-caps
              inline-label
              class="text-primary order-tabs">
              <q-tab name="info" icon="info" class="justify-start" label="Основная информация" />
              <q-tab name="filters" :disable="!tab_filters_active" icon="filter_list" class="justify-start" label="Фильтры" />
              <q-tab name="place" :disable="!tab_filters_active" icon="place" class="justify-start" label="Местоположение" />
              <q-tab name="description" :disable="!tab_description_active"  class="justify-start" icon="add_a_photo" label="Описание и фото" />

            </q-tabs>
          </template>
          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up">
              <q-tab-panel name="info" class="q-py-none">
                <q-form
                  ref="infoForm"
                  class="q-mb-lg "
                  @submit="infoFormSubmit">
                  <q-select
                    outlined
                    v-model="selectedCategory"
                    :options="categories"
                    @input="categorySelected"

                    :option-label="(item) =>  item.name"
                    lazy-rules
                    :rules="[val => val || 'Выберите категорию']"
                    label="Выберите категорию *" />
                  <q-select
                    outlined
                    v-model="unit.selectedType"

                    :options="selectedCategory ? categories.find(x=>x.id===selectedCategory.id).types : null"
                    :option-label="(item) =>  item.name"
                    @input="typeSelected"
                    lazy-rules
                    :rules="[val => val || 'Выберите тип техники']"
                    :label="selectedCategory ? 'Выберите тип техники *' : 'Сначала выберите категорию'" />
                  <q-input
                    ref="input"
                    outlined
                    v-model="unit.name"
                    label="Название техники *"
                    :rules="[
                    val => !!val || 'Это обязательное поле']"
                    lazy-rules
                  />
                  <q-input
                    ref="input"
                    outlined
                    v-model="unit.year"
                    label="Год выпуска *"
                    mask="####"
                    :rules="[
                    val => !!val && val.length >= 4 || 'Это обязательное поле не менее 4х цифр']"
                    lazy-rules
                  />
                  <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-3  q-mb-none ">Вид аренды</p>
                    <q-btn-toggle no-caps unelevated v-model="unit.rent_type" toggle-color="primary"
                                  :options="[
                                      {label: 'Почасовая', value: true},
                                      {label: 'Посуточная', value: false},
                                  ]" />
                  </div>

                  <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-3 q-mb-none ">Минимальное время аренды ({{unit.rent_type ? 'часов' : 'суток'}})</p>
                    <q-input
                      v-model.number="unit.min_rent_time"
                      type="number"
                      dense
                      outlined
                      style="max-width: 100px"/>
                  </div>
                  <div  class="q-gutter-sm row items-center q-mb-sm">
                    <p class="col-3 q-mb-none ">Стоимость аренды в ({{unit.rent_type ? 'часов' : 'суток'}})</p>
                    <q-input
                      v-model.number="unit.rent_price"
                      type="number"
                      dense
                      outlined
                      style="max-width: 100px"/>
                  </div>


                </q-form>
                <q-btn color="primary" no-caps unelevated @click="$refs.infoForm.submit()" label="Продолжить"/>
              </q-tab-panel>
              <q-tab-panel name="filters" class="q-py-none">
                <q-form
                  ref="filterForm"
                  class="q-mb-sm "
                  @submit="filterFormSubmit">
                  <div class="filter-group" v-for="(filter,index) in all_filters.filter">

                    <q-select
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
                      <q-btn-toggle   no-caps unelevated  v-model="filter.value" toggle-color="primary"
                                        :options="filter.values" />
                    </div>

                  </div>
                  <q-btn color="primary" no-caps unelevated @click="$refs.filterForm.submit()" :disable="!filters_outlined" :label="filters_outlined? 'Продолжить' : 'Заполните все фильтры'"/>
                </q-form>
              </q-tab-panel>
              <q-tab-panel name="place" class="q-py-none">
                <q-form
                  ref="placeForm"
                  class="q-mb-md "
                  @submit="placeFormSubmit">

                  <p class="q-mb-md col-2"  >Выберите город</p>
                  <!--                   @input="citySelected"-->
                  <q-select
                    outlined
                    v-model="unit.city"
                    use-input
                    hide-selected
                    fill-input

                    input-debounce="0"
                    label="Начните вводить"
                    :options="cities"
                    :option-label="(item) =>  item.city"
                    @filter="filterCity"
                    @input="citySelected"
                    lazy-rules
                    :rules="[val => val  || 'Выберите город из списка']">

                    <!--            <template v-slot:no-option>-->
                    <!--              <q-item>-->
                    <!--                <q-item-section class="text-grey">-->
                    <!--                  Город не найден-->
                    <!--                </q-item-section>-->
                    <!--              </q-item>-->
                    <!--            </template>-->
                    <template v-slot:option="scope">
                      <q-item
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >

                        <q-item-section>
                          <q-item-label v-html="scope.opt.city" />
                          <q-item-label caption>{{ scope.opt.region }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select><!--   city_id       -->

                  <q-btn color="primary" @click="$refs.placeForm.submit()" no-caps unelevated label="Продолжить"/>

                </q-form>
                {{unit.coords}}
                <yandex-map
                  :coords="unit.coords"
                  :class=" {ymapContanerHidden : !is_city_selected}"
                  zoom="10"
                  style="width: 100%; height: 440px; padding: 0;margin-bottom: 20px"
                  :cluster-options="{ 1: {clusterDisableClickZoom: true} }"
                  @click="mapClick"
                  :controls="['trafficControl']"

                  map-type="map">
                  <ymap-marker
                    markerId="1"
                    marker-type="Placemark"
                    :coords="unit.coords">
                  </ymap-marker>
                </yandex-map>
              </q-tab-panel>
              <q-tab-panel name="description" class="q-py-none">
                <q-form
                  ref="descriptionForm"
                  class="q-mb-md "
                  @submit="descriptionFormSubmit">
                  <p class="q-mb-sm">Описание техники</p>
                  <q-editor class="q-mb-sm" v-model="unit.description" min-height="5rem" />
                  <p class="q-mb-sm">Выберите фото техники</p>

                  <q-uploader
                    ref="images"
                    label="Выбранные фото"
                    multiple
                    flat
                    hide-upload-btn
                    accept=".jpg, image/*"
                    @added="checkImages"
                    @removed="checkImages"
                    class="full-width unit-images-uploader q-mb-md">
                    <template v-slot:list="scope">
                      <q-list separator>
                        <q-item v-for="file in scope.files" :key="file.name">
                          <q-item-section
                            v-if="file.__img"
                            thumbnail
                            class="gt-xs">
                            <img class="preview-img" :src="file.__img.src">
                          </q-item-section>
                          <q-item-section>
                            <q-item-label class="full-width ellipsis">
                              {{ file.name }}
                            </q-item-label>
                            <q-item-label caption>
                              {{ file.__sizeLabel }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section center side>
                            <q-btn
                              class="gt-xs"
                              size="12px"
                              flat
                              dense
                              round
                              icon="delete"
                              @click="scope.removeFile(file)"
                            />
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </template>
                  </q-uploader>

                  <p class="q-mb-sm">Подтвержающие документы</p>

                  <q-uploader
                    ref="imagesDocs"
                    label="Документы"
                    multiple
                    flat
                    hide-upload-btn
                    accept=".jpg, image/*"
                    class="full-width unit-images-uploader q-mb-md">
                    <template v-slot:list="scope">
                      <q-list separator>
                        <q-item v-for="file in scope.files" :key="file.name">
                          <q-item-section
                            v-if="file.__img"
                            thumbnail
                            class="gt-xs">
                            <img class="preview-img" :src="file.__img.src">
                          </q-item-section>
                          <q-item-section>
                            <q-item-label class="full-width ellipsis">
                              {{ file.name }}
                            </q-item-label>
                            <q-item-label caption>
                              {{ file.__sizeLabel }}
                            </q-item-label>
                          </q-item-section>
                          <q-item-section center side>
                            <q-btn
                              class="gt-xs"
                              size="12px"
                              flat
                              dense
                              round
                              icon="delete"
                              @click="scope.removeFile(file)"
                            />
                          </q-item-section>
                        </q-item>

                      </q-list>
                    </template>
                  </q-uploader>
                  <div v-if="$auth.user.balance >= unit.total_price" class="">
                    <q-btn   color="primary"
                             no-caps unelevated
                             :disable="!is_images_selected"
                             @click="$refs.descriptionForm.submit()"
                             :label="`Разместить технику за ${unit.total_price} руб`"/>
                  </div>

                  <div v-else>
                    <p>Стоимость размещения {{unit.total_price}} руб, на Вашем балансе : {{$auth.user.balance}} руб</p>
                    <q-btn color="primary" label="Пополнить баланс"/>
                  </div>
                </q-form>
              </q-tab-panel>


            </q-tab-panels>
          </template>

        </q-splitter>
      </div>
      <div class="col-4">
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

import {mapGetters} from "vuex";

export default {
  name: 'catalog',
  // components:{
  //   Header,
  //   Footer
  // },

  data () {
    return {
      tab: 'info',
      tab_filters_active:false,
      tab_place_active:false,
      tab_description_active:false,
      side_question:'',
      splitterModel: 30,
      cat_price: 0,
      city_coefficient: 0,
      cities:[],
      is_city_selected:false,
      is_images_selected:false,
      unit:{
        selectedType:'',
        name:'',
        year:'',
        rent_type:true,
        min_rent_time:1,
        rent_price:100,
        description:'',
        city:'',
        coords:[55,55],
        total_price: 0,
      },
      all_filters:{
        filter: []
      },
      selectedCategory:'',
      types:[],

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
      this.tab_place_active = true
      this.tab = 'place'
    },
    placeFormSubmit(){
      console.log('placeFormSubmit submit')
      this.tab_description_active = true
      this.tab = 'description'
    },
    descriptionFormSubmit(){
      console.log('descriptionFormSubmit submit')
      this.addUnit()

    },
    async addUnit(){
      let formData = new FormData()
      formData.set('unit', JSON.stringify(this.unit));
      formData.set('filters', JSON.stringify(this.all_filters.filter));
      this.$refs.images.files.forEach(img => {
        formData.append("images", img)
      })
      this.$refs.imagesDocs.files.forEach(img => {
        formData.append("docs_images", img)

      })
      const response = await this.$api({
        method: 'post',
        headers:{
          'content-type': 'multipart/form-data'
        },
        url: '/api/v1/technique/unit/add/',
        data: formData
      })
      console.log(response.data)
      this.$q.notify({
        message: 'Техника добавлена',
        color: 'positive',
        position:'top-right',
      })
      await this.$router.push('/profile/')
    },
    categorySelected(){
      this.unit.selectedType = null
      for (let i of this.categories){
        if (i.id === this.selectedCategory.id){
          this.cat_price = i.price
        }
      }
    },
    citySelected(){
      this.city_coefficient = parseFloat(this.cities.find(x => x.id === this.unit.city.id).coefficient)
      this.total_price = parseFloat(this.city_coefficient * this.cat_price)
      ymaps.geocode(this.cities.find(x => x.id === this.unit.city.id).city, {
        results: 1
      }).then( (res) => {
        var firstGeoObject = res.geoObjects.get(0)
        this.unit.coords = firstGeoObject.geometry.getCoordinates()
        this.is_city_selected = true
      });
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
    async typeSelected(){
      const  response = await this.$api.get(`/api/v1/technique/filters/${this.unit.selectedType.name_slug}/`)
      this.all_filters.filter = response.data
    },
    mapClick(e){
      this.unit.coords = e.get('coords');
    },
    checkImages(file){
      this.$refs.images.files.length>0 ? this.is_images_selected=true : this.is_images_selected=false
    }
  },

  computed:{
    ...mapGetters('categories',['categories']),
    filters_outlined(){
      let result = false
      for(let i of this.all_filters.filter){
        if(!i.value){
          return
        }
        result = true
      }
      return  result
    },


    info_text(){
      if (this.tab==='info'){
        this.side_question =  'Для чего это нужно?'
        let text= `<p>Заполните основную информацию о вашей техники, чтобы заказчикам было легче ее найти</p>`
        return text
      }
      if (this.tab==='filters'){
        this.side_question =  'Для чего это нужно?'
        let text= `<p>Заполните фильтры по которым Вашу технику будут искать заказчики</p>
                    <p class="text-primary text-bold">Все фильтры обязательны для заполнения</p>`
        return text
      }
      if (this.tab==='place'){
        this.side_question =  'Для чего это нужно?'
        let text= `<p>Выберете населенный пункт из списка в котором вы хотите сдавать технику</p>
                   <p>После выбора города, <span class="text-bold">по желанию</span>, Вы можете более точно указать размещение техники на карте</p>     `
        return text
      }
      if (this.tab==='description'){
        this.side_question =  'Для чего это нужно?'
        let text= `<p>Опишите особенности вашей техники, чтобы заказчикам было легче ее найти</p>
                    <p>Прикрепите фото</p>
                    <p>Прикрепите документы на технику, чтобы ее подтвердить.</p>
                    <p>Подтвержденная техника вызывает больше доверия</p>
                    <p class="text-primary text-bold">Прикрепление документов НЕ обязательно</p>
`

        return text
      }
    }
  },
}
</script>
<style lang="sass" scoped>
.ymap-container
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12)
  border-radius: 4px
.preview-img
  width: 150px
  height: 100px
  object-fit: contain
.order-tabs
  & .q-tab
    justify-content: flex-start
</style>
