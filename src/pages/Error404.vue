<template>
  <div class="fullscreen bg-white text-primary text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h2" style="opacity:.4">
        Кажется тут ничего нет...
      </div>

      <q-btn
        class="q-mt-xl"
        color="primary"

        unelevated
        to="/"
        label="На главную"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
