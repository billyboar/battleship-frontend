import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import AsyncComputed from 'vue-async-computed'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(AsyncComputed)

new Vue({
  render: h => h(App),
}).$mount('#app')
