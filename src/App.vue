<template>
<!-- eslint-disable vue/no-v-html -->
<v-app>
	<Header/>
	<v-content :style='{"max-width": "960px", "width": "100%"}' class='mx-auto'>
		<router-view></router-view>
	</v-content>

	<component :is="componentId" @onHideDialog='componentId = ""'></component>
</v-app>
<!--eslint-enable-->
</template>

<script lang="ts">
import { Error, User } from '@firebase/auth-types';
import { Component, Vue } from 'vue-property-decorator';
import { userDbService } from '@/services/db.service.ts';
import Header from '@/components/Header.vue';

@Component({
  components:
  {
	Header,
	Testimonial: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "test" */ '@/components/dialogs/Testimonial.vue'),
	AboutUs: () => import(/* webpackPrefetch: true */ /* webpackChunkName: "about" */ '@/components/dialogs/AboutUs.vue'),
	Logout: () => import(/* webpackChunkName: "logout" */ '@/components/dialogs/Logout.vue'),
	Thx: () => import(/* webpackChunkName: "thx" */ '@/components/dialogs/Thx.vue')
  }
})
export default class App extends Vue
{
	private componentId: string = '';
	private payload: any = '';

	private created (): void
	{
		this.$subscribe(
			'request-dialog',
			(componentId: string) => this.componentId = componentId
		);
	}

	private mounted(): void {
		document.getElementById('loading-indicator')!.style.display = 'none';
	}
}
</script>

<style lang='scss' scoped>
@import "normalize.css/opinionated.css";
</style>