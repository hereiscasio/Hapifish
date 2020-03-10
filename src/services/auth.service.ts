import firebase from 'firebase/app';
import { dbService } from '@/services/db.service';
import { Error } from '@firebase/auth-types';

export default {
	logout() {
		const onError = (error: Error) =>
		{
			console.error('Fail to sign out', error);

			switch(error.code) {
				case 'auth/invalid-user-token': break;
				case 'auth/auth/user-token-expired': break;
				case 'auth/null-user': break;
				case 'auth/tenant-id-mismatch': break;
			}
		}
		firebase.auth().signOut().then(async () =>
		{
			await dbService.unTrackUserRelatedData();
		})
		.catch(onError);
	},

	/**
	 * @note
	 * the official doc says
	 * if we not enable anonymous login, the error code will be `operation-not-allowed`
	 * after i test, the error code is `admin-restricted-operation` instead
	 * 
	 */
	forceLogHimInAnonymously ()
	{
		return firebase.auth().signInAnonymously()
			.then(e => e)
			.catch(error =>
			{
				console.error('Fail to log him in anonymously', error);
				if (
					error.code === 'auth/operation-not-allowed' ||
					error.code === 'auth/admin-restricted-operation'
				) {
					console.error('You must enable Anonymous auth in the Firebase Console');
					throw error;
				}
			});
	}
};