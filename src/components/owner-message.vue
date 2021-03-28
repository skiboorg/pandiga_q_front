<template>
  <q-no-ssr>
  <q-btn
    v-if="$auth.loggedIn && $auth.user.is_customer"
    :flat="is_icon"
    :round="is_icon"
    color="primary"
    :label="is_icon ? null:'Написать владельцу'  "
    icon="chat" >
    <q-tooltip v-if="is_icon"
      anchor="center right"
      self="center left"
      :offset="[10, 10]">Написать
    </q-tooltip>
    <q-menu ref="messageMenu" :fit="!is_icon">
      <q-list>
        <q-item class="flex column">
          <q-input
            v-model="message"
            dense
            class="q-mb-sm"
            filled
            autogrow
          />
          <q-btn  @click="sendMsg" :loading="loading" color="primary" label="отправить">
             <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                </template>
          </q-btn>
        </q-item>

      </q-list>
    </q-menu>
  </q-btn>
</q-no-ssr>
</template>

<script>
import { mapActions} from 'vuex'
export default {
  props:['is_icon','owner_id','unit_id'],
  data () {
    return {
      message:null,
      loading:false
    }
  },
  methods:{
    async sendMsg(owner_id,is_rent_msg,unit_id){
      this.loading=true
      await this.$api.post(`/api/v1/chat/new_message/${this.owner_id}`,{message:this.message,isRentMessage:false,rentUnit:this.unit_id})
      this.message = null
      this.$refs.messageMenu.hide()
      this.$q.notify({
            message: 'Сообщение отправлено',
            color: 'positive',
            position:'top-right',
          })
      this.loading=false
    },
  }
}
</script>
