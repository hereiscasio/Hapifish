import store from '@/store/index';
import { db, getLoggedUser } from '@/plugins/firebase';
import { UserInfo } from '@/helper/shape';

class DbService
{
	public downloadProductInfo ()
	{
		return new Promise(async resolve =>
		{
			const data = (await db.ref().child('products').once('value')).val();
			store.commit('PUT_PRODUCTS_ON_LIST', data);
			resolve();
		});
	}

	public buildAPI (...paths: string[])
	{
		return db.ref(paths.join('/')).toString() + '.json';
	}

	public buildAPIWithShallowQuery (...paths: string[])
	{
		return this.buildAPI(...paths) + '?shallow=true';
	}

	public unTrackUserRelatedData()
	{
		return new Promise(resolve =>
		{
			const uid = (store.state.loggedInUser as any).uid;

			db.ref('carts/' + uid).off();
			store.commit('PUT_PRODUCTS_IN_CART', null);

			db.ref('users/' + uid).off();
			store.commit('PUT_USER_DATA', null);
			resolve();
		});
	}

	/**
	 * 1. products in cart
	 * 2. user privacy data (e.g. his name)
	 */
	public removeAllUserRelatedData(uid: string)
	{
		db.ref('users/' + uid).off();
		db.ref('users/' + uid).remove();

		const path = 'carts/' + uid;

		db.ref(path).off();
		db.ref(path).remove();
		store.commit('PUT_PRODUCTS_IN_CART', null);
	}

	/**
	 * remove all data related to certain user
	 */
	public destroyAllData(uid: string)
	{
		const path = 'users/' + uid;
		db.ref(path).off();
		return db.ref(path).remove();
	}
}

class CartDbService  extends DbService
{
	/**
	 * `quantity` is total number of certain product in cart we added
	 */
	public async updateProductQuantity(productId: string, quantity: number): Promise<any>
	{
		const data = { id: productId, quantity };
		const dataPath = `carts/${getLoggedUser()!.uid}/${productId}`;

		return db.ref(dataPath).update(data).catch(error =>
		{
			console.error('Fail to update data in rtdb', error);
		});
	}

	public trackProductInCart ()
	{
		return new Promise((resolve, reject) =>
		{
			const onError = (e: Error) => console.error('Fail to track data in rtdb', e);
			const cb = (snapshot: any) =>
			{
				store.commit('PUT_PRODUCTS_IN_CART', snapshot.val());
				resolve(); // don't change this line order
			}
			db.ref('carts/' + getLoggedUser()!.uid).on('value', cb, onError);
		});
	}

	public takeOutAllOfTheProduct (productId: string)
	{
		const path = `carts/${getLoggedUser()!.uid}/${productId}`;
		db.ref(path).off();
		db.ref(path).remove();
	}

	public takeAllProductsOut (uid?: string)
	{
		const path = 'carts/' + (uid === undefined ? getLoggedUser()!.uid : uid);

		db.ref(path).remove();
		store.commit('PUT_PRODUCTS_IN_CART', null);
	}
}

class UserDbService extends DbService
{
	public updateData (data?: UserInfo)
	{
		if (data === undefined) {
			data = require('lodash.pick')(getLoggedUser(), ['uid', 'displayName', 'email', 'phoneNumber', 'adr']);
		}
		const path = `users/${getLoggedUser()!.uid}`;
		const onError = (error: Error) => console.error('Fail to update data in rtdb', error);
		return db.ref(path).update(data!).catch(onError);
	}

	public trackLoggedInUserData ()
	{
		return db.ref('users/' + getLoggedUser()!.uid).on(
			'value',
			snapshot => {
				store.commit('PUT_USER_DATA', snapshot.val());
			},
			(e: Error) => {
				console.error('Fail to get data once in rtdb', e);
			}
		);
	}
}
export const dbService = new DbService();
export const cartDbService = new CartDbService();
export const userDbService = new UserDbService();

dbService.downloadProductInfo();