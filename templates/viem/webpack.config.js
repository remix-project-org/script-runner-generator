const path = require('path');
const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    entry: './src/script-runner.ts', // Update the entry point to your TypeScript file
    target: ['web'],
    stats: {
        warnings: false,  // This suppresses all warnings
    },

    output: {
        filename: 'script-runner.js',
        path: path.resolve(__dirname, 'build')
    },
    externals: {
        'ganache': 'var {}'
    },
    resolve: {
        extensions: [".js", ".json", ".ts"],
        fullySpecified: false, // Allows importing without explicit file extension
        fallback: {
            readline: false,
            assert: false,
            path: require.resolve("path-browserify"),
            stream: require.resolve("stream-browserify"),
            'process/browser': require.resolve("process/browser"),
            buffer: require.resolve("buffer"),
            fs: false,
            os: false,
            vm: require.resolve("vm-browserify"),
            crypto: require.resolve("crypto-browserify"),
            constants: require.resolve("constants-browserify"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            zlib: false,
            'child_process': false,
        },
        alias: {
            process: 'process/browser',
            "./config": "./config.js", // Explicitly point to the correct file
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, // Use a regex to test for .ts and .tsx files
                use: 'ts-loader', // Use ts-loader to transpile TypeScript files
                exclude: /node_modules/,
            },
        ],
    },
    experiments: {
        syncWebAssembly: true
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ["buffer", "Buffer"],
            process: 'process/browser',
        }),
        new NodePolyfillPlugin(),
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
            const mod = resource.request.replace(/^node:/, "");
            switch (mod) {
                case "net":
                    resource.request = "net-browserify"; // Example: Replace 'net' with a browser polyfill
                    break;
                case "path":
                    resource.request = "path-browserify"; // Use a browser crypto implementation
                    break;
                default:
                    throw new Error(`Unsupported Node.js module: ${mod}`);
            }
        }),
    ]
};
