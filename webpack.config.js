const path = require("path");
const express = require("express");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const prod = process.env.NODE_ENV === "production";

module.exports = {
	mode: prod ? "production" : "development",
	entry: "./src/index.jsx",
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|jpe?g|gif|svg|webp)$/i,
				type: "asset/resource",
				generator: {
					filename: "images/[name][ext][query]",
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "public/index.html",
			filename: "index.html",
			inject: true,
			minify: {
				collapseWhitespace: true,
			},
			title: "Output Management",
		}),
	],
	resolve: {
		modules: ["./src", "node_modules"],
		extensions: [".js", ".jsx", ".json"],
	},
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
	},
	devServer: {
		port: 8080,
		open: true,
		hot: true,
		historyApiFallback: true,
		proxy: [
			{
				context: ["/api"],
				target: "http://localhost:3001",
				changeOrigin: true,
				secure: false,
			},
		],
	},
};
