const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        app: [
            './docs/index.tsx'
        ]
    },
    devServer: {
        contentBase: './docs',
        hot: true
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './docs')
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules)/,
                loader: "ts-loader"
            },
            {
                "test": /\.scss$/,
                "use": [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            },
        ]
    }
};