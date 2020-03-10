import Vue from 'vue';
// import VueRouter, {Route} from 'vue-router';
import { Framework } from 'vuetify/types/index';
declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
	interface Vue {
		$vuetify: Framework,
		$eventBus: Vue,
		$auth: any

		$subscribe: (eventName: string, cb: (para: any) => void) => void,
		$fire: (eventName: string, payload?: any) => void
	}
}

