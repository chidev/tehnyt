import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import moment from 'moment'
import VueDragDrop from 'vue-drag-drop'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueDragDrop)

new Vue({
  render: h => h(App),
}).$mount('#app')
