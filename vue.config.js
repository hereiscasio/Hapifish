const appConfig = require('./src/app.config');
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
	productionSourceMap: false,

	configureWebpack: {
		plugins: [
			new BundleAnalyzerPlugin({
				analyzerMode: 'disabled'
			})
			// new BundleAnalyzerPlugin()
		]
	},

	chainWebpack: config => {
		/**
		 * it can be accessed in index.html to inject the correct title.
		 */
		config.set('name', appConfig.title);

		config.plugins.delete('prefetch');

		/**
		 * Don't allow importing .vue files without the extension, as
		 * it's necessary for some Vetur autocompletions.
		 */
		config.resolve.extensions.delete('.vue');

		// config.optimization.minimize(false);

		if (process.env.NODE_ENV === 'development') {
			config.output.filename('[name].[hash].js').end(); // see Notion
		}

		/**
		 *	Only enable performance hints for production builds, outside of tests.
		 */
		config.performance.hints(
			process.env.NODE_ENV === 'production' &&
			!process.env.VUE_APP_TEST &&
			'warning'
		)
	},

	"transpileDependencies": [
		"vuetify"
	],

	pluginOptions: {
		prerenderSpa: {
			registry: undefined,
			renderRoutes: [
				'/'
			],
			useRenderEvent: true,
			headless: true,
			onlyProduction: true
		}
	}
}
