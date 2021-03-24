<template>
  <q-layout view="lHh Lpr lFf">
    <Header/>
    <q-page-container>
      <router-view />
    </q-page-container>
    <Footer/>
  </q-layout>
</template>

<script>


import Header from 'components/Header'
import Footer from "components/Footer"
import { mapActions } from 'vuex'
export default {
  name: 'MainLayout',
  components:{
    Header,
    Footer
  },
  data () {
    return {
    }
  },
  async mounted() {
    await this.fetchCategories()

  },
  methods:{
    ...mapActions('categories',['fetchCategories'])
  }
}
</script>
