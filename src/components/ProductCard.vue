<template>
<!-- eslint-disable vue/no-v-html -->
<v-card
	class='pa-2' data-cy='card--product' color='transparent'
	:flat='mode === "intro"' :to='pageRedirectOnceClickCard()'
>
	<v-btn
		v-if='mode === "cart"' @click='$emit("onClickCloseBtnOnCard", productInfo.id)'
		text absolute right small :style='{right: "8px"}'
	>
		<svg width='24' height='24'>
			<use xlink:href="@/assets/sprite.svg#close"></use>
		</svg>
	</v-btn>

	<v-row dense>

		<v-col :cols='imageSize' class='pa-0 px-1'>
			<img :src="$buildCloudinaryImgURL(productInfo.id)" width='100%'>
		</v-col>

		<v-col :cols='descriptionSize' class='pa-0'>

			<v-row no-gutters class='px-4 fill-height'>
				<v-col cols='12' :class='cardTitleStyle'>
					<span class="text-no-wrap">{{productInfo.title}}</span>
					<p v-if='mode === "intro"' class='body-1 mt-2 text-justify blue-grey--text text--darken-1'>{{productInfo.subTitle}}</p>
				</v-col>
				<v-col cols='12' class='d-flex align-center'>
					<span :class='priceTextStyle'>${{productInfo.price}}</span>
					<v-spacer></v-spacer>
					<v-row no-gutters class='flex-nowrap justify-space-between' v-if='mode !== "home"'>
						<v-col cols="4" class='d-flex justify-center align-center'>
							<v-btn icon outlined rounded @click='modifyQuantity(-1)' min-width='36'>
								<svg width='24' height='24'>
									<use xlink:href="@/assets/sprite.svg#minus"></use>
								</svg>
							</v-btn>
						</v-col>
						<v-col cols="4" class='d-flex justify-center align-center'>
							{{quantity}}
						</v-col>
						<v-col cols="4" class='d-flex justify-center align-center'>
							<v-btn icon outlined rounded @click='modifyQuantity(1)' min-width='36'>
								<svg width='24' height='24'>
									<use xlink:href="@/assets/sprite.svg#plus"></use>
								</svg>
							</v-btn>
						</v-col>
					</v-row>
				</v-col>
			</v-row>

			<v-row
				v-if='mode === "intro" && $vuetify.breakpoint.smAndUp'
				class='flex-no-wrap mr-2 mt-2' no-gutters
			>
				<v-col class='pl-0'><v-btn @click='$emit("onAddProductToCart")' block>加到購物車</v-btn></v-col>
				<v-col cols='auto' class='px-2'></v-col>
				<v-col class='pr-0'><v-btn @click='$emit("onVerifyToBuyNow")' block>立即購買</v-btn></v-col>
			</v-row>

		</v-col>


	</v-row>
</v-card>
<!--eslint-enable-->
</template>

<script lang='ts'>

import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ProductInfo } from '@/helper/shape';
/**
 * Component Usage
 * =====================
 * Product quantity will sync to remote only for logged user
 * that means, when user add product to cart, that product quantity is sync with remote
 * then again, before user login, no matter how he increase or decrease product quantity
 * that is only meaningful in local
 */
@Component
export default class ProductCard extends Vue
{

	@Prop(Boolean) readonly redirectOnClick?: boolean;

	@Prop() readonly productInfo!: Required<ProductInfo>;

	/**
	 * possible value of `mode`: cart, home, intro
	 */
	@Prop() readonly mode!: Required<string>;

	/**
	 * only work with `mode` = 'cart'
	 * this will always sync with remote change
	 */
	@Prop(Number) readonly quantityInCart?: number;


	public quantity: number = 1;
	private cardTitleStyle: string = `pt-3 pb-0 ${this.cardTitleSize()} ${this.mode === "cart" ? "pt-0" : ""}`;
	private priceTextStyle: string = `font-weight-regular px-1 ${this.mode === "intro" ? "title" : "subtitle-1"}`;


	private cardTitleSize(): string
	{
		let fontSizeClass = '';

		switch(this.mode)
		{
			case 'home': fontSizeClass = 'subtitle-2'; break;
			case 'cart': fontSizeClass = 'subtitle-2'; break;
			case 'intro': fontSizeClass = 'title'; break;
		}
		return fontSizeClass;
	}

	get imageSize ()
	{
		if (this.mode === "cart") return 5;
		if (this.mode === 'home') return 12;
		if ( this.$vuetify.breakpoint.smAndUp )
		{
			return 6;
		}
		return 12;
	}

	get descriptionSize ()
	{
		if (this.mode === "cart") return 7;
		if (this.mode === 'home') return 12;
		if ( this.$vuetify.breakpoint.smAndUp )
		{
			return 6;
		}
		return 12;
	}

	@Watch('quantityInCart', {immediate: true})
	private onChangeQuantityInCart(value: number): void
	{
		if (this.mode === 'cart' && value) {
			this.quantity = value;
		}
	}

	private pageRedirectOnceClickCard(): string | undefined
	{
		return this.redirectOnClick ? `/product/${this.productInfo.id}` : undefined;
	}

	private modifyQuantity(minusOrPlusOne: number): void
	{
		if (
			( minusOrPlusOne === -1 && this.quantity > 1 )
			|| minusOrPlusOne === 1
		) {
			const updatedQuantity = this.quantity + minusOrPlusOne;

			if (this.mode === 'cart')
			{
				this.$emit(
					'onModifyProductQuantityInCart',
					this.productInfo.id,
					updatedQuantity
				);
				return;
			}
			this.quantity = updatedQuantity;
		}
	}
}
</script>

<style lang='scss' scoped>

</style>