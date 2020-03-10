import Vue from 'vue';
import firebase from 'firebase/app';
import 'firebase/database';
import "firebase/auth";
import { Error } from '@firebase/auth-types';
/**
 * Initialize Firebase
 */
firebase.initializeApp({
	apiKey: "",
	authDomain: "",
	databaseURL: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: ""
});

/**
 * ⚡ put here to avoid code executing order issue
 * ★ works with Router
 */
(firebase as any).firstTimeLoggedIn = new Promise((resolve, reject) =>
{
	firebase.auth().onAuthStateChanged(async user =>
	{
		if (user) {
			const { userDbService, cartDbService } = require('@/services/db.service'); // ⚡

			await userDbService.updateData();
			await userDbService.trackLoggedInUserData(); // ★
			await cartDbService.trackProductInCart(); // ★
		}
		resolve && resolve();
	},
	(error: Error) => {
		reject && reject();
		console.error('FirebaseError: onAuthStateChanged, Fail to detect login')
	});
});

export const db = firebase.database();
export { firebase as $firebase };
export const getLoggedUser = () => firebase.auth().currentUser;

Vue.use({
	install (Vue) {
		Vue.prototype.$auth = firebase.auth;
	}
});