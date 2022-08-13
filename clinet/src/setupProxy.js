const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target:'http://localhost:8000',
            changeOrigin: true
        }),
        proxy('/vid', {
            target: 'http://202.121.181.12:8001',
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