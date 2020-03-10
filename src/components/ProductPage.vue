<template>
<!-- eslint-disable vue/no-v-html -->
<div class='mt-sm-10'>
	<v-content class='pt-0'>
		<ProductCard
			v-if='productInfo'
			mode='intro' :productInfo='productInfo' ref='product'
			:style='{"max-width": "600px"}' class='mx-auto'
			@onAddProductToCart='onAddProductToCart'
			@onVerifyToBuyNow='onVerifyToBuyNow'
		/>
		<v-dialog v-model="shouldShowDialog" persistent max-width="290">
		<v-card>
			<v-card-title class="headline">商品已加入購物車</v-card-title>
			<v-card-text>
			若想下次再進入結帳頁面，請確保有登入會員，並點選頁面最上方的購物車
			<svg width='16' height='16'>
				<use xlink:href="@/assets/sprite.svg#cart"></use>
			</svg>
			按鈕即可
			</v-card-text>
			<v-card-actions>
			<v-spacer></v-spacer>
			<v-btn text @click="shouldShowDialog = false">繼續購物</v-btn>
			<v-btn text to='/cart' @click="shouldShowDialog = false;">開始結帳</v-btn>
			</v-card-actions>
		</v-card>
		</v-dialog>

		<v-sheet max-width='704' class='mt-10 mt-sm-12 pt-sm-12 mx-auto' color='transparent'>
			<v-tabs
				v-model="currentTabIdx"
				background-color="transparent" grow

			>
				<v-tab
					v-for="title in tabTitles" :key="title"
				>
					{{ title }}
				</v-tab>
			</v-tabs>

			<v-tabs-items v-model="currentTabIdx" v-if='productInfo'>
				<resize-observer @notify="onLandingImgWidthResizing" ref='resizingObserver'/>
				<v-tab-item>

					<v-img v-for='idx in 9' contain :src='$buildCloudinaryImgURL(productInfo.id, idx-1)' :key='idx' :min-height='landingImgMinHeight' width='100%'>
						<template v-slot:placeholder>
							<v-row
								class="fill-height ma-0" align="center" justify="center"
							>
								<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
							</v-row>
						</template>
					</v-img>

				</v-tab-item>
				<v-tab-item class='pa-4' v-html='productInfo.spec'></v-tab-item>
				<v-tab-item class='pa-4'>
					<v-sheet>
					<p>
					◎ 消費滿1200元享免運優惠； <br/><br/>

					◎ 宅配貨到付款 需另加60元代收手續費。 <br/><br/>

					◎ 紀元購物每日收單截止時間為晚上12點，超過則延後一天出貨。國定假日及例假日不出貨。<br/><br/>

					◎ 超商取貨訂單完成下單後，煩請留意門市取件通知簡訊或Email。
					</p>
					<img :src="$buildCloudinaryImgURL('shipping_spec')" width='100%'>
					<h5>備註</h5><br/>
					◎ 實際出貨時間仍將依訂單量調節，可能提前或延後出貨，如有延後出貨超過2天將另行通知<br/><br/>

					◎ 實際配送所需時間 依物流廠商為準。<br/><br/>

					◎ 如遇不可抗之因素，例如：颱風、地震及水災等，將視當時狀況處理並將另行公告通知。<br/><br/>

					◎ 郵政信箱或存局候領暫不提供購買及寄送服務，敬請見諒。<br/><br/>
					</v-sheet>
				</v-tab-item>
			</v-tabs-items>
		</v-sheet>
	</v-content>
    <v-bottom-navigation
		v-if='$vuetify.breakpoint.xsOnly'
		app fixed color="white" horizontal
    >
      <v-btn @click='onAddProductToCart'>
        <span>加入購物車</span>
      </v-btn>

      <v-btn @click='onVerifyToBuyNow' data-cy='btn--click-2-buy'>
        <span>立即購買</span>
      </v-btn>

    </v-bottom-navigation>
   </div>
<!--eslint-enable-->
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ProductCard from './ProductCard.vue';
import { cartDbService, dbService } from '@/services/db.service.ts';
import authService from '@/services/auth.service.ts';
require('@/plugins/viewportSize');
const viewportWidth = window.viewportSize.getWidth();

@Component({
	components: {
		ProductCard
	}
})
export default class ProductPage extends Vue
{
	private shouldShowDialog: boolean = false;
	private currentTabIdx: number = 0;
	private tabTitles: Array<string> = ['商品介紹', '規格說明', '配送說明'];
	private tabContents: Array<string> = ['1', '2', '3']
	private productInfo: any = null;
	private landingImgMinHeight: number = viewportWidth < 700 ? viewportWidth / 2 : 350;

	private created() {
		(this as any).productId = this.$route.params.id;
		this.initProductInfoData();
	}

	/**
	 * assign min height of landing image on image element resizing
	 */
	onLandingImgWidthResizing = require('lodash.debounce')(() =>
	{
		this.landingImgMinHeight = (this.$refs.resizingObserver as any).$el.offsetWidth / 2;
	},
	500);

	/**
	 * ⚡️ make sure all products are downloaded before rendering the associated UI
	 */
	private async initProductInfoData()
	{
		if (this.$store.state.productsOnList === null)
		{
			await dbService.downloadProductInfo(); // ⚡️
		}
		(this as any).productInfo = this.$store.state.productsOnList[(this as any).productId];
	}

	private mounted(): void {
		window.scrollTo(0, 0);
	}

	private async onAddProductToCart()
	{
		await this.addProductToCart();
		this.shouldShowDialog = true;
	}

	private async onVerifyToBuyNow()
	{
		await this.addProductToCart();
		const onAbort = (error: Error) => {
			if (error.name === 'NavigationDuplicated')
			{
				console.error(`${this.$options.name} : You navigate to the same route`);
				console.error('Check the used related Router API');
			}
		};
		this.$router.push({ name: 'cart'}).catch(onAbort);
	}

	private async addProductToCart(): Promise<any>
	{
		if (
			this.$store.state.loggedInUser === null
		) {
			await authService.forceLogHimInAnonymously();
		}
		return cartDbService.updateProductQuantity(
			(this as any).productId,
			(this.$refs.product as ProductCard).quantity
		);
	}
}
</script>