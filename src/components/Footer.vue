<template>
  <footer class="bg-grey-10">
    <div class="container">
      <div class="row q-py-lg">
        <div class="col-md-3 col-sm-4 q-mb-lg">
          <img src="~assets/logo_f.png"/>

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

      </div>
    </div>
  </footer>
</template>

<script>
export default {

}
</script>
