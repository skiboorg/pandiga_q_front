<template>
  <q-card class="profile-menu">
     <q-list   class="rounded-borders text-primary">

                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_index'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
                      <q-item-section>Профиль</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'"  :to="{name:'profile_notifications'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="notifications_active" /></q-item-section>
                      <q-item-section>Оповещения</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_chats'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="chat" /></q-item-section>
                      <q-item-section>Сообщения</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_favorite'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="favorite" /></q-item-section>
                      <q-item-section>Избранное</q-item-section>
                    </q-item>
                    <q-item v-if="$auth.user.is_customer" clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_orders'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="list" /></q-item-section>
                      <q-item-section>Заявки</q-item-section>
                    </q-item>
                    <q-item v-else clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_applies'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="view_list" /></q-item-section>
                      <q-item-section>Мои предложения</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_refferal'}"  @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="people_alt" /></q-item-section>
                      <q-item-section>Партнеры</q-item-section>
                    </q-item>
                    <q-item clickable  v-ripple :active="link === 'inbox'" :to="{name:'profile_balance'}" @click="link = 'inbox'" active-class="my-menu-link">
                      <q-item-section avatar><q-icon name="local_atm" /></q-item-section>
                      <q-item-section>Баланс</q-item-section>
                    </q-item>


                  </q-list>
  </q-card>

</template>

<script>

export default {

  data () {
    return {
      link:''
    }
  },

}
</script>
<style lang="sass">
.profile-menu
  position: sticky
  top: 120px
</style>
