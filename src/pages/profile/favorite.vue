<template>
  <q-page style="margin-bottom: 50px" class="container">
     <q-no-ssr>
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Оповещения" icon="notifications"   />
      </q-breadcrumbs>
    </div>
    <h1 class="text-bold text-h4">Избранное</h1>
    <div class="row">
      <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">

        <UnitCard v-for="unit in $auth.favorite"
                  :key="unit.id"
                  :unit="unit"
                  :category_slug="unit.type.name_slug"
        />
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
import UnitCard from "components/unit-card";
export default {
  name: 'catalog',
  components:{
    ProfileMenu,
     UnitCard,
  },



  data () {
    return {

    }
  }
}
</script>
<style lang="sass" scoped>

</style>
