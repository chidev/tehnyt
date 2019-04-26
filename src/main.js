import Vue from 'vue'
import App from './App.vue'
import moment from 'moment'
// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import VueDragDrop from 'vue-drag-drop'

import { store } from './store/store';

Vue.config.productionTip = true
Vue.config.devtools = true
// Vue.config.performance = true

// Vue.use(Vuetify)
Vue.use(Buefy, {
  defaultIconPack: 'fas'
})
Vue.use(VueDragDrop)

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
