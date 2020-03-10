<template>
<!-- eslint-disable vue/no-v-html -->
<v-form v-model="isFormValid" ref='orderForm' class='px-4 pb-4'>
	<v-text-field
		v-model='receiverNameFormField'
		label="收件人名" placeholder="請填寫正確人名(僅限中文)"
		:rules='[dataIsRequired, nameShouldBeValid]'
		data-cy='form-field--name' outlined  counter='5'>
	</v-text-field>

	<v-row no-gutters align='center' class='mb-2'>
		<v-col col="4">手機號碼</v-col>
		<v-col col="8">
			<v-checkbox
				label="收件人同寄件人" class='mt-0 pt-0 text-no-wrap' hide-details
				v-model="buyerSameAsReceiver"
			></v-checkbox>
		</v-col>
	</v-row>

	<v-row no-gutters class='flex-nowrap'>
		<v-col :cols='buyerSameAsReceiver ? 12 : 6'>
			<v-text-field
				v-model='buyerPhoneFormField' v-mask='phoneNumberPattern'
				@focus='verifyPhoneNumber'
				:rules='[dataIsRequired]'
				readonly
				:placeholder='buyerSameAsReceiver ? "請填您的手機，如 0966001596" : `"寄" 件人手機`'
				data-cy='form-field--phone' outlined>
			</v-text-field>
		</v-col>

		<v-col v-if='!buyerSameAsReceiver' class='px-1'></v-col>
		<v-col v-if='!buyerSameAsReceiver' cols='6'>
			<v-text-field
				v-model='receiverPhoneFormField' v-mask='phoneNumberPattern'
				placeholder='"收" 件人手機'
				:rules='[dataIsRequired]'
				outlined
			></v-text-field>
		</v-col>
	</v-row>

	<ShippingWidget ref='shippingBy'/>

	<v-text-field
		v-model='messageFormField' label="顧客留言" placeholder="..." outlined hint='歡迎透過電話、LINE、右下角的 Messenger 與我們溝通'>
	</v-text-field>
	<v-text-field
		placeholder='"寄"件人 Email' label="Email" outlined
		v-model='emailFormField' :rules=[emailShouldBeValid]
	>
	</v-text-field>
	<v-text-field label="付款方式" placeholder="現僅提供貨到付款，不便處請見諒" outlined disabled></v-text-field>

	<v-btn
		:disabled='!isFormValid' @click='shouldShowDialog = true'
		data-cy='btn--1st-submit' block large
	>
	我已確認訂單資料無誤
	</v-btn>

    <v-snackbar v-model="snackbar" :timeout='3000' bottom>
      啟動手機號碼正確性驗證程序 ...
    </v-snackbar>

    <v-dialog v-model="shouldShowDialog" persistent max-width="290">
		<v-card
			v-if='submitting' color="secondary" dark
		>
			<v-card-title>處理中，請稍候 ...</v-card-title>
			<v-card-text>
				<v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
			</v-card-text>
		</v-card>
		<v-card v-else>
			<v-card-title class="headline">送出訂單</v-card-title>
			<v-card-text>注意：訂單內資訊一經送出，便無法更改</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="shouldShowDialog = false">我再檢查一次</v-btn>
				<v-btn
					@click="submit" data-cy="btn--2nd-submit" color="green darken-1" text
				>立即下單
				</v-btn>
			</v-card-actions>
		</v-card>
    </v-dialog>

</v-form>
<!--eslint-enable-->
</template>

<script lang='ts'>
import { mask } from 'vue-the-mask';
import ShippingWidget from '@/components/cart/ShippingWidget.vue';
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'
import { userDbService, cartDbService } from '@/services/db.service.ts';
import { apiService } from '@/services/api.service.ts';
import { UserInfo } from '@/helper/shape.ts';

@Component({
	components: { ShippingWidget },
	directives: { mask }
})
export default class FormFields extends Vue
{
	private submitting: boolean = false;
	private shouldShowDialog: boolean = false;
	private buyerSameAsReceiver: boolean = true;
	private snackbar: boolean = false;
	private isFormValid: boolean = false;
	private receiverPhoneFormField: string = '';
	private buyerPhoneFormField: string = '';
	private receiverNameFormField: string = '';
	private messageFormField: string = '';
	private emailFormField: string = '';
	private phoneNumberPattern: string = '09## - ### - ###';

	@Prop() readonly productsInCart!: Required<any>;
	@Ref() readonly shippingBy!: ShippingWidget;

	get loggedInUser() {
		return this.$store.state.loggedInUser;
	}

	/**
	 * Workaround: avoid to do otp-processing when run e2e testing
	 */
	private verifyPhoneNumber(): void
	{
		if( (window as any).e2eTesting ) return; // TODO: fix ts
		if (
			!this.loggedInUser.phoneNumber
		) {
			this.snackbar = true;
			this.$fire('request-to-login');
		}
	}

	@Watch('loggedInUser', {immediate: true, deep: true})
	private populatePhoneNumberIfExisted(userInfo: UserInfo): void
	{
		if (userInfo.phoneNumber) {
			this.buyerPhoneFormField = userInfo.phoneNumber.replace('+886', '0'); // without "+886"
		} else {
			this.buyerPhoneFormField = ''
		}
		if (userInfo.displayName) {
			this.receiverNameFormField = this.receiverNameFormField ? this.receiverNameFormField : userInfo.displayName;
		}
		if (userInfo.displayName) {
			this.receiverNameFormField = this.receiverNameFormField ? this.receiverNameFormField : userInfo.displayName;
		}
		if (userInfo.email)
		{
			this.emailFormField	= this.emailFormField ? this.emailFormField : userInfo.email;
		}
	}

	/**
	 * CASE_1: user who haven't registered his name -> always return true
	 * 		   > * anonymous user
	 *         > * permanent user but he haven't buy any thing on our App
	 *
	 * CASE_2: buyer = receiver
	 * 		   > return error if he change his name on name field
	 *         > otherwise, return true
	 *
	 * CASE_3: buyer != receiver
	 *        > return error if he keep the same name of receiver & buyer
	 *        > otherwise, return true
	 */
	private nameShouldBeValid(currentName: string): boolean | string
	{
		if (!this.loggedInUser.name) return true; // CASE_1
		if (!this.buyerSameAsReceiver) // CASE_3
		{
			if (currentName === this.loggedInUser.name)
			{
				return "the receiver'name should not same as buyer'name";
			}
			return true;
		}
		if (currentName !== this.loggedInUser.name) // CASE_2
		{
			return "You can't change the name which already registered";
		}
		return true;
	}

	/**
	 * - CASE_4: if buyer not same as receiver, enter receiver's email is not necessary
	 * - for other cases, plz ref to function `nameShouldBeValid`
	 * - below `pattern` grabbed from Vuetify doc
	 */
	private emailShouldBeValid (currentEmail: string): boolean | string
	{
		if (!this.loggedInUser.email) return true; // CASE_1

		const emailFormatValidator = (email: string) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(email) || 'Invalid e-mail.'
		};
		if (!this.buyerSameAsReceiver)
		{
			if (currentEmail === '') return true; // CASE_4
			if (currentEmail === this.loggedInUser.email) // CASE_3
			{
				return "the receiver'email should not same as buyer'email";
			}
			return emailFormatValidator(currentEmail); // CASE_3
		}
		if (currentEmail !== this.loggedInUser.email) // CASE_2
		{
			return "You can't change the email which already registered";
		}
		return emailFormatValidator(currentEmail);
	}

	private dataIsRequired(value: string): boolean | string
	{
		return !!value || '此為必填';
	}

	async submit() {
		this.submitting = true;
		const URL = 'https://script.google.com/macros/s/AKfycby1aU0fQtltB5Sqytw7E2gVR3QzEA3k1p6I4Y03VyhkO_HJp7o/exec';

		let buyerData, receiverAddress;

		if (this.shippingBy.preferShippingMethod === '711') {
			receiverAddress = this.shippingBy.pickedStore!.name;
		} else {
			receiverAddress = this.shippingBy.pickedCity + this.shippingBy.pickedDistrict + this.shippingBy.address;
		}
		const orderData = {
			goods: require('lodash.mapvalues')(this.productsInCart, 'quantity'), // {"rose": 2, "silk": 3}
			paymentBy: '貨到付款',
			shippingBy: '貨到付款',
			buyer: this.buyerSameAsReceiver ? null : this.buyerPhoneFormField, //
			displayName: this.receiverNameFormField,
			phoneNumber: this.buyerSameAsReceiver ? this.buyerPhoneFormField : this.receiverPhoneFormField, //
			adr: receiverAddress,
			email: this.emailFormField,
			message: require('dompurify')(window).sanitize(this.messageFormField)
		};
		let anyError = await apiService.POST(URL, orderData, {'Content-Type': 'text/plain;charset=utf-8'});
		if (anyError) {
			console.error('Fail to write data into google excel');
			throw new Error(anyError);
		}
		this.shouldShowDialog = false;
		this.submitting = false;
		if (this.buyerSameAsReceiver) {
			buyerData = require('lodash.pick')(orderData, ['displayName', 'adr', 'email']);
			await userDbService.updateData(buyerData);
		}
		await cartDbService.takeAllProductsOut();
		this.$fire("request-dialog", "Thx");
	}
}
</script>