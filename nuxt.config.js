/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';
import fs from 'fs';

const envPath = `.env.${process.env.ENV || 'local'}`;
require('dotenv').config({ path: envPath });

const loadPem = (env, fileName) => {
  if (env) {
    return env;
  }
  const pemPath = path.resolve(__dirname, fileName);
  if (fs.existsSync(pemPath)) {
    return fs.readFileSync(pemPath);
  }
  return '';
};

export default {
  target: 'static',
  router: {
    // eslint-disable-next-line no-unused-vars
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/error/404.vue'),
      });
      return routes.map((route) => {
        if (route.path.match(/^\/app/)) {
          return {
            ...route,
            path: route.path.replace(/^\/app\/?/, '/'),
          };
        }
        return route;
      });
    },
  },
  ssr: false,
  env: {
    ApiHostUrl: process.env.API_HOST_URL || 'http://localhost',
    StripeApiKey: process.env.STRIPE_PUBLIC_KEY,
    apiKey: process.env.API_KEY || 'AIzaSyAM2G6JIdmZkVTTcMcoN-bXgv1JNwq5prA',
    authDomain: process.env.authDomain || 'sample-noti-2217a.firebaseapp.com',
    projectId: process.env.PROJECT_ID || 'sample-noti-2217a.appspot.com',
    appId: process.env.APP_ID || '1:400863002474:web:55a71579601cac235d6f13',
    messagingSenderId: process.env.MESSAGING_SENDER_ID || '400863002474',
    publicVapidKey:
      process.env.PUBLIC_VAP_ID_KEY ||
      'BJL7dGTmO4Yybz2SlBCxtH9061wEC0D0MFAZWZaGOX4ttKEUhlVEgLEF9DMrqDdcDCdEMKMFLaJqlJe2ZGdZdxM',
  },
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, height=device-height, initial-scale=1.0',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Lexend+Giga&display=swap',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#f88', height: '3px' },
  /*
   ** Global CSS
   */
  css: ['@/assets/style/reset.css', '@/assets/sass/general.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/axios.ts',
    '@/plugins/vee-validate',
    '@/plugins/vue-js-toggle-button.ts',
    '@/plugins/vue-select.ts',
    '@/plugins/localstorage.ts',
    '@/plugins/v-scroll-lock',
    '@/plugins/vue-table-dynamic',
    '@/plugins/vue-tooltip.ts',
    '@/plugins/vue-tooltip',
    '@/plugins/firebase.ts',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    [
      '@nuxt/typescript-build',
      {
        typeCheck: {
          async: true,
          typescript: {
            enable: true,
            memoryLimit: 2048,
          },
        },
      },
    ],
    '@nuxtjs/stylelint-module', // Doc: https://github.com/nuxt-community/stylelint-module
    'nuxt-typed-vuex',
    '@nuxtjs/laravel-echo',
  ],
  echo: {
    broadcaster: 'socket.io',
    host: process.env.ECHO_HOST_URL || 'http://localhost:6001',
  },
  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}',
      },
    },
    ignoreNotFoundWarnings: true,
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios', // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    scss: [
      '@/assets/sass/variable.scss',
      '@/assets/sass/app/variable.scss',
      '@/assets/sass/app/tooltip.scss',
    ],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line no-unused-vars
    extend(config, ctx) {},
    transpile: ['vee-validate/dist/rules', /typed-vuex/],
    postcss: {
      preset: {
        autoprefixer: {
          grid: 'autoplace',
        },
      },
    },
    /*
     ** safari: infinite loop when hot reloading
     ** See https://github.com/nuxt/nuxt.js/issues/3828
     */
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].[hash].js' : '[chunkhash].js'),
    },
  },
  server: {
    https: {
      port: 3000,
      key: loadPem(process.env.SERVER_HTTPS_KEY, 'localhost-key.pem'),
      cert: loadPem(process.env.SERVER_HTTPS_CERT, 'localhost.pem'),
    },
  },
};
