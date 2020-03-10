import Vue from 'vue';

/**
 *
 * @param this : typescript feature, this only work for ts itself only, we can't access this parameter in actual
 * @param eventName
 * @param cb
 */
export function subscribe (this: Vue, eventName: string, cb: any)
{
	this.$eventBus.$on(eventName, cb);

	this.$once('hook:beforeDestroy', () => {
		this.$eventBus.$off(eventName, cb);
	});
}

export function fire (this: Vue, eventName: string, payload?: any)
{
	this.$eventBus.$emit(eventName, payload);
}