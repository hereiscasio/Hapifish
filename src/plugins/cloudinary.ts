import Vue from 'vue';

/**
 * e.g.
 * https://res.cloudinary.com/casio/image/upload/c_scale,dpr_auto,f_auto,q_auto,w_128/v1/hapifish/powder_d600_y4elgd
 */
Vue.use({
	install (Vue) {
		Vue.prototype.$buildCloudinaryImgURL = (imgId: string, imgIdx: number|undefined) =>
		{
			let width, publicId;
			if (imgIdx === undefined)
			{
				width = imgInfo[imgId].width;
				publicId = imgInfo[imgId].publicId;
			}
			else {
				width = imgInfo[imgId]['lpImgWidth'];
				publicId = imgInfo[imgId]['lpImgId'][imgIdx];
			}
			const transformationQuery = `c_scale,f_auto,q_auto,w_${width}`;
			return baseURL + transformationQuery + '/v1/hapifish/' + publicId;
		};
	}
});
const baseURL = 'https://res.cloudinary.com/casio/image/upload/';
const imgInfo: any = {
	thx: {
		width: 210,
		publicId: 'thx_ie4lgs'
	},
	powder: {
		width: 600,
		publicId: 'powder_d600_y4elgd',
		lpImgWidth: 700,
		lpImgId: [
			'powder_lp_1_d700_twhwul',
			'powder_lp_2_d700_j1clm8',
			'powder_lp_3_d700_jdeuu2',
			'powder_lp_4_d700_xxlk8h',
			'powder_lp_5_d700_nrxy3v',
			'powder_lp_6_d700_qgvvvy',
			'powder_lp_7_d700_sfgy3m'
		]
	},
	rose: {
		width: 600,
		publicId: 'rose_d600_rrcn5k',
		lpImgWidth: 700,
		lpImgId: [
			'rose_lp_1_d700_q3hxkc',
			'rose_lp_2_d700_m354b0',
			'rose_lp_3_d700_gtb2su',
			'rose_lp_4_d700_p9kuc7',
			'rose_lp_5_d700_bsfo0k',
			'rose_lp_6_d700_fholn1',
			'rose_lp_7_d700_drmhfs',
			'rose_lp_8_d700_rsampp',
			'rose_lp_9_d700_hrh3a8'
		]
	},
	silk: {
		width: 600,
		publicId: 'silk_d600_n8kss9',
		lpImgWidth: 700,
		lpImgId: [
			'silk_lp_1_d700_xqma75',
			'silk_lp_2_d700_txlfmr',
			'silk_lp_3_d700_bytllh',
			'silk_lp_4_d700_dmn3rj',
			'silk_lp_5_d700_ijijre'
		]
	},
	detergent: {
		width: 600,
		publicId: 'detergent_d600_oxqfid',
		lpImgWidth: 700,
		lpImgId: [
			'detergent_lp_1_d700_cvzmzf',
			'detergent_lp_2_d700_uyfulo',
			'detergent_lp_3_d700_vbpd0x',
			'detergent_lp_4_d700_upgxyh',
			'detergent_lp_5_d700_j70ruo',
			'detergent_lp_6_d700_ybsetw',
			'detergent_lp_7_d700_x0avae'
		]
	},
	testimonial_1: {
		width: 600,
		publicId: 'testimonial_1_d600_bpcuwn'
	},
	testimonial_2: {
		width: 600,
		publicId: 'testimonial_2_d640_nj1jbd'
	},
	slider_item_1: {
		width: 960,
		publicId: 'slider_item_1_d960_waz5gm'
	},
	slider_item_2: {
		width: 960,
		publicId: 'slider_item_2_d960_waxsxw'
	},
	slider_item_3: {
		width: 960,
		publicId: 'slider_item_3_d960_jlkddm'
	},
	shipping_spec: {
		width: 600,
		publicId: 'shipping_spec_d600_caxhtj'
	}
};