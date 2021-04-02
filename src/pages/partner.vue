<template>
 <q-page class="container q-mb-xl">
     <div  class="q-gutter-sm q-my-md">
      <q-breadcrumbs>
        <q-breadcrumbs-el label="Главная" icon="home" to="/" />
        <q-breadcrumbs-el label="Партнерская программа" icon="info"  />
      </q-breadcrumbs>
    </div>

      <h1 class="text-bold text-h4">Выгодная партнерская программа</h1>

   <div class="row ">
     <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pa-lg-lg q-pa-md-lg">
        <p class="text-body1 text-center text-grey-9">Мы постоянно следим, чтобы ваш трафик
            конвертировался максимально
            эффективно и приносил больший доход.</p>
     </div>
     <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pa-lg-lg q-pa-md-lg">
       <p class="text-body1 text-center text-grey-9">Мы привыкли знать наших партнёров
            «в лицо» — вы всегда будете знать,
            к кому обратиться с вопросом.</p></div>
    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 q-pa-lg-lg q-pa-md-lg">
       <p class="text-body1 text-center text-grey-9">Прозрачная статистика
            Все цифры по лидам и свой доход
            вы будете видеть в личном кабинете.</p></div>
   </div>

      <h3 class="text-bold text-h4">Кто может стать нашим партнёром</h3>
      <p class="text-body1 ">Партнёрами Pandiga могут стать частные и юридические лица:</p>

   <q-list>
      <q-item>
         <q-item-section side top>
           <q-icon name="check" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>веб-мастера</q-item-label>
        </q-item-section>
      </q-item>
       <q-item>
         <q-item-section side top>
           <q-icon name="check" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>владельцы сайтов, форумов</q-item-label>
        </q-item-section>
      </q-item>
       <q-item>
         <q-item-section side top>
           <q-icon name="check" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>частные лица, желающие заработать в интернете</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>





 </q-page>
</template>

<script>
// import Header from "components/Header";
// import Footer from "components/Footer";

export default {
  name: 'catalog',
  // components:{
  //   Header,
  //   Footer
  // },

  data () {
    return {

    }
  }
}
</script>
<style lang="sass" scoped>

</style>
