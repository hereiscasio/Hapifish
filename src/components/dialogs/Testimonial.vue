<template>
<!-- eslint-disable vue/no-v-html -->
<v-dialog v-model='shouldShowDialog' fullscreen hide-overlay content-class='dialog--testimonial'>
<v-sheet width='100%' color='white' tile>
	<v-card width='80%' max-width='600' class='mx-auto' flat>

		<v-card-title class='display-1 py-6 font-weight-bold mx-auto'>
			文青風早餐店 Kurashi：<br> 魚樂是我們的好朋友
		</v-card-title>

		<v-card-text class='title px-0 pb-10'>
			<img :src="$buildCloudinaryImgURL('testimonial_1')" width='100%'>
			<v-subheader class='mb-6'>經營竹北Kurashi的盧培文及何振維情侶倆，可說是魚樂的超級粉絲呢！</v-subheader>
			<p>鄰近竹北喜來登飯店的「Kurashi」早餐店，店門口老宅復古風格設計特別吸睛，相較一般早餐店開放式的點餐櫃檯，「Kurashi」外帶點餐櫃檯，讓人彷彿回到了50 年代的售票亭，走進店裡，雖然空間小巧卻乾淨、整齊，多了回到家裡的溫馨感。</p>
			<img :src="$buildCloudinaryImgURL('testimonial_2')" width='100%'>
			<v-subheader class='mb-6'>文青風Kurashi早餐店位在竹北喜來登的附近。</v-subheader>
			<p>對餐飲業來說除了食物好吃，環境清潔更是客戶選擇的必要條件。Kurashi 店裡的開放式廚房，讓食物的每個製程都一覽無遺，讓消費者吃的更安心。對於店內環境清潔，老闆娘盧培文分享，現在店內大部分設備，從店內冰箱、冰箱玻璃、鏡子、煎台、刷醬油的刷子、圍裙等物品，都是使用「魚樂」環保清潔劑。</p>
			<p>老闆娘分享與魚樂環保洗潔液的初見面，剛開始是抱著不信任的態度，但深入了解裡面所含的椰子油、檸檬酸、蘆薈萃取等成份，並沒有令人害怕的石化成份，使用起來是很安全的，才開始將魚樂環保洗潔液用在店內環境清潔，從應用的範圍上來看，不難看出她對魚樂環保環保洗潔液的喜愛。</p>

			<h1 class='headline mt-12 font-weight-bold black--text'>用魚樂清煎台 蛋餅沒有油耗味</h1>
			<p>在店裡負責站煎台掌廚的何振維感慨的說，以前清潔煎台時都不敢用市面上的清潔用品，因為成份中的化學有害物質，對顧客的健康會有影響，所以只能用熱水搭配刮板來清潔，每次都刮了老半天，現在遇到魚樂環保洗潔液，每天清潔煎台成了輕鬆事，最可貴的是，客戶健康也照顧到了。</p>
			<p>老闆娘補充，試用魚樂洗潔液時，原本黑黑的煎台一下子就刷得亮晶晶，乾淨的煎台煎出來的蛋餅沒有油耗味，口感也變得比以前更好吃了！過去比較油膩的地方，都用高濃度酒精擦拭，雖然油汙很快就清除，但也傷手， 用完手都會很乾；用沙拉脫後手也會很癢，但使用魚樂後，都不會有這些不舒服的感覺。</p>

			<h1 class='headline mt-12 font-weight-bold black--text'>魚樂多功能：店內清理、寵物清潔</h1>
			<p>這對情侶檔除了在早餐店中使用魚樂環保洗潔液，也會使用在居家日常清潔中。養貓的人一定知道愛乾淨的貓咪很怕味道重的物品，所以在幫貓咪洗澡的時候，除了要注意水溫外，慎選洗澡的洗毛精也很重要。家裡養了兩隻貓咪的盧培文也分享，魚樂環保洗潔液因為沒有添加化學香精，幫貓咪洗完澡後毛髮不僅蓬鬆，也沒什麼特別味道，而且毛摸起來還特別順，感覺滿舒服的。</p>
			<p>何振維也分享，最常將魚樂環保洗潔液用在白色帆布包的清洗上，因為每天都會背出門，弄髒之後，回家就會先用魚樂浸泡再進行清洗，帆布包就能輕鬆的洗乾淨；清洗衣物前也會利用魚樂清潔洗衣槽，現在洗衣機內部也變的超乾淨。何振維禁不住稱讚的說：「魚樂可說是日常生活的好朋友。」</p>

			<br>

			<p>Kurashi 暮らし</p>
			<p>店址：新竹縣竹北市嘉興路284號</p>

			<br>

			<v-simple-table>
				<tr>紀元國際事業股份有限公司</tr>
				<tr>訂購電話：0800-666-015</tr>
			</v-simple-table>
		</v-card-text>

	</v-card>
	<v-btn
		text fixed right fab top small @click="$emit('onHideDialog')"
	>
		<svg width='24' height='24'>
			<use xlink:href="@/assets/sprite.svg#close"></use>
		</svg>
	</v-btn>
</v-sheet>
</v-dialog>
<!--eslint-enable-->
</template>

<script lang='ts'>
import { Prop, Component, Vue, Watch} from 'vue-property-decorator';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

@Component
export default class Testimonial extends Vue
{
	private shouldShowDialog: boolean = true;

	@Watch('shouldShowDialog')
	private onDialogVisibilityChange(value: boolean): void
	{
		const $dialog = document.querySelector('.dialog--testimonial');
		if (value === false)
		{
			enableBodyScroll($dialog);
			this.$emit('onHideDialog');
			return;
		}
		disableBodyScroll($dialog);
	}
}
</script>

<style lang='scss' scoped>
::v-deep .dialog--testimonial {
	-webkit-overflow-scrolling: touch;
}
/**.boundary--testimonial
============================x
	we use this component with <keep-alive> which seems like
	conflict with Vuetify's <dialog>, so we use below styling to achieve our goal
 */
.boundary--testimonial {
	position: fixed;
	top: 0;
	bottom: 0;
	right: 0;
	left: 0;
	z-index: 999;
	overflow-y: scroll
}

/** .v-subheader, .v-card__title
	RWD Concern: No ugly appearance when enter small bp
*/
.v-subheader {
	line-height: 20px;
}

@media (min-width: 320px) {
	.v-card__title {
		max-width: 260px;
	}
}
@media (min-width: 500px) {
	.v-card__title {
		max-width: 500px;
	}
}


</style>