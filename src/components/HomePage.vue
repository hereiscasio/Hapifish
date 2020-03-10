<template>
<!-- eslint-disable vue/no-v-html -->
<div :style='{height: "100%"}'>

	<v-responsive class='mb-12'>
		<v-carousel continuous cycle hide-delimiters progress progress-color='secondary' height='100%'>
			<v-carousel-item
				v-for="idx in [1,2,3]" :key="idx"
			>
			<v-responsive :aspect-ratio="2.232">
				<img :src="$buildCloudinaryImgURL('slider_item_' + idx)" width='100%'>
			</v-responsive>
			</v-carousel-item>
		</v-carousel>
	</v-responsive>

	<v-sheet
		class='d-flex mx-auto pl-3 mb-4 align-center'
		width='95%' height='10%'  min-width='288' max-height='260' color='transparent' :style='{position: "relative"}'
		max-width='514'
	>
		<v-img
			:src="$buildCloudinaryImgURL('testimonial_1')"
			class="grey lighten-2 elevation-6"
			eager
			width='110' height='150'
		>
			<template v-slot:placeholder>
			<v-row
				class="fill-height ma-0"
				align="center"
				justify="center"
			>
				<v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
			</v-row>
			</template>
		</v-img>
		<v-card tile flat color='transparent' class='overflow-y-hidden' max-width='270' max-height='150'>
			<v-card-title class='pb-0 px-3 title font-weight-bold text-no-wrap pt-2 primary--text'>
				人氣餐廳清潔唯選
			</v-card-title>
			<v-card-text class='pb-3 px-3' ref='testimonialAbstract'>
				鄰近竹北喜來登飯店的「Kurashi」早餐店，店門口老宅復古風格設計特別吸睛，相較一般早餐店開放式的點餐櫃檯，「Kurashi」外帶點餐櫃檯，讓人彷彿回到了50 年代的售票亭，走進店裡，雖然空間小巧卻乾淨、整齊，多了回到家裡的溫馨感
			</v-card-text>
		</v-card>
		<v-btn @click='$fire("request-dialog", "Testimonial")' absolute right bottom elevation='10' class='mb-n8' color='primary' dark>了解更多</v-btn>

	</v-sheet>


	<v-row no-gutters class='ma-0 mx-auto mb-12' style='max-width: 514px;' v-if='productsInfo'>
		<v-col cols='12 mt-10'>
			<v-subheader class='title'>精選商品</v-subheader>
		</v-col>
		<v-col
			v-for='(info, id, idx) in productsInfo' :key='id' cols='6'
			:class='idx % 2 === 0 ? "pl-2 pr-1": "pr-2 pl-1"'
		>
			<ProductCard mode='home' :productInfo='info' redirectOnClick/>
		</v-col>
	</v-row>



	<v-footer absolute color='transparent' class='justify-center grey--text text--lighten-1 pb-4'>
		<div>Copyright © Hapifish, All Rights Reserved</div>
	</v-footer>
</div>
<!--eslint-enable-->
</template>

<script lang="ts">
import ProductCard from './ProductCard.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
	components: {
		ProductCard
	}
})
export default class HomePage extends Vue
{
	mounted() {
		require('clamp-js')(this.$refs.testimonialAbstract, {clamp: 5, useNativeClamp: false, truncationChar:' . . .'})
	}
	get	productsInfo () {
		return this.$store.state.productsOnList
	}
}
</script>