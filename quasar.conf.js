module.exports = function (/* ctx */) {
  return {
    supportTS: false,
    preFetch: true,
    boot: [
      'axios',
      'init',
      { path: 'ya_map', server: false }
    ],
    css: [
      'app.sass'
    ],
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],
    build: {
      vueRouterMode: 'history',
      env: {
        //API: 'http://91.210.171.192:8000'
        API: 'http://0.0.0.0:8000',
        WS: 'ws://0.0.0.0:8000',
        IMG_URL: 'http://0.0.0.0:8000',
      },
      extendWebpack (cfg) {
      },
    },
    devServer: {
      https: false,
      port: 8080,
      open: true
    },
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'ru', // Quasar language pack
      config: {},
      importStrategy: 'auto',
      cssAddon: true,
      plugins: [
        'Cookies',
        'Notify',
        'LocalStorage',
        'Loading',
        'Meta'
      ]
    },
    animations: [],
    ssr: {
      pwa: false,
      manualHydration: false,
    },
  }
}
