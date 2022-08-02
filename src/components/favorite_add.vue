<template>
  <q-no-ssr>
  <q-btn
    v-if="!is_in_favorites"
    flat
    round
    @click="addFav"
    color="primary"
    icon="favorite_border" >
    <q-tooltip
      anchor="center right"
      self="center left"
      :offset="[10, 10]">В избранное
    </q-tooltip>
  </q-btn>
  <q-btn
    v-else
    flat
    @click="delFav"
    round
    color="primary"
    icon="favorite" >
    <q-tooltip
      anchor="center right"
      self="center left"
      :offset="[10, 10]">Удалить из избранного
    </q-tooltip>
  </q-btn>
</q-no-ssr>
</template>

<script>
import { mapActions} from 'vuex'
export default {
  props:['unit_id','is_in_favorites'],
  data () {
    return {
    }
  },
  methods:{
    ...mapActions('auth',['getUser']),
    async addFav(){
      const response = await this.$api.post(`/api/v1/user/fav_add/${this.unit_id}`)
      await this.getUser(false)
    },
    async delFav(){
        const response = await this.$api.post(`/api/v1/user/fav_del/${this.unit_id}`)
        await this.getUser(false)
      },
  }
}
</script>
