<template>
  <q-page class="container">
    <q-inner-loading :showing="!technique_type.name">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
    <div v-if="technique_type.name" class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="las la-home" to="/" />
        <q-breadcrumbs-el label="Каталог" icon="las la-truck" to="/catalog" />
        <q-breadcrumbs-el :label="technique_type.name" icon="las la-list" />
      </q-breadcrumbs>
    </div>
    <div class="flex items-center justify-between wrap">
       <h1 ref="top" class="text-h3 text-bold q-mt-sm">{{technique_type.name}}</h1>
      <q-btn class="lt-md" @click="filtersModal=true" icon="filter_list" round color="primary"/>
    </div>

    <!--   catalog wrapper start-->
    <div class="row q-mb-xl q-col-gutter-md">
      <!--   catalog units start-->
      <div class="col-lg-8 col-md-8 col-sm-12">
        <UnitCard v-for="unit in technique_units"
                  :key="unit.id"
                  :unit="unit"
                  :category_slug="technique_type.name_slug"
        />
        <q-pagination
          unelevated
          outline
          v-if="page_count>1"
          class="q-py-lg"
          v-model="current_page"
          @click="paginatorChange"
          :max="page_count"
        />
      </div>
      <!--   catalog units end-->
      <!--   catalog filters start-->
      <div v-if="technique_type.name" class="col-lg-4 col-md-4 col-sm-12 gt-sm ">
        <div class=" filters-block q-pa-md bg-grey-2">
          <div class="filter-group " v-for="(filter,index) in all_filters.filter">
            <q-select
              v-if="filter.type==='select'"
              outlined

              v-model="filter.value"

              dense
              fill-input
              input-debounce="0"
              class="q-mb-sm bg-white"
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
              <q-btn-toggle  unelevated no-caps   v-model="filter.value" toggle-color="primary"
                                :options="filter.values" />
            </div>

          </div>
          <div  class="flex items-center justify-start q-mb-sm">
            <p class="q-mr-sm q-mb-none  text-bold">Аренда по</p>
            <q-btn-toggle unelevated no-caps v-model="rent_type" toggle-color="primary"
                          :options="[
              {label: 'часам', value: '1'},
              {label: 'дням', value: '0'},
          ]" />
          </div>
          <div  class="flex items-center justify-between q-mb-sm">
            <p class="q-mr-sm q-mb-none text-bold" style="flex-basis: 50%">Время аренды {{rent_type==='1' ? '(часы)' : '(дни)'}}</p>

            <q-input outlined dense style="flex-basis: 20%"  v-model="rent_time_from" label="от" />
            <q-input outlined dense style="flex-basis: 20%"   v-model="rent_time_to" label="до" />

          </div>
          <div  class="flex items-center justify-between q-mb-lg">
            <p class="q-mr-sm q-mb-none text-bold" style="flex-basis: 50%">Стоимость {{rent_type==='1' ? '(часы)' : '(дни)'}}</p>
            <q-input dense outlined style="flex-basis: 20%" type="number"  v-model.number="rent_price_from" label="от" />
            <q-input dense outlined style="flex-basis: 20%"   v-model="rent_price_to" label="до" />
          </div>
           <q-select
              outlined
              dense
              v-model="city"
              use-input
              hide-selected
              fill-input
              class="bg-grey-1 rounded-borders q-mb-md"
              input-debounce="0"
              label="Город (начните вводить)"
              :options="cities"
              :option-label="(item) =>  item.city"
              @filter="filterCity"
            >
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
            </q-select>
          <div class="flex justify-between">
            <q-btn unelevated no-caps @click="submitForm(1)"  color="primary"  label="Поиск"/>
            <q-btn unelevated no-caps outline @click="get_filters" label="Сбросить фильтры"/>
          </div>
        </div>
      </div>
      <!--   catalog filters end-->
    </div>
    <!--   catalog wrapper end-->
   <q-dialog full-height
    v-model="filtersModal"
    full-width
    :maximized="true"
    transition-show="slide-left"
    transition-hide="slide-right">

    <q-card class="full-height" style="width: 300px">
      <q-toolbar class="toolbar bg-white">
        <p class="text-h6 no-margin">Фильтры</p>
        <q-space/>
        <q-icon v-close-popup size="md" name="close"/>
      </q-toolbar>
      <q-separator class="q-my-sm"/>
      <q-card-section>
         <div class="filter-group" v-for="(filter,index) in all_filters.filter">
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
              <q-btn-toggle  unelevated   v-model="filter.value" toggle-color="primary"
                                :options="filter.values" />
            </div>

          </div>
          <div  class="flex items-center justify-start q-mb-sm">
            <p class="q-mr-sm q-mb-none  text-bold">Аренда по</p>
            <q-btn-toggle v-model="rent_type" toggle-color="primary"
                          :options="[
              {label: 'часам', value: '1'},
              {label: 'дням', value: '0'},
          ]" />
          </div>
          <div  class="flex items-center justify-between q-mb-sm">
            <p class="q-mr-sm q-mb-none text-bold" style="flex-basis: 50%">Время аренды {{rent_type==='1' ? '(часы)' : '(дни)'}}</p>

            <q-input dense style="flex-basis: 20%" filled v-model="rent_time_from" label="от" />
            <q-input dense style="flex-basis: 20%"  filled v-model="rent_time_to" label="до" />

          </div>
          <div  class="flex items-center justify-between q-mb-lg">
            <p class="q-mr-sm q-mb-none text-bold" style="flex-basis: 50%">Стоимость {{rent_type==='1' ? '(часы)' : '(дни)'}}</p>
            <q-input dense style="flex-basis: 20%" type="number" filled v-model.number="rent_price_from" label="от" />
            <q-input dense style="flex-basis: 20%"  filled v-model="rent_price_to" label="до" />
          </div>
           <q-select
              filled
              dense
              v-model="city"
              use-input
              hide-selected
              fill-input
              class="bg-grey-1 rounded-borders q-mb-md"
              input-debounce="0"
              label="Город (начните вводить)"
              :options="cities"
              :option-label="(item) =>  item.city"
              @filter="filterCity"
            >
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
            </q-select>
          <div class="flex justify-between">
            <q-btn @click="submitForm(1)"  color="primary"  label="Поиск"/>
            <q-btn @click="get_filters" label="Сбросить фильтры"/>
          </div>

      </q-card-section>
    </q-card>

  </q-dialog>
  </q-page>
</template>

<script>
import UnitCard from "components/unit-card";
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll

export default {
  name: 'catalog_inner',
  components:{
    UnitCard,
  },

  data () {
    return {
      filtersModal:false,
      technique_units:[],
      technique_type:[],
      page_count:0,
      current_page:1,
      items_count:0,
      links:[],
      all_filters:{
        filter: []
      },
      is_filtered:false,
      private_message: '',
      loading: false,
      rentModal: false,
      is_queryFilter_ok: false,
      rent_time_to:'',
      rent_time_from:'',
      rent_price_from:'',
      rent_price_to:'',
      rent_type:'1',
      city:{id:0},
      cities:[],
      rentMsg_send:false,
      rentData:{
        technique_id:0,
        owner_id:0,
        type:'true',
        date: '',
        dates: '',
        time:'',
      },
      order_by: [
        {
          value: '-created_at',
          label: 'По дате (сначала новые)'
        },
        {
          value: 'created_at',
          label: 'По дате (сначала старые)'
        },
        {
          value: 'rent_price',
          label: 'По стоимости (цена вниз)'
        },
        {
          value: '-rent_price',
          label: 'По стоимости (цена вверх)'
        },
      ],
      order_by_value: '',
    }

  },
  async beforeMount() {
    await this.page_init()
  },
  methods:{
    filterCity (val, update, abort) {
      update(async() => {
        if (val && val.length >2 ) {
          const needle = val.toLowerCase()
          const result = await this.$api.get(`/api/v1/city/search?city=${val}`)
          this.cities = result.data
        }
      })
    },
    async get_filters(){
      const  response_filters = await this.$api.get(`/api/v1/technique/filters/${this.$route.params.category_slug}/`)
      this.all_filters.filter = response_filters.data
    },
    async page_init(){
      await this.get_filters()
      const  response_type = await this.$api.get(`/api/v1/technique/type/${this.$route.params.category_slug}`)
      this.technique_type = response_type.data

      console.log(this.$route.query.city)
      if (this.$route.query.city && this.$route.query.city !=='undefined'){
        console.log('cittyy')
        //has city
        this.city.id = parseInt(this.$route.query.city)
      }
      if (this.$route.query.filter){
        //has filter
        try{
          let currentFilter = this.all_filters.filter.filter(x => x.id === parseInt(this.$route.query.filter))
          let filterValue = currentFilter[0].values.filter(x=>x.id===parseInt(this.$route.query.value))
          currentFilter[0].value = filterValue[0]
          this.is_queryFilter_ok = true
          await this.submitForm(1)
        }catch (e){
          console.log('filter error',e)
        }
      }
      if (this.city.id>0){
        await this.submitForm(1)
      }else {
        const  response_units = await this.$api.get(`/api/v1/technique/units?type=${this.$route.params.category_slug}`)
        this.technique_units = response_units.data.results
        this.page_count = response_units.data.page_count
        this.links = response_units.data.links
        this.items_count = this.technique_units.length
      }
    },
    async paginatorChange(){
      this.$q.loading.show()
      if (!this.is_filtered){
        const response = await this.$api.get(`/api/v1/technique/units?page=${this.current_page}&type=${this.$route.params.category_slug}`)
        this.technique_units = response.data.results
        this.scrollToElement(this.$refs.top)
        this.$q.loading.hide()
      }
      else {
        await this.submitForm(this.current_page)
      }
    },
    async submitForm(page){
      this.$q.loading.show()
      await this.$api({
        method: 'post',
        headers:{
          'Content-Type':'application/json'
        },
        url: `/api/v1/technique/filter/?page=${page}`,
        data: JSON.stringify({
            technique_type:this.technique_type.name_slug,
            rent_time_to:(this.rent_time_to ? this.rent_time_to : 1000),
            rent_time_from:(this.rent_time_from ? this.rent_time_from : 0),
            rent_price_from:(this.rent_price_from ? this.rent_price_from : 0),
            rent_price_to:(this.rent_price_to ? this.rent_price_to : 1000000),
            rent_type:  this.rent_type ,
            city:  this.city,
            order_by:  this.order_by_value  ,
            'primary_filter': this.all_filters.filter
          }
        )
      }).then((response) => {
        // handle success
        console.log('success');
        console.log(response.data.results);
        this.technique_units =response.data.results
        this.is_filtered = true
        this.page_count = response.data.page_count
        this.scrollToElement(this.$refs.top)
        this.$q.loading.hide()
        this.filtersModal = false


      })
        .catch(function (error) {
          // handle error
          console.log(error);
          this.$q.loading.hide()
        })
        .then(function () {
          // always executed
        });
    },
    scrollToElement (el) {
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 300
      setScrollPosition(target, offset, duration)
    }
  }
}
</script>
<style lang="sass" scoped>
.filters-block
  height: fit-content
  position: sticky
  top: 110px
</style>
