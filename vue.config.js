'use strict'


const name = 'mall admin' // page title
console.log(process.env.NODE_ENV)
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: true,
    runtimeCompiler: true,
    productionSourceMap: true,
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    devServer: {
        port: 9999,
        open: true,
        https: false,
        overlay: true,
        proxy: { // 设置代理
            '/admin/info': {
                target: 'http://localhost:8080/',
                changeOrigin: true,
                pathRewrite: {
                    '^/admin/info': '/admin/info'
                }
            }
        },
    },
    chainWebpack: config => {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
}
