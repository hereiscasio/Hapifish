/**
 * e.g.
 * `export interface Record {
 * 	clockIn?: string;
 *	clockOut?: string;
 *	date?: number;
 * }`
 *
 * then u can import this "shape" into file
 * by using `import { Record } from '@/helper/shape'`
 */

export interface UserInfo {
	uid: string;
	phoneNumber?: string | null;
	displayName?: string | null;
	email?: string | null;
	adr?: string | null;
}

/**
 * TODO: 如何靠 TS 判別 "非空字串"？
 */
export interface ProductInfo {
	id: string;
	title: string;
	subTitle: string;
	spec: string;
	price: number;
	mainImg: string;
}

export interface CostSummarize {
	title: string;
	id: string;
	value: number;
}

export interface ProductInCart {
	id: string;
	quantity: number;
}


export interface StoreInfo {
	adr: string,
	disable: boolean,
	geo: [number, number],
	name: string
}

export interface CityInfo {
	en: string;
	id: string;
	zhtw: string;
}

export interface DistrictInfo extends CityInfo {
	zipcode: string;
}
