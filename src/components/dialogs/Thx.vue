<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog v-model='shouldShowDialog' persistent width='86%' max-width='350'>
	<v-card class='pb-6'>

		<v-btn
			to='/' @click='shouldShowDialog = false'
			icon tab absolute right top class='mr-n2 mt-n2'
		>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#close"></use>
			</svg>
		</v-btn>

		<v-card-title class='pt-8 display-1 justify-center'>感謝定購</v-card-title>

		<v-card-text class='pa-0'>

			<img class='mx-auto d-block mt-4 mb-8' :src="$buildCloudinaryImgURL('thx')" width='60%'>
			<p class='text-center subtitle-1 mt-4'>
				現在就加入 LINE 好友 <br>
				並留言（ 或發貼圖 ）給我們 <br>
				未來我們發表 LINE 貼圖時，<br>
				將免費送給現在就加入的好友喔 <br>
			</p>
		</v-card-text>

		<v-card-actions class='pa-0'>
			<v-btn class='font-weight-bold mx-auto elevation-6 title' color='#00c300' dark large width='50%'>加 LINE 吧</v-btn>
		</v-card-actions>
	</v-card>

</v-dialog>
<!--eslint-enable-->
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class Thx extends Vue
{
	private shouldShowDialog: boolean = true;

	@Watch('shouldShowDialog')
	private onDialogVisibilityChange(value: boolean): void
	{
		!value && this.$emit('onHideDialog');
	}
}
</script>