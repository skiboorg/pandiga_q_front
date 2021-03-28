<template>
  <q-page class="container flex flex-center">
    <q-card v-if="!recovery_panel" class="flex flex-center column q-pa-lg">
      <h3 class="text-h5 text-bold q-mb-sm">Вход</h3>
      <p class="login-text">Чтобы получить доступ к нашим сервисам, войдите, используя данные своего аккаунта </p>
      <q-form
        ref="loginForm"
        class="q-mb-sm q-mt-lg "
        @submit="loginFormSubmit">
        <q-input
          outlined
          :loading="is_loading"
          v-model="phone"
          label="Ваш телефон *"
          style="width: 300px"
          mask="+7(###)###-##-##"
          lazy-rules
          :rules="[ val => val && val.length > 15 || 'Нужно ввести корректный номер телефона']"
        />
        <q-input
          v-model="loginData.password"
          outlined

          :type="isPwd ? 'password' : 'text'"
          label="Введите пароль *"
          lazy-rules
          :rules="[ val => val && val.length > 0|| 'Введите пароль']">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input><!--    pass1      -->

      </q-form>
      <q-btn color="primary" @click="$refs.loginForm.submit()" class="q-py-sm q-mb-lg" style="width: 300px" label="Продолжить"/>
      <div class="text-center">
        <p class="text-bold q-mb-none">Нет аккаунта? <router-link class="text-caption no-underline text-underline" to="/register/">Регистрация</router-link> </p>
        <p class="text-bold">Забыли пароль? <a href="#" class="text-caption no-underline text-underline" @click.prevent="login_panel = false, recovery_panel=true">Восстановить</a> </p>
        <p class="login-text text-caption">Входя в аккаунт или создавая новый, вы соглашаетесь
          с нашими <a class="no-underline text-underline" href="">Правилами и условиями</a> и <a class="no-underline text-underline" href="">Положением
            о конфиденциальности</a></p>
      </div>
    </q-card>
    <q-card v-else class="flex flex-center column q-pa-lg">
      <h3 class="text-h5 text-bold q-mb-sm">Восстановление пароля</h3>
      <p class="login-text">Новый пароль будет выслан Вам на указанный номер телефона</p>
      <q-form
        ref="recoveryForm"
        class="q-mb-sm q-mt-lg "
        @submit="recoveryFormSubmit">
        <q-input
          outlined
          :loading="is_loading"
          v-model="recovery_phone"
          label="Ваш телефон *"
          style="width: 300px"
          mask="+7(###)###-##-##"
          lazy-rules
          :rules="[ val => val && val.length > 15 || 'Нужно ввести корректный номер телефона']"
        />

      </q-form>
      <div class="flex justify-between" style="width: 300px">
        <q-btn color="primary" :loading="is_loading" @click="$refs.recoveryForm.submit()" class="q-py-sm "  label="Восстановить"/>
        <q-btn color="primary" :loading="is_loading" class="q-py-sm " outline @click="recovery_panel=false"  label="Назад"/>
      </div>


    </q-card>
  </q-page>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'catalog',


  data () {
    return {
      isPwd:true,
      is_loading:false,
      recovery_panel:false,
      phone: null,
      recovery_phone: null,
      loginData:{
        email:null,
        password: null,
      }
    }
  },
  methods:{
    ...mapActions('auth',['loginUser']),
    loginFormSubmit(){
      this.getUserEmail()

    },
    recoveryFormSubmit(){
      this.recoverPassword()
    },
    async getUserEmail(){
      this.is_loading = true
      const response = await this.$api.post('/api/v1/user/getUserEmailbyPhone/',{phone:this.phone})
      console.log(response)
      if (response.data['result']){
        this.loginData.email = response.data.email
        this.loginUser(this.loginData)
      }else {
        this.$q.notify({
          message: 'Похоже, у нас нет аккаунта с этим телефоном',
          color: 'red',
          position:'top-right',
          actions: [
            { label: 'Создать аккаунт', color: 'white', handler: () => {this.$router.push('/register')} }
          ]
        })
        this.is_loading = false

      }
    },
    async recoverPassword(){
      this.is_loading=true
      const response = await this.$api.post('/api/v1/user/recover_password',{phone:this.recovery_phone})
      if (response.data['result']){
        this.$q.notify({
          message: 'Новый пароль отправлен в SMS сообщении',
          color: 'positive',
          position:'top-right',
        })
        this.phone=this.recovery_phone
        this.recovery_panel=false
      }else {
        this.$q.notify({
          message: 'Похоже, у нас нет аккаунта с этим телефоном',
          color: 'red',
          position:'top-right',
          actions: [
            { label: 'Создать аккаунт', color: 'white', handler: () => {this.$router.push('/register')} }
          ]
        })
      }
      this.is_loading=false
    }
  }
}
</script>
<style lang="sass" scoped>
.login-text
  max-width: 350px
  margin: 0 auto
  text-align: center
</style>
