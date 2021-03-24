<template>
  <q-card
    class="q-mb-md"
    flat :class="[unit.is_vip ? 'bg-deep-orange-2' : 'bg-grey-2']">
    <q-card-section horizontal>
      <q-img
        :ratio="4/3"
        @click="$router.push(`/catalog/${category_slug}/${unit.name_slug}`)"
        class="col-3 cursor-pointer"
        :src="unit.images[0].image_thumb">
        <q-badge  class="q-pa-sm unit-card__bagde" color="positive">Свободен</q-badge>
      </q-img>
      <q-card-section :class="[$auth.loggedIn && $auth.user.is_customer ? 'col-5':'col-6']">
        <router-link class="no-underline" :to="`/catalog/${category_slug}/${unit.name_slug}`">
          <p class="text-h6 cursor-pointer q-mb-sm text-primary">{{unit.name}}, {{unit.year}}</p>
        </router-link>
        <p class="text-caption ">Мин. время заказа: от {{unit.min_rent_time}} {{unit.rent_type? 'час' : 'день'}}</p>
        <RentMsg :unit_id="unit.id" :owner_id="unit.owner"/>
      </q-card-section>
      <q-card-section class="col-3">
        <p class="text-bold q-mb-sm">{{unit.rent_price}} &#8381;/ {{unit.rent_type? 'час' : 'день'}}</p>
        <p class="text-caption q-mb-none">{{unit.city}}</p>
        <p class="text-caption q-mb-none">{{unit.created_at | formatDate}}</p>
      </q-card-section>

      <q-card-actions
        v-if="$auth.loggedIn && $auth.user.is_customer"
        vertical
        class="justify-start col-1">
        <FavoriteAdd :unit_id="unit.id" :is_in_favorites="$auth.user.favorites.includes(unit.id)"/>
       <PrivateMsg :is_icon="true" :unit_id="unit.id" :owner_id="unit.owner"/>
      </q-card-actions>
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
