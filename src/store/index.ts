import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		/**
		 * ============
		 * DATA FORMAT
		 * ===========
		 * if user with `uid` but without `phoneNumber`, then he is anonymous-login-user
		 * {
		 *
		 *	  adr -> convenient store name or user adr
		 *	  uid, -> property of Firebase `User`
		 * 	  displayName, -> property of Firebase `User`
		 *	  email,-> property of Firebase `User`
		 *    phoneNumber -> property of Firebase `User`
		 * }
		 */
		loggedInUser: null,
		/**
		 * ============
		 * DATA FORMAT
		 * ===========
		 * silk: {
		 * 	id: silk, quantity: 2
		 * },
		 * rose: {
		 * 	...
		 * }
		 */
		productsInCart: null,
		productsOnList: null
	},

	mutations: {
		PUT_PRODUCTS_ON_LIST(state, payload) {
			state.productsOnList = payload;
		},
		PUT_USER_DATA(state, payload) {
			state.loggedInUser = payload;
		},
		PUT_PRODUCTS_IN_CART(state, payload) {
			state.productsInCart = payload;
		}
	}
});

export default store;