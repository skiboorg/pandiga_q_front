<template>
  <footer class="bg-grey-10">
    <div class="container">
      <div class="row q-py-lg q-col-gutter-md">
        <div class="col-md-3 col-sm-4 q-mb-lg">
          <img style="width: 178px" src="~assets/logo_w.svg"/>

        </div>
        <div class="col-md-2 col-sm-4 col-xs-12 q-mb-lg">
          <ul class="catalog-list text-grey-1">
            <li>
              <router-link :to="{name:'about'}">О сервисе</router-link>
            </li>
            <li><router-link :to="{name:'partner'}">Партнерская программа</router-link></li>

          </ul>
        </div>
        <div class="col-md-3 col-sm-4  col-xs-12">
          <ul class="catalog-list text-grey-1">
            <li><router-link :to="{name:'rules'}">Условия использования</router-link></li>
            <li><router-link :to="{name:'policy'}">Политика конфиденциальности</router-link></li>
          </ul>
        </div>
        <div class="col-md-4 col-sm-3  col-xs-12 ">
          <ul class="catalog-list text-grey-1">
            <li><a class="text-white" href="mailto:help@pandiga.ru">help@pandiga.ru (По вопросам работы сервиса)</a></li>
            <li><a class="text-white" href="mailto:office@pandiga.ru">office@pandiga.ru (По вопросам сотрудничества)</a></li>
          </ul>

        </div>

      </div>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>
