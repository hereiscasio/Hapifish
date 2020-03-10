<template>
<!-- eslint-disable vue/no-v-html -->
<div>
	<v-select
		label="運送方式" placeholder='請選擇'
		@change='chooseShippingMethod'
		v-model='preferShippingMethod'
		:items="shippingMethods"
		item-value='id' item-text='title' hide-details outlined
		data-cy='dropdown--shipping-methods'
	></v-select>

	<v-text-field
		label="指定門市" placeholder='尚未指定'
		v-if='preferShippingMethod === "711"'
		:value="pickedStore && pickedStore.name"
		:rules=[dataIsRequired]
		outlined hide-details readonly class='my-7'
		data-cy='dropdown--wanted-store'
		@focus='shouldShow711Picker = true'
	>
		<template v-slot:append>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#menu-down"></use>
			</svg>
		</template>
	</v-text-field>

	<v-row v-else no-gutters align='center' class='mt-2 mb-5'>
		<v-col cols='3'>
			<v-subheader class='px-0'>收件地址</v-subheader>
			</v-col>
		<v-spacer></v-spacer>
		<v-col cols='9' class='d-flex'>
			<v-text-field
				v-model="pickedCity"
				dense solo hide-details readonly
				class='flex-grow-1 mr-2 px-0 dropdown--adr'
				@focus='shouldShowCityDialog = true'
				label="縣市"
			>
              <template v-slot:append>
				<svg width='24' height='24'>
					<use xlink:href="@/assets/sprite.svg#menu-down"></use>
				</svg>
              </template>
			</v-text-field>
			<v-text-field
				v-model="pickedDistrict" :disabled='!pickedCity'
				dense solo hide-details readonly
				class='flex-grow-1 px-0 dropdown--adr'
				@focus='shouldShowDistrictDialog = true'
				label="地區"
			>
              <template v-slot:append>
				<svg width='24' height='24'>
					<use xlink:href="@/assets/sprite.svg#menu-down"></use>
				</svg>
              </template>
			</v-text-field>
		</v-col>
		<v-col cols="12">
			<v-text-field
				placeholder="現僅受理島內運輸，請填台灣地址"
				v-model='address' data-cy='form-field--adr' class='pt-0'
				:rules=[dataIsRequired]
			>
			</v-text-field>
		</v-col>
	</v-row>

    <v-bottom-sheet v-model="shouldShow711Picker" inset max-width='704'>
		<v-btn
			@click='shouldShow711Picker = false'
			fab fixed right top
		>
			<svg width='24' height='24'>
				<use xlink:href="@/assets/sprite.svg#close"></use>
			</svg>
		</v-btn>
      	<v-sheet class='pa-3'>
			<v-row dense>
				<v-col cols="6">
				<v-text-field
					placeholder="縣市" outlined hide-details readonly
					:value="pickedCity" data-cy='dropdown--city-for-store'
					@focus='shouldShowCityDialog = true'
				>
				<template v-slot:append>
					<svg width='24' height='24'>
						<use xlink:href="@/assets/sprite.svg#menu-down"></use>
					</svg>
				</template>
				</v-text-field>
				</v-col>
				<v-col cols="6">
				<v-text-field
					placeholder="地區" outlined hide-details readonly
					:value="pickedDistrict" data-cy='dropdown--district-for-store'
					:rules='[]'
					@focus='shouldShowDistrictDialog = true'
					:disabled='pickedCity === ""'
				>
				<template v-slot:append>
					<svg width='24' height='24'>
						<use xlink:href="@/assets/sprite.svg#menu-down"></use>
					</svg>
				</template>
				</v-text-field>
				</v-col>
				<v-col cols="6">
				<v-text-field
					placeholder="路段" outlined hide-details readonly
					:value="pickedRoad" data-cy='dropdown--road-for-store'
					:rules='[]'
					@focus='shouldShowRoadDialog = true'
					:disabled='pickedDistrict === ""'
				>
				<template v-slot:append>
					<svg width='24' height='24'>
						<use xlink:href="@/assets/sprite.svg#menu-down"></use>
					</svg>
				</template>
				</v-text-field>
				</v-col>
				<v-col cols="6">
				<v-text-field
					placeholder="分店" outlined hide-details readonly
					:value="pickedStore && pickedStore.name" data-cy='dropdown--which-store'
					@focus='shouldShowStoreDialog = true'
					:disabled='pickedRoad === ""'
				>
				<template v-slot:append>
					<svg width='24' height='24'>
						<use xlink:href="@/assets/sprite.svg#menu-down"></use>
					</svg>
				</template>
				</v-text-field>
				</v-col>
			</v-row>
			<template v-if='pickedStore'>
				<div class='my-3' style="height:200px" ref='mapContainer'></div>
				<v-row no-gutters align='center'>
					<v-col cols='auto' class='d-flex'>
						<svg width='24' height='24'>
							<use xlink:href="@/assets/sprite.svg#map-marker"></use>
						</svg>
						<v-subheader class='pl-2'>{{pickedStore.name}}</v-subheader>
					</v-col>
					<v-col class='text-right'>
						<v-btn max-width='300' width='100%' @click='confirmSelectedStore'>確認所選門市</v-btn>
					</v-col>
				</v-row>
			</template>
<!-- // [{"adr":"基隆市七堵區堵南街22-1號1樓","disable":false,"geo":[25.082554,121.68641],"name":"篤鑫門市"}] -->
		</v-sheet>
	</v-bottom-sheet>

     <v-dialog v-model='shouldShowDistrictDialog' max-width="320">
        <v-card>
          	<v-card-actions>
            <v-row class='text-center' dense>
              	<v-col v-for='data in dataDistricts' :key='data.id'>
					<v-btn @click='selectDistrict(data)' large>{{data.zhtw}}</v-btn>
				</v-col>
            </v-row>
          	</v-card-actions>
        </v-card>
    </v-dialog>

 	<v-dialog v-model='shouldShowCityDialog' max-width="320">
        <v-card>
          <v-card-actions>
            <v-row class='text-center' dense>
              	<v-col v-for='data in dataCities' :key='data.id'>
					<v-btn @click='selectCity(data)' large>{{data.zhtw}}</v-btn>
				</v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

 	<v-dialog v-model='shouldShowRoadDialog' max-width="320">
        <v-card>
          <v-card-actions>
            <v-row class='text-center' dense>
              	<v-col v-for='(value, key) in dataRoads' :key='key'>
					<v-btn @click='selectRoad(key)' large>{{key}}</v-btn>
				</v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>

	<v-dialog v-model='shouldShowStoreDialog' max-width="320" class='mx-4'>
		<v-card>
			<v-card-title>請挑選門市</v-card-title>
			<v-card-text class='pb-0'>
				連續點擊以下門市名稱，可查看地址(若文字過長，請左右滑動查看)，再次點擊可顯示門市名稱。並請勾選以指定門市
			</v-card-text>
			<v-card-actions class='pa-4'>
			<v-list dense style='width: 100%'>
				<v-list-item-group
					v-model="focusedStoreOnStoreList" active-class="pink--text"
				>
				<template v-for="data in dataStores">
					<v-list-item :key="data.name" class='pl-0'>
					<template v-slot:default="{ active }">
						<v-list-item-action class='mr-3'>
						<v-checkbox v-model="pickedStore" :value="data"></v-checkbox>
						</v-list-item-action>
						<v-list-item-content>
							<v-list-item-title class='store-adr'>{{active ? data.adr : data.name}}</v-list-item-title>
						</v-list-item-content>
					</template>
					</v-list-item>
				</template>
				</v-list-item-group>
			</v-list>
			</v-card-actions>
		</v-card>
	</v-dialog>

</div>
<!--eslint-enable-->
</template>



<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { dbService } from '@/services/db.service.ts';
import { apiService } from '@/services/api.service.ts';
import { StoreInfo, CityInfo, DistrictInfo } from '@/helper/shape.ts';

@Component
export default class ShippingWidget extends Vue
{
	private dataCities: CityInfo | null = null;
	private dataDistricts: DistrictInfo | null = null;
	/**
	 * Using with 711-picker only
	 */
	private dataRoads: {[index: string]: boolean} | null = null;
	private dataStores: StoreInfo[] | null = null;

	public preferShippingMethod: string = '711';

	public address: string = '';

	private shouldShow711Picker: boolean = false;
	private shouldShowCityDialog: boolean = false;
	private shouldShowDistrictDialog: boolean = false;
	private shouldShowRoadDialog: boolean = false;
	private shouldShowStoreDialog: boolean = false;

	private focusedStoreOnStoreList: [] = [];

	public pickedCity:string = ""; // e.g. "台北市"
	public pickedDistrict:string = ""; // e.g. "中正區"
	private pickedRoad:string = "";
	public pickedStore:StoreInfo | null = null;

	/**
	 * ⚡️ word around for current data structure, now set
	 *
	 */
	@Watch('pickedStore', {deep: true})
	onChangePickedStore()
	{
		if (
			this.pickedStore !== null &&
			(typeof this.pickedStore !== 'string') // ⚡️
		) {
			this.shouldShowStoreDialog = false;
			this.generateMapOfPickedStore();
		}
	}

	@Watch('preferShippingMethod', {immediate: true})
	populateAddressField(shippingMethod: string)
	{
		const loggedInUser = this.$store.state.loggedInUser;
		if (
			shippingMethod !== '711' &&
			!(loggedInUser.adr && loggedInUser.adr.includes('門市'))
		) {
			this.address = loggedInUser.adr;
		}
	}

	private dataIsRequired(value: string): boolean | string
	{
		return !!value || '此為必填';
	}

	/**
	 *
	 * for more error handling, see below
	 * https://developers.google.com/maps/documentation/javascript/reference/geocoder#GeocoderStatus
	 */
	private generateMapOfPickedStore(): void
	{
		(new google.maps.Geocoder()).geocode({ 'address': this.pickedStore!.geo.join(" ") }, (results:any, status:any) =>
		{
			if (status == google.maps.GeocoderStatus.OK)
			{
				var mapOptions = {
					zoom: 16,
					zoomControl: true,
					zoomControlOptions: {
					style: google.maps.ZoomControlStyle.SMALL
					},
					center: results[0].geometry.location
				}
				new google.maps.Marker({
					map: new google.maps.Map(this.$refs.mapContainer, mapOptions),
					position: results[0].geometry.location,
					draggable: true,
					animation: google.maps.Animation.DROP
				});
			} else {
				console.error(`${this.$options.name} : Google map geocoding error`, status);
			}
		});
	}

	private shippingMethods: {title: string, id: string}[] = [
		{ title: '宅配到府', id: 'home' },
		{ title: '超商寄送 ( 711 )', id: '711' }
	];

	private confirmSelectedStore(): void
	{
		this.shouldShow711Picker = false;
	}

	private async selectRoad (road:string)
	{
		this.pickedStore = null;
		this.pickedRoad = road;
		this.shouldShowRoadDialog = false;

		const apiEndpoint = dbService.buildAPI('stores', this.pickedDistrict, this.pickedRoad);
		let [stores, error] = await apiService.GET(apiEndpoint);

		if (stores === undefined || error) {
			throw new Error(error ? error : "no any matched store on selected road");
		}
		this.dataStores = stores.data;
		this.shouldShowStoreDialog = true;
	}

	private async selectCity(cityInfo: any)
	{
		this.dataDistricts = null;
		this.pickedDistrict = '';

		if (this.shouldShow711Picker)
		{
			this.pickedRoad = '';
			this.pickedStore = null;
		}
		this.pickedCity = cityInfo.zhtw;
		this.shouldShowCityDialog = false;

		const apiEndpoint = dbService.buildAPI('districts', cityInfo.id);
		let [districts, error] = await apiService.GET(apiEndpoint);

		if (districts === undefined || error) {
			throw new Error(error ? error : "no any matched district on selected city");
		}
		this.dataDistricts = districts.data;
		this.shouldShowDistrictDialog = true;
	}

	private async selectDistrict(districtInfo: any)
	{
		this.pickedDistrict = districtInfo.zhtw;
		this.shouldShowDistrictDialog = false;

		if (this.shouldShow711Picker)
		{
			this.dataRoads = null;
			const apiEndpoint = dbService.buildAPIWithShallowQuery('stores', this.pickedDistrict);
			let [roads, error] = await apiService.GET(apiEndpoint);

			if (roads === undefined || error) {
				throw new Error(error ? error : "no any matched road on selected district");
			}
			this.dataRoads = roads.data;
			this.shouldShowRoadDialog = true;
		}
	}

	private chooseShippingMethod(methodId: string): void
	{
		console.log(methodId);
	}

	private async created() {

		const apiEndpoint = dbService.buildAPI('cities');
		let [cities, error] = await apiService.GET(apiEndpoint);

		if ((cities === null) || error) {
			throw new Error(error ? error : "cities data is not found at remote");
		}
		this.dataCities = cities.data;
	}
}
</script>

<style lang='scss' scoped>
.dropdown--adr ::v-deep .v-input__slot { // FIX STYLING BUG
	padding-right: 0 !important;
}
.store-adr {
	overflow-x: scroll;
	text-overflow: unset;
	scrollbar-width: none; /* Firefox */
	&::-webkit-scrollbar { /* WebKit */
		width: 0;
		height: 0;
	}
}
</style>