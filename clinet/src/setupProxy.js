const proxy = require('http-proxy-middleware')

const port = 8000

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target:`http://localhost:8000`,
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
        }})
    )
}