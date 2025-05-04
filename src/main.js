import './assets/main.css'
import 'primeicons/primeicons.css'
import 'leaflet/dist/leaflet.css';


import { createApp } from 'vue'
import App from './App.vue'

import router from './router'


const app = createApp(App)

app.use(router)
app.mount('#app')
