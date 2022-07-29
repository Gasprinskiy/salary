import { createApp } from 'vue'
import App from './App.vue'
import store from './store/'
import router from './router/'
import money from 'v-money'
import {VMoney} from 'v-money'
import { Quasar, Notify } from 'quasar'
import Vue3TouchEvents from "vue3-touch-events";
import 'quasar/dist/quasar.css'


const app = createApp(App)
app.directive(VMoney)


app
.use(router)
.use(Quasar)
.use(money)
.use(Vue3TouchEvents)
.use(store)
.mount('#app')
