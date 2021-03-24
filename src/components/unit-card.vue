<template>
  <q-card
    class="q-mb-md"
    flat :class="[unit.is_vip ? 'bg-deep-orange-2' : 'bg-grey-2']">
    <q-card-section horizontal>
      <q-img
        :ratio="16/9"

        @click="$router.push(`/catalog/${category_slug}/${unit.name_slug}`)"
        class="col-lg-3 col-md-3 col-sm-4 col-xs-4 cursor-pointer"
        :src="unit.images[0].image_thumb">
        <q-badge  class="q-pa-sm unit-card__bagde" color="positive">Свободен</q-badge>
      </q-img>
      <q-card-section class="row col-lg-9 col-md-9 col-sm-7 col-xs-8">
         <q-card-section class="no-padding" :class="[$auth.loggedIn && $auth.user.is_customer ? 'col-lg-8 col-md-8 col-sm-9 col-xs-12':'col-lg-9 col-md-9 col-sm-9 col-xs-12']">
        <router-link class="no-underline" :to="`/catalog/${category_slug}/${unit.name_slug}`">
          <p class="text-h6 cursor-pointer q-mb-sm text-primary">{{unit.name}}, {{unit.year}}</p>
        </router-link>
        <p class="text-caption ">Мин. время заказа: от {{unit.min_rent_time}} {{unit.rent_type? 'час' : 'день'}}</p>
        <RentMsg class="q-mb-sm" :unit_id="unit.id" :owner_id="unit.owner"/>
      </q-card-section>
      <q-card-section class="no-padding col-lg-3 col-md-3 col-sm-10 col-xs-10">
        <p class="text-bold q-mb-sm">{{unit.rent_price}} &#8381;/ {{unit.rent_type? 'час' : 'день'}}</p>
        <p class="text-caption q-mb-none">{{unit.city}}</p>
        <p class="text-caption q-mb-none">{{unit.created_at | formatDate}}</p>
      </q-card-section>
      <q-card-actions
        v-if="$auth.loggedIn && $auth.user.is_customer"
        vertical
        class="no-padding justify-start col-lg-1 col-md-1 col-sm-1 col-xs-1 q-pr-xs-sm">
        <FavoriteAdd :unit_id="unit.id" :is_in_favorites="$auth.user.favorites.includes(unit.id)"/>
       <PrivateMsg :is_icon="true" :unit_id="unit.id" :owner_id="unit.owner"/>
      </q-card-actions>
      </q-card-section>

    </q-card-section>
  </q-card>
</template>

<script>
import { date } from 'quasar'

import FavoriteAdd from 'components/favorite_add'
import PrivateMsg from 'components/owner-message'
import RentMsg from 'components/rent-message'

export default {
  name: 'unit-card',
  props:['unit','category_slug'],
  components:{
    FavoriteAdd,
    PrivateMsg,
    RentMsg
  },
  data () {
    return {
    }
  },
  filters:{
    formatDate(val){
      return date.formatDate(val, 'DD/MM/YYYY, HH:mm')
    }
  },


}
</script>
<style lang="sass" scoped>
.unit-card__bagde
  height: 10px
  padding: 10px 5px
  top: 5px
  left: 5px
</style>
