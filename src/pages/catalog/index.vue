<template>
  <q-page class="container">
    <h1 class="text-h3 text-bold text-center">Каталог техники</h1>
    <div class="grid grid-3 gap-md q-mb-xxl">
      <div
        v-for="(item,index) in categories"
        :key="item.id">
        <q-card class="rounded-borders bg-grey-2 "
                flat >
          <q-card-section
            horizontal>
            <q-card-section class="col-4 q-pr-none catalog-card"  >
              <p class="text-h5 text-bold">{{item.name}}</p>
            </q-card-section>
            <q-img
              class="col-8 q-img__bg-xr"
              contain
              ratio="16/9"
              :src="item.image"
            />
          </q-card-section>
        </q-card>
        <div
          :ref="'cat_'+index"
          :class="{'list-sliced':item.types.length > catShow }">
          <ul class="catalog-list">
            <li  class="main-catalog__item-list-item" v-for="(subcat,index) in item.types">
              <router-link
                :to="`/catalog/${subcat.name_slug}`">{{subcat.name}}
              </router-link>
            </li>
          </ul>
        </div>
        <p @click="removeClass(index)"
           class="show-btn"
           :ref="'show_btn'+index"
           v-if="item.types.length > catShow">Показать остальные {{item.types.length - catShow}} категорий
        </p>
      </div>
    </div>
  </q-page>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
  name: 'catalog_index',
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }) {
    return store.dispatch('categories/fetchCategories')
  },
  data () {
    return {
      catShow:4,
      listSliced:true,
    }
  },
  computed:{
    ...mapGetters('categories',['categories'])
  },
  methods:{
    removeClass(index){
      this.$refs[`cat_${index}`][0].classList.remove('list-sliced')
      this.$refs[`show_btn${index}`][0].classList.add('is-hidden')
    }
  }
}
</script>
<style lang="sass" scoped>
.catalog-card
  height: 200px
.list-sliced
  height: 120px
  overflow: hidden
.show-btn
  cursor: pointer
  color: $primary
  margin-bottom: 20px
  &.is-hidden
    display: none
</style>
