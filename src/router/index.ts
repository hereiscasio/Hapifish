import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import store from '@/store/index';
import { $firebase } from '@/plugins/firebase';

/**
 * default of each route is public, that's, allow access even not logged in
 * otherwise, we should address it as private explicitly, for below dev cases,
 * we can simply add `requiresAuth` to indicate that is private route
 * for more complicated, we might consider `public`, `private`, `protected` ...
 */
const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "home" */ '@/components/HomePage.vue')
	},
	{
		path: '/product/:id',
		name: 'product',
		component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "prod" */ '@/components/ProductPage.vue')
	},
	{
		path: '/cart',
		name: 'cart',
		component: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "cart" */ '@/components/cart/CartContainer.vue'),
		meta: {
			requiresAuth: true
		}
	},
	{
		path: '*',
		name: '404',
		redirect: '/'
	}
];

export const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach(async (to:Route, from:Route, next:any) =>
{
	// user try to enter the page which only for logged user
	if (
		to.matched.some(config => config.meta.requiresAuth)
	) {
		if (store.state.loggedInUser === null)
		{
			!(await ($firebase as any).firstTimeLoggedIn) && next('/');
		}
		if (
			store.state.loggedInUser && store.state.productsInCart
		) {
			next();
			return;
		}
		next(from.path ? from.path : '/');
		return;
	}
	next();
});

Vue.use(VueRouter);
export default router;