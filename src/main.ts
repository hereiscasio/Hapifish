import bugsnag from '@bugsnag/js'
import bugsnagVue from '@bugsnag/plugin-vue'
import router from '@/router';
import store from './store';
import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import '@/plugins/detectDomResizing'; // TODO: package it out of main bundle
import '@/plugins/hookRegistration';
import '@/plugins/cloudinary';

const bugsnagClient = bugsnag('670345eaac808389cc21f6a30aed4500')
bugsnagClient.use(bugsnagVue, Vue);

bugsnagClient.notify(new Error('Test error'));

Vue.config.productionTip = false;

Vue.prototype.$eventBus = require('@/services/event-bus').eventBus;
Vue.prototype.$subscribe = require('@/helper/utils').subscribe;
Vue.prototype.$fire = require('@/helper/utils').fire;

export default new Vue({
	router,
	store,
	vuetify,
	render: h => h(App),
	mounted: () => document.dispatchEvent(new Event("x-app-rendered"))
}).$mount('#app');