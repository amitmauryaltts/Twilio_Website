// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import DriverInfo from './components/DriverInfo';
// import VModal from 'vue-js-modal'\
import VueLoading from 'vuejs-loading-plugin'
Vue.use(VueLoading)

// overwrite defaults
Vue.use(VueLoading, {
  dark: true, // default false
  text: 'Loading', // default 'Loading'
  loading: true, // default false
  customLoader: 'Loading', // replaces the spinner and text with your own
  background: 'rgb(255,255,255)', // set custom background
  classes: ['myclass'] // array, object or string
})

Vue.config.productionTip = false
// Vue.use(VModal, { dialog: true });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app')//mount the router on the app
