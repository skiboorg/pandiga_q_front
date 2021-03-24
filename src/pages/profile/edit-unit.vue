<template>
  <q-page style="margin-bottom: 50px" class="container">
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Редактирование" icon="edit"   />
      </q-breadcrumbs>
    </div>
    <h3 class="text-bold text-h5">Общая информация</h3>
    <div class="row">
      <div class="col-lg-8 col-md-12 col-sm-12 col-xs-12">

        <q-form
          ref="filterForm"
          class="q-mb-sm ">
          <!--           @submit="filterFormSubmit"-->
          <q-input
            ref="input"
            filled
            v-model="unit.name"
            label="Название техники *"
            :rules="[
                    val => !!val || 'Это обязательное поле']"
            lazy-rules
          />
          <q-input
            ref="input"
            filled
            v-model="unit.year"
            label="Год выпуска *"
            mask="####"
            :rules="[
                    val => !!val && val.length >= 4 || 'Это обязательное поле не менее 4х цифр']"
            lazy-rules
          />
          <div  class="q-gutter-sm row items-center q-mb-sm">
            <p class="col-3  q-mb-none ">Вид аренды</p>
            <q-btn-toggle v-model="unit.rent_type" toggle-color="primary"
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
              filled
              style="max-width: 100px"/>
          </div>
          <div  class="q-gutter-sm row items-center q-mb-sm">
            <p class="col-3 q-mb-none ">Стоимость аренды в ({{unit.rent_type ? 'часов' : 'суток'}})</p>
            <q-input
              v-model.number="unit.rent_price"
              type="number"
              dense
              filled
              style="max-width: 100px"/>
          </div>
          <h3 class="text-bold text-h5">Фильтры</h3>
          <div class="filter-group" v-for="(filter,index) in unit.filter">
            <q-select
              v-if="filter.type==='select'"
              filled
              v-model="filter.value"
              dense
              fill-input
              input-debounce="0"
              class="q-mb-sm"
              :options="filter.values"
              :option-label="(item) =>  item.label"
              :label="filter.placeholder">
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
              <q-btn-toggle     v-model="filter.value" toggle-color="primary"
                                :options="filter.values" />
            </div>

          </div>
          <h3 class="text-bold text-h5">Местонахождение</h3>
          <p> Текущее местоположение: <span class="text-bold">г. {{unit.city}}</span></p>

           <q-select
                    outlined
                    v-model="city"
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

          <h3 class="text-bold text-h5">Описание</h3>

           <q-editor class="q-mb-xl" v-model="unit.description" min-height="10rem" />

          <!--           @click="$refs.filterForm.submit()" :disable="!filters_filled" :label="filters_filled? 'Продолжить' : 'Заполните все фильтры'"-->
          <q-btn color="primary" @click="editUnit" label="Сохранить"/>
        </q-form>
      </div>
      <div class="col-3 offset-1 gt-md">
        <ProfileMenu/>
      </div>
    </div>

  </q-page>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import ProfileMenu from "components/user_profile_menu";
import {api} from "boot/axios";
export default {
  name: 'catalog',
  components:{
    ProfileMenu
  },


  data () {
    return {
      unit:{
        coords:[]
      },
      city:{},
      is_city_selected:true,
      cities:[]

    }
  },
  async created() {
    await this.page_init()
  },

  methods:{
    async page_init(){
      const  response = await this.$api.get(`/api/v1/technique/unit_edit/${this.$route.params.uuid}`)
      this.unit = response.data
      console.log(this.unit.coords)
      this.unit.coords = this.unit.coords.replace('[','').replace(']','').split(',')
      for (let i of this.unit.filter_value){
        let filter = this.unit.filter.find(x=> x.id === i.filter)
        if (filter.type !== 'radio'){
          filter.value=i
        }else{
          filter.value=i.value
        }
      }
    },
    async editUnit(){
      let formData = new FormData()
      formData.set('unit_id', JSON.stringify(this.unit.id));
      formData.set('unit', JSON.stringify(this.unit));
      formData.set('filters', JSON.stringify(this.unit.filter));
      formData.set('city', JSON.stringify(this.city));
      // this.$refs.images.files.forEach(img => {
      //   formData.append("images", img)
      // })
      // this.$refs.imagesDocs.files.forEach(img => {
      //   formData.append("docs_images", img)
      //
      // })
      const response = await this.$api({
        method: 'post',
        headers:{
          'content-type': 'multipart/form-data'
        },
        url: '/api/v1/technique/unit/edit/',
        data: formData
      })
      console.log(response.data)
    },
    citySelected(){

      ymaps.geocode(this.cities.find(x => x.id === this.city.id).city, {
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
    mapClick(e){
      this.unit.coords = e.get('coords');
    },
  }
}
</script>
<style lang="sass" scoped>

</style>
