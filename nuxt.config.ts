export default {
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '@everhoof/tools',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    ],
    htmlAttrs: {
      lang: 'ru',
      class: ['page'],
    },
    bodyAttrs: {
      class: ['page__body grid grid_type_default grid_style_debug'],
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],
  styleResources: {
    stylus: ['~/assets/stylus/variables.styl', '~/assets/stylus/mixins.styl'],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    {
      src: '~/plugins/nuxt-client-init.ts',
      ssr: false,
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/router',
    '@nuxtjs/style-resources',
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/typed-vuex/],
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ],
    },
  },

  router: {
    middleware: ['authenticated'],
  },

  vuetify: {
    optionsPath: './vuetify.options.js',
  },

  /* eslint-disable */
  serverMiddleware: ['~/server-middleware/api-server.js'],
  /* eslint-enable */

  publicRuntimeConfig: {
    apiHttpEndpoint: process.env.API_HTTP,
  },
};
