const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

function resolvePath(__path) {
	return path.join(path.resolve(__dirname, '.'), __path);
}

module.exports = {
	entry: {
		app: ['@babel/polyfill', './src/app.ts']
	},

	output: {
		path: resolvePath('dist'),
		filename: 'scripts/[name]' + '.js'
	},

	resolve: {
		extensions: ['.js', '.ts', '.css', '.scss', '.json']
	},

	module: {
		rules: [
			// /**
			//  * TS loader for typescript files
			//  *
			//  */
			{
				test: /\.ts?$/,
				use: [
					{
						loader: 'awesome-typescript-loader'
					}
				]
			},
			// /**
			//  * JS rule with babel compile modern JS to common js for old browsers
			//  *
			//  */
			{
				test: /\.js$/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			/**
			 * sass loader support for *.scss files (styles directory only)
			 *
			 */
			{
				test: /\.s?css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
						// extract ccs from js compile for production deployments
					},
					{
						loader: 'css-loader'
						// translates CSS into CommonJS
					},
					{
						loader: 'sass-loader'
						// compiles Sass to CSS
					}
				]
			},
			/**
			 * File loader for supporting images
			 */
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: 'file-loader?name=img/[name].[ext]',
				include: [resolvePath('branding/img')]
			},

			/**
			 * File loader for supporting fonts
			 */
			{
				test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
				use: 'file-loader?name=fonts/[name].[ext]',
				include: [resolvePath('branding/fonts'), resolvePath('node_modules/font-awesome/fonts')]
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			minify: {
				collapseWhitespace: true,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new MiniCssExtractPlugin({
			filename: 'branding/styles/main.css'
		}),
		new CleanWebpackPlugin()
	],

	devtool: devMode ? 'source-map' : ''
};
