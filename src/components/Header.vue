<template>
<!-- eslint-disable vue/no-v-html -->
<div>
	<v-dialog v-model='shouldShowDialogForOTP' max-width='360'>
		<div id="firebaseui-auth-container"></div>
	</v-dialog>
	<v-app-bar dark app class='secondary'>
		<v-btn icon to='/' text>
			<svg width="31" height="39" fill="#fff">
				<use xlink:href="@/assets/sprite.svg#hapifish"></use>
			</svg>
		</v-btn>

		<v-toolbar-title class='pa-0 hidden-xs-only'>
			<v-btn text to='/' class='px-0 title ml-n2'>魚樂</v-btn>
		</v-toolbar-title>

		<v-spacer></v-spacer>

		<v-btn text small target='_blank' href="https://www.facebook.com/jyh.shann2009/">
			<svg :width='reLayoutPosition ? 18 : 24' class='mr-sm-2 ml-sm-n1'>
				<use xlink:href="@/assets/sprite.svg#facebook"></use>
			</svg>
			<span class='hidden-xs-only'>FB 粉專</span>
		</v-btn>

		<v-btn text small target='_blank' href='https://www.youtube.com/channel/UCs_BEbPlE9FHWHiCNqa9zOw'>
			<svg :width='reLayoutPosition ? 18 : 24' class='mr-sm-2 ml-sm-n1'>
				<use xlink:href="@/assets/sprite.svg#youtube"></use>
			</svg>
			<span class='hidden-xs-only'>Youtube</span>
		</v-btn>

		<v-btn
			tag='a' small text @click='$fire("request-dialog", "AboutUs")'
		>
			<svg :width='reLayoutPosition ? 18 : 24' class='mr-sm-2 ml-sm-n1'>
				<use xlink:href="@/assets/sprite.svg#account-group"></use>
			</svg>
			<span class='hidden-xs-only'>關於我</span>
		</v-btn>

		<v-btn text to='/cart' small>
			<svg :width='reLayoutPosition ? 18 : 24' class='mr-sm-2 ml-sm-n1'>
				<use xlink:href="@/assets/sprite.svg#cart"></use>
			</svg>
			<span class='hidden-xs-only'>購物車</span>
		</v-btn>

		<v-btn tag='a'  @click='loginOrLogout' small text>
			<svg :width='reLayoutPosition ? 18 : 24' class='mr-sm-2 ml-sm-n1'>
				<use :xlink:href="require('@/assets/sprite.svg') + '#' + (heIsNormalLoginUser ? 'logout' : 'login')"></use>
			</svg>
			<span class='hidden-xs-only'>{{heIsNormalLoginUser ? "登出" : "登入"}}</span>
		</v-btn>
	</v-app-bar>
</div>
<!--eslint-enable-->
</template>

<script lang='ts'>
import * as firebaseui from 'firebaseui';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { dbService } from '@/services/db.service.ts';
import { Route } from 'vue-router';
import { UserCredential } from '@firebase/auth-types';

@Component({
	components: {
	}
})
export default class Header extends Vue
{
	private shouldShowDialogForOTP: boolean = false;

	get reLayoutPosition() {
		return this.$vuetify.breakpoint.name === 'sm'
	}

	/**
	 * normal login = login by not using anonymously login
	 */
	get heIsNormalLoginUser(): boolean {
		return this.$store.state.loggedInUser && this.$store.state.loggedInUser.phoneNumber;
	}

	private created (): void
	{
		this.$subscribe('request-to-login', (this.bootstrapLoginProcessViaOTP as () => {}));
	}

	private async signInSuccessWithAuthResult(authData: UserCredential, redirectUrl: string)
	{
		return false; // page is not automatically redirected.
	}

	private bootstrapLoginProcessViaOTP (): void {
		this.shouldShowDialogForOTP = true;

		this.$nextTick(() => {
			// init the FirebaseUI Widget
			const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(this.$auth());

			// currently, only supported sign-in method is otp (not includes anonymously login)
			const supportSignInBySMS =
			{
				provider: this.$auth.PhoneAuthProvider.PROVIDER_ID,
				defaultCountry: 'TW',
				defaultNationalNumber: '09'
			};
			const config = {
				signInOptions: [ supportSignInBySMS ],
				autoUpgradeAnonymousUsers: true,
				callbacks: {
					signInSuccessWithAuthResult: () => false,
					signInFailure: this.handleFailToUpgradeAnonymous
				}
			};
			// The start method will wait until the DOM is loaded.
			ui.start('#firebaseui-auth-container', config);
		})
	}



	async handleFailToUpgradeAnonymous(error: firebaseui.auth.AuthUIError)
	{
		if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
			return Promise.resolve();
		}
		let anonymousUserData = this.$store.state.loggedInUser.uid;
		let anonymousUserRef = this.$auth();
		const signOutAndDeleteAnonymousUser = () => anonymousUserRef.delete();


		this.$auth().signInWithCredential(error.credential).then(async (validUserCredential: UserCredential) =>
		{
			dbService.removeAllUserRelatedData(anonymousUserRef.uid);

			await signOutAndDeleteAnonymousUser();
		})
		.catch((error: any) => {
			console.error('Fail to upgrade anonymous', error);
		})
	}

	/**
	 * Anonymous login user can't logout, but upgrade their account
	 */
	private loginOrLogout (): void
	{
		if (this.heIsNormalLoginUser)
		{

			this.$fire("request-dialog", "Logout")
			return;
		}
		this.bootstrapLoginProcessViaOTP();
	}
}
</script>

<style lang='scss' scoped>
@import '~firebaseui/dist/firebaseui.css';
/** #firebaseui-auth-container
	RWD Concern: No ugly appearance when enter small bp
*/
#firebaseui-auth-container {
	overflow-x: hidden;
}
/**
 * BugFixed
 * Vuetify will add default color on v-btn once we add prop "to" on it
 */
.v-btn:before {
    background-color: transparent;
}
</style>