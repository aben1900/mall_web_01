import Vue from 'vue'
import App from './App'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import i18n from './lang'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'


import VCharts from 'v-charts'

import '@/styles/index.scss' // global css
import store from './store'
import router from './router'
import '@/icons' // icon
import './router/permission' // permission control
Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'medium'
})
Vue.use(VCharts)

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})

