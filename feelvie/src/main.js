import { createApp } from "vue";
import App from './App.vue';
import router from "./router";
import globals from './commonGlobal/global.js'

const app = createApp(App)
app.use(router)
app.use(globals)
app.mount('#app')
