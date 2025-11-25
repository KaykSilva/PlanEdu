import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

const app = createApp(App)

app.use(router)
    .use(Toast, {
        bodyClassName: "p-0",
        draggable: true,
        closeOnClick: true,
        hideProgressBar: false,
        pauseOnHover: true,
        position: POSITION.TOP_RIGHT,
        timeout: 4000,
        toastClassName: "bg-transparent shadow-none p-0",
    })
app.mount('#app')
