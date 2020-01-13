import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import _ from "lodash";

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype._ = _;

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
	created() {
		// Prevent blank screen in Electron builds
		this.$router.push('/')
	}
}).$mount("#app");
