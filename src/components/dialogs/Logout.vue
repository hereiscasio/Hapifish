<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog v-model='shouldShowDialog' max-width='300' width='80%' >
	<v-card>
		<v-card-title>確定要登出嗎？</v-card-title>
		<v-card-text>
			一但登出，下次購買時，仍須重新驗證手機號碼
		</v-card-text>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn depressed @click='confirmToLogout'>確定</v-btn>
			<v-btn depressed @click='shouldShowDialog = false'>取消</v-btn>
		</v-card-actions>
	</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Logout extends Vue
{
	private shouldShowDialog: boolean = true;

	private async confirmToLogout()
	{
		await import('@/services/auth.service').then(file => file.default.logout());
		this.shouldShowDialog = false;
	}

	@Watch('shouldShowDialog')
	private onDialogVisibilityChange(value: boolean): void
	{
		!value && this.$emit('onHideDialog');
	}
}
</script>