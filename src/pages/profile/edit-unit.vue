<template>
  <q-page style="margin-bottom: 50px" class="container">
      <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Редактирование" icon="edit"   />
      </q-breadcrumbs>
    </div>
    <h3 class="text-bold text-h5">Общая информация</h3>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

        <q-form
          ref="filterForm"
          class="q-mb-sm ">
          <!--           @submit="filterFormSubmit"-->
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
                                      {label: 'По километрам', value: null},
                                  ]" />
          </div>
          <div v-if="unit.rent_type !== null">
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
          </div>
          <div v-else>
            <div  class="q-gutter-sm row items-center q-mb-sm">
              <p class="col-3 q-mb-none ">Стоимость километра</p>
              <q-input
                v-model.number="unit.rent_price"
                type="number"
                dense
                outlined
                style="max-width: 100px"/>
            </div>
          </div>
          <h3 class="text-bold text-h5">Фильтры</h3>
          <div class="filter-group" v-for="(filter,index) in unit.filter">
            <q-select
              behavior="menu"
              v-if="filter.type==='select'"
              outlined
              v-model="filter.value"

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
              <q-btn-toggle   no-caps unelevated  v-model="filter.value" toggle-color="primary"
                                :options="filter.values" />
            </div>

          </div>
          <h3 class="text-bold text-h5">Местонахождение</h3>
          <p> Текущее местоположение: <span class="text-bold">г. {{unit.city}}</span></p>

           <q-select
             behavior="menu"
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
          <h3 class="text-bold text-h5">Фото техники</h3>
          <div class="row q-mb-md">
            <div class="col-12 col-sm-6">
              <q-file accept="image" v-model="new_file" label="Выберите фото для добавления" outlined class="q-mb-md"/>
              <q-btn color="primary" :loading="is_loading" :disable="!new_file" @click="imageAction(null,'add')" no-caps outline label="Добавить фото"/>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-6 col-sm-3 col-md-2" v-for="img in unit.images" :key="img.id">
              <q-card flat bordered class="full-height cursor-pointer " :class="img.is_main ? 'border-red' : ''">
                <q-card-section class="q-pb-none">
                  <q-img :ratio="1" fit="contain" :src="img.image_thumb"/>
                </q-card-section>
                <q-card-section class="q-pb-none">
                  <p v-if="img.is_main" class="text-caption text-grey-8 text-center q-mb-none">Основная</p>
                  <p v-else class="text-caption text-grey-8 text-center q-mb-none">Не основная</p>
                </q-card-section>
                <q-card-actions class="flex items-center justify-between">
                  <q-btn size="10px" :loading="is_loading" @click="imageAction(img.id,'main')" flat rounded color="primary" no-caps :disable="img.is_main" label="Cделать основной"/>
                  <q-btn size="10px" :loading="is_loading" @click="imageAction(img.id,'delete')" flat round color="primary" icon="las la-trash"/>
                </q-card-actions>
              </q-card>

            </div>
          </div>
          <h3 class="text-bold text-h5">Описание</h3>

           <q-editor class="q-mb-lg" v-model="unit.description" min-height="10rem" />

          <!--           @click="$refs.filterForm.submit()" :disable="!filters_outlined" :label="filters_outlined? 'Продолжить' : 'Заполните все фильтры'"-->


          <q-btn color="primary" @click="editUnit" no-caps outline :loading="is_loading" label="Сохранить изменения"/>
        </q-form>
      </div>
<!--      <div class="col-3 offset-1 gt-md">-->
<!--        <ProfileMenu/>-->
<!--      </div>-->
    </div>
      </q-no-ssr>
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
      is_loading:false,
      new_file:null,
      cities:[]

    }
  },
  async created() {
    await this.page_init()
  },

  methods:{
    async imageAction(img_id,action){
      this.is_loading = !this.is_loading
      let formData = new FormData()
      formData.set('unit_id', JSON.stringify(this.unit.id));
      formData.set('img_id', JSON.stringify(img_id));
      formData.set('action', JSON.stringify(action));
      formData.append('file', this.new_file);
      const response = await this.$api({
        method: 'post',
        headers:{
          'content-type': 'multipart/form-data'
        },
        url: '/api/v1/technique/image_action',
        data: formData
      })
      console.log(response.data)
      if (response.data.success){
        this.$q.notify({
          message: response.data.message,
          color: 'positive',
          position:'top-right',
        })
        const  response_unit = await this.$api.get(`/api/v1/technique/unit_edit/${this.$route.params.uuid}`)
        this.unit.images = response_unit.data.images
        this.new_file = null
      }else {
        this.$q.notify({
          message: response.data.message,
          color: 'negative',
          position:'top-right',
        })
      }
      this.is_loading = !this.is_loading



    },
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
      this.$q.notify({
        message: 'Информация обновлена',
        color: 'positive',
        position:'top-right',
      })
      await this.$router.push('/profile/')
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
.border-red
  border-color: $primary !important
</style>
