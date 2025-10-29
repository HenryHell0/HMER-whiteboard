import { createApp } from 'vue'
import App from './App.vue'
import VueMathjax from 'vue-mathjax-next'

const app = createApp(App)
app.use(VueMathjax)

app.mount('#app')
