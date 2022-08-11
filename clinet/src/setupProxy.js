const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target:'http://localhost:8000',
            changeOrigin: true
        }),
        proxy('/vid', {
            target: 'ws://localhost:8000',
            changeOrigin: true,
            ws: true
        }),
        proxy('/assist', {
            target: 'http://localhost:8000',
            changeOrigin: true,
            ws: true
        })
    )
}