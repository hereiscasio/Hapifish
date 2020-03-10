<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog
	v-model='shouldShowDialog' persistent
	max-width='400' width='80%' content-class='overflow-x-hidden'
>
<v-card>

	<v-card-title>關於我們</v-card-title>
	<v-card-text class='js-scrollable'>
		<v-list dense min-width='340'>
			<v-list-item v-for="(info, i) in information" :key="i">
				<v-list-item-icon>
					<svg width='24' height='24'>
						<use :xlink:href="require('@/assets/sprite.svg')+info.icon"></use>
					</svg>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{info.title}}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list>
	</v-card-text>

	<v-btn
		text absolute right fab top small class='mt-8'
		@click='shouldShowDialog = false'
	>
	<svg width='24' height='24'>
		<use xlink:href="@/assets/sprite.svg#close"></use>
	</svg>
	</v-btn>
</v-card>
</v-dialog>
<!--eslint-enable-->
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ScrollHint from 'scroll-hint';
require('@/plugins/viewportSize');

@Component
export default class AboutUs extends Vue
{
	private information: any = undefined;
	private shouldShowDialog: boolean = true;

	@Watch('shouldShowDialog')
	private onDialogVisibilityChange(value: boolean): void
	{
		!value && this.$emit('onHideDialog');
	}

	private created(): void
	{
		this.information = [
			{
				title: '紀元國際事業股份有限公司', icon: '#domain'

			},
			{
				title: '0800 - 666 - 015', icon: '#cellphone'
			},
			{
				title: ' epochmall.service@gmail.com', icon: '#email'
			},
			{
				title: '週一至週五 09:00-17:00（國定假日除外）', icon: '#clock'
			},
		];
	}
	mounted() {
		if (window.viewportSize.getWidth() <= 405)
		{
			this.lazyLoadScrollableHintCSS();
		}
	}

	private lazyLoadScrollableHintCSS()
	{
		const $head = document.getElementsByTagName('head')[0];
		const $link = document.createElement('link');

		$link.rel = 'stylesheet';
		$link.href = require('@/plugins/scrollHint.css');
		$link.onload = this.showScrollableHint;

		$head.parentNode!.insertBefore($link, $head);
	}

	private showScrollableHint(): void
	{
		new ScrollHint('.js-scrollable', {
			remainingTime: '2000',
			scrollHintText: '',
			offset: 0 // <---- workaround for TS warning
		});
	}
}
</script>

<style lang='scss' scoped>
/** .v-card__text
	RWD Concern: No ugly appearance when enter small bp
*/
.v-card__text {
	overflow-x: scroll;
}
</style>