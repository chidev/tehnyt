import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import { store } from './store/store';

Vue.config.productionTip = true
Vue.config.devtools = true
// Vue.config.performance = true

Vue.use(Vuetify)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
