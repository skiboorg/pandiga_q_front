<template>
  <q-page class="container flex flex-center">
    <q-stepper
      v-model="step"
      header-nav
      flat bordered
      ref="stepper"
      color="primary"
      animated>
      <q-step
        :name="1"
        title="Тип аккаунта"
        icon="smartphone"
        :done="step > 1"
        :header-nav="step > 1">
        <p>Чтобы получить доступ к нашим сервисам, зарегистрируйтесь</p>
        <div class="flex items-center justify-start q-mb-md">
          <p class="q-mb-none q-mr-sm">Я хочу </p>
          <q-btn-toggle
            unelevated
            no-caps
            v-model="registerForm.is_customer"
            toggle-color="primary"
            :options="[
            {label: 'снять технику', value: true},
            {label: 'сдать технику', value: false},
          ]"/>
        </div>
        <div class="flex items-center justify-start q-mb-md">
          <p class="q-mb-none q-mr-sm">Я регистрируюсь как </p>
          <q-btn-toggle
            unelevated
            no-caps
            v-model="registerForm.is_person"
            toggle-color="primary"
            :options="[
            {label: 'физическое лицо', value: true},
            {label: 'юридическое лицо', value: false},
          ]"/>
        </div>
        <p >Введите Ваш номер телефона:</p>
        <!--        @submit="onSubmit" -->
        <q-form
          ref="step1Form"
          class="q-mt-md"
          @submit="step1FormSubmit">
          <q-input
            outlined
            :loading="is_loading"
            v-model="registerForm.phone"
            label="Номер телефона"
            mask="+7(###)###-##-##"
            lazy-rules
            :rules="[ val => val && val.length > 15 || 'Нужно ввести корректный номер телефона']"
            hint="Вам поступит звонок и робот-помощник назовет код"
          />
        </q-form>
        <q-banner v-if="phone_error" inline-actions class="text-white bg-red q-mt-lg">
          {{phone_error}}
          <template v-slot:action>
            <q-btn flat color="white" @click="phone_error=null" label="Ок" />
          </template>
        </q-banner>
        <q-stepper-navigation class="flex items-center justify-between">
          <q-btn
            @click="$refs.step1Form.submit()"
            color="primary"
            unelevated
            no-caps
            label="Продолжить"
            :loading="is_loading"
          >
            <template v-slot:loading>
              <q-spinner />
            </template>
          </q-btn>
          <p class="login-box__no-acc no-margin">Уже есть аккаунт? <router-link class="text-underline no-underline text-caption" to="/login">Войти</router-link></p>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Подтверждение номера"
        icon="sms"
        :done="step > 2"
        :header-nav="step > 2">
        <p class="login-box__subtitle">Ожидайте звонок на ваш номер телефона <span class="text-bold">{{registerForm.phone}}</span>
           с голосовым кодом подтверждения</p>
        <q-form
          ref="step2Form"
          class="q-mt-md"
          @submit="step2FormSubmit">
          <q-input
            outlined
            :loading="is_loading"
            v-model="entered_sms_code"
            label="Код подтверждения"
            mask="###"
            lazy-rules
            :rules="[val => val===sms_code || 'Введенный код не совпадает']"

          />
        </q-form>


        <q-stepper-navigation>
          <q-btn @click="$refs.step2Form.submit()" color="primary" label="Продолжить" />
          <q-btn flat @click="step = 1" color="primary" label="Назад" class="q-ml-sm" />
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Личные данные"
        icon="person"
        :header-nav="step > 3">
        <p>Все поля обязательны для заполнения</p>
        <q-form
          ref="step3Form"
          class="q-mt-md"
          @submit="step3FormSubmit">
          <q-input
            v-if="registerForm.is_person"
            outlined
            v-model="registerForm.first_name"
            label="Ваше имя *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Это обязательное поле']"/><!--  first_name      -->
          <q-input
            v-else
            outlined
            v-model="registerForm.organization_name"
            label="Название организации *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Это обязательное поле']"/><!--  organization_name      -->
          <q-input
            outlined
            v-if="registerForm.is_person"
            v-model="registerForm.last_name"
            label="Ваша фамилия *"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Это обязательное поле']"/><!--  last_name        -->
          <q-input
            outlined
            v-else
            v-model="registerForm.inn"
            label="ИНН *"
            mask="############"
            lazy-rules
            :rules="[ val => val && val.length > 11 || 'Это обязательное поле']"/><!--   inn       -->
          <q-input
            outlined

            v-model="registerForm.email"
            label="Ваш EMail *"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'Это обязательное поле',
              val => email_re.test(String(val)) || 'Ввведите корректный E-Mail'
              ]"/><!--    email      -->
          {{registerForm.city_id}}
          <q-select
            behavior="menu"
            outlined
            v-model="registerForm.city"
            use-input
            hide-selected
            fill-input
            class="q-mb-sm"
            input-debounce="0"
            label="Ваш город (начните вводить)"
            :options="cities"
            :option-label="(item) =>  item.city"

            @filter="filterCity"
            lazy-rules
            :rules="[val => val !== null || 'Выберите город из списка']">
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Город не найден
                            </q-item-section>
                          </q-item>
                        </template>
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
              >
                <q-item-section>
                  <q-item-label v-html="scope.opt.city" />
                  <q-item-label caption>{{ scope.opt.region }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select><!--   city_id       -->
          <q-input
            v-model="registerForm.password1"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Введите пароль *"
            lazy-rules
            :rules="[ val => val && val.length > 7|| 'Не менее 8 символов']">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input><!--    pass1      -->
          <q-input
            v-model="registerForm.password2"
            outlined
            :type="isPwd ? 'password' : 'text'"
            label="Повторите пароль *"
            lazy-rules
            :rules="[ val => val === registerForm.password1 || 'Пароли не совпадают']">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input><!--    pass2      -->
        </q-form>
        <q-stepper-navigation>
          <q-btn
            v-if="!register_done"
            color="primary"
            @click="$refs.step3Form.submit()"
            label="Регистрация"
            :loading="is_loading"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-page>
</template>

<script>
export default {
  name: 'register',
  meta :{
    title: 'Регистрация | PANDIGA - Клубная аренда техники',
    meta: {
      description: { name: 'description', content: 'PANDIGA — это рекомендательный сервис по аренде ' +
          'абсолютно любой технике и строительному инструменту, а так же подбору специалистов для' +
          ' выполнения абсолютно любой работы.' },
    },
  },
  data () {
    return {
      step: 1,
      is_loading:false,
      isPwd:true,
      register_done:false,
      phone_error:null,
      email_re:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      sms_code:null,
      entered_sms_code:null,
      cities:[],
      registerForm: {
        is_customer: true,
        is_person: true,
        phone: '',
        city:null,
        first_name:'',
        last_name:'',
        organization_name:null,
        inn:null,
        password1:'',
        password2:'',
        email:''
      },
    }
  },
  methods:{
    step1FormSubmit(){
      this.checkUserPhone()
    },
    step2FormSubmit(){
      this.step = this.step +1
    },
    step3FormSubmit(){
      this.is_loading = true
      this.registerUser()
    },
    registerUser(){
      this.$api.post('/auth/users/',{
        phone:this.registerForm.phone,
        password:this.registerForm.password2,
        email:this.registerForm.email,
        first_name:this.registerForm.first_name,// ? this.passwordForm.first_name : 'none',
        last_name:this.registerForm.last_name,// ? this.passwordForm.last_name : 'none',
        city:this.registerForm.city.id,
        is_person:this.registerForm.is_person,
        is_customer:this.registerForm.is_customer,
        organization_name:this.registerForm.organization_name,// ? this.passwordForm.organization_name : 'none',
        inn:this.registerForm.inn,// ? this.passwordForm.inn : 'none',
      }) .then((response) => {
        if (response.status === 201){
          this.register_done = true
          this.$q.notify({
            message: 'Вы успешно зарегистрированы',
            color: 'positive',
            position:'top-right',
          })
          this.$router.push('/login')
        }
      })
        .catch(error => {
          if(error.response.data['password']){
            for(let i of error.response.data['password']){
              this.$q.notify({
                message: i.toUpperCase(),
                position:'top-right',
                color: 'red'
              })
            }
          }
          if(error.response.data['email']){
            this.$q.notify({
              message: error.response.data['email'][0].toUpperCase(),
              position:'top-right',
              color: 'red'
            })
          }
          this.is_loading = false
        });
    },
    checkUserPhone(){
      this.is_loading = true
      this.phone_error = null
      this.$api.post('/api/v1/user/getUserEmailbyPhone/',{phone:this.registerForm.phone}).then(responce =>{
        if (responce.data['result']){
          this.$q.notify({
            message: 'Похоже, у нас уже зарегистрирован аккаунт с этим телефоном.',
            position:'top-right',
            color: 'red',
            actions: [
              { label: 'Войти в аккаунт', color: 'white', handler: () => {this.$router.push('/login')} }
            ]
          })
          this.is_loading = false
        }else{
          this.sendSMS()
        }
      })
    },
    sendSMS(){
      this.$api.post('/api/v1/user/sendSMS/',{phone:this.registerForm.phone})
        .then((response) => {
          if (response.data['result']){
            this.sms_code=response.data['code']
            this.step = this.step +1
          }
          else {
            this.$q.notify({
              message: 'Похоже, вы ввели некорректный номер телефона',
              position:'top-right',
              color: 'red'
            })
          }
        })
        .catch(function (error) {

        })
      this.is_loading = false
      //this.sms_code='0000'
      //this.step = this.step +1
    },
    filterCity (val, update, abort) {
      // call abort() at any time if you can't retrieve data somehow
      update(async() => {
        if (val && val.length >1 ) {
          const needle = val.toLowerCase()
          const result = await this.$api.get(`/api/v1/city/search?city=${val}`)
          this.cities = result.data
        }
      })
    },
  }
}
</script>
<style lang="sass">
@media (max-width: 630px)
  .q-stepper__header
    display: none

</style>
