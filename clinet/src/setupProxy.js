const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target:`http://localhost:8000`,
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
        }}),
        proxy('/vid', {
            target: 'ws://localhost:8000',
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                "^/vid": ""
            }
        })
    )
}