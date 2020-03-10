<template>
<!-- eslint-disable vue/no-v-html -->
<v-row no-gutters class='mx-auto' :style='{"max-width": "700px"}'>
	<v-col cols='12' sm='6' class='mb-6' >
		<v-row dense class='ma-0 px-1'>
			<v-col cols='12'>


				<v-card tile class='mb-6 mt-2 mx-auto mt-sm-4' max-width='514'>
					<v-list>
					<v-list-item v-for='(cost, idx) in costSummarize' :key='idx'>
						<v-list-item-content>
							<v-row align-center justify-center dense>
								<v-col cols='auto' class='d-flex align-center'>{{cost.title}}</v-col>
								<v-col>
									<v-chip v-if="cost.id === 'shippingFee'" color="primary" label outlined>
									滿千免運
									</v-chip>
								</v-col>
							</v-row>
						</v-list-item-content>
						<v-list-item-action>{{cost.value}}</v-list-item-action>
					</v-list-item>
					</v-list>
				</v-card>


			</v-col>
			<v-col cols='12' class='d-flex ma-0 py-0 justify-space-between px-2'>
				<v-subheader class='subtitle-1 pl-0'>商品明細</v-subheader>
				<v-btn v-if='!isFormVisibleInViewport' @click='scrollToTopOfFormField' color='primary'>
					開始填寫訂單資料
					<svg width='24' height='24'>
						<use xlink:href="@/assets/sprite.svg#pencil"></use>
					</svg>
				</v-btn>
			</v-col>
			<v-col
				v-for='product in productsInCart' :key='product.id' cols='12'
				class='mb-sm-2'
			>
				<ProductCard
					mode='cart' :productInfo='productsOnList[product.id]'
					:quantityInCart='product.quantity'
					@onClickCloseBtnOnCard='takeOutAllOfTheProduct'
					@onModifyProductQuantityInCart='syncProductQuantity(...arguments)'
				/>
			</v-col>
		</v-row>
	</v-col>
	<v-col cols='12' sm='6' class='mt-6'>
		<FormFields
			ref='formFields'
			v-intersect="onVisibleInViewport"
			:productsInCart='productsInCart'
		/>
	</v-col>
</v-row>
<!--eslint-enable-->
</template>

<script lang="ts">
import FormFields from '@/components/cart/FormFields.vue'
import { Component, Vue, Watch} from 'vue-property-decorator'
import ProductCard from '@/components/ProductCard.vue';
import { ProductInfo, ProductInCart, CostSummarize } from '@/helper/shape.ts';
import { cartDbService, dbService } from '@/services/db.service.ts';
require('@/plugins/viewportSize');

@Component({
	components: {
		ProductCard,
		FormFields
	}
})
export default class CartContainer extends Vue
{
	private costSummarize: CostSummarize[] = [];

	/**
	 * When in mobile view, user might not see the form when enter /cart page
	 */
	private isFormVisibleInViewport: boolean = false;
	/**
	 * silk: {
	 * 	id: silk, quantity: 2
	 * },
	 * rose: {
	 * 	...
	 * }
	 */
	get productsInCart(): Record<string, ProductInCart>
	{
		return this.$store.state.productsInCart;
	}

	private beforeCreate() {
		(this as any).productsOnList = this.$store.state.productsOnList;
	}

	private onVisibleInViewport(entries: any): void {
		this.isFormVisibleInViewport = entries[0].isIntersecting;
	}

	private scrollToTopOfFormField(): void
	{
		this.$vuetify.goTo(this.$refs.formFields as Vue, {
			offset: 10,
			duration: 1000,
			easing: 'easeInOutCubic'
		});
	}

	private takeOutAllOfTheProduct(productId: string): void
	{
		cartDbService.takeOutAllOfTheProduct(productId);
	}

	private syncProductQuantity(productId: string, updatedQuantity: number): void
	{
		cartDbService.updateProductQuantity(productId, updatedQuantity);
	}

	@Watch('productsInCart', {deep: true, immediate: true})
	reEvaluateOrderMoney(value: Record<string, ProductInCart>): void
	{
		if (value === null) { // no any product in cart
			const onAbort = (error: Error) =>
			{
				if (error.name === 'NavigationDuplicated') {
					console.error(`${this.$options.name} : You navigate to the same route`);
					console.error('Check the used related Router API');
				}
			};
			this.$router.push('/').catch(onAbort);
			return;
		}
		let allProducts$InCart = 0;

		require('lodash.map')(value, (product: ProductInCart) => {
			allProducts$InCart += product.quantity * (this as any).productsOnList[product.id].price;
		});
		let shippingFee = allProducts$InCart >= 1000 ? 0 : 70;

		this.costSummarize = [
			{
				title: "商品總價",
				id:'totalPriceOfProducts',
				value: allProducts$InCart
			},
			{
				title: "運費",
				id: 'shippingFee',
				value: shippingFee
			},
			{
				title: "訂單總金額",
				id: 'totalPriceOfOrder',
				value: allProducts$InCart + shippingFee
			}
		];
	}
}
</script>