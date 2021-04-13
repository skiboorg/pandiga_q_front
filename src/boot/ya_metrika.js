import Vue from 'vue'
import VueYandexMetrika from 'vue-yandex-metrika'

Vue.use(VueYandexMetrika, {
    id: '57035101',
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true,
        ecommerce:"dataLayer"
})
