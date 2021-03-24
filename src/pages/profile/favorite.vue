<template>
  <q-page style="margin-bottom: 50px" class="container">
    <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Профиль" icon="person" :to="{name:'profile_index'}"  />
        <q-breadcrumbs-el label="Оповещения" icon="notifications"   />
      </q-breadcrumbs>
    </div>
    <h1 class="text-bold text-h4">Избранное</h1>
    <div class="row">
      <div class="col-8 q-pr-lg">1</div>
      <div class="col-3 offset-1">
        <ProfileMenu/>
      </div>
    </div>

  </q-page>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'
import ProfileMenu from "components/user_profile_menu";
export default {
  name: 'catalog',
  components:{
    ProfileMenu
  },


  data () {
    return {

    }
  }
}
</script>
<style lang="sass" scoped>

</style>
