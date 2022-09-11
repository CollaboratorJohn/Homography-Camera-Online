const { getImageDb } = require('../db')

const imgControlCallback = app => {
    app.put('/api/capture',(req, res) => {
        const time = req.body.time
        const img = req.body.img
        const sql_add = `INSERT INTO Images (capture_time, img) VALUES (\'${time}\', \'${img}\')`
        getImageDb().exec(sql_add)
        res.json({message: 'success'})
    })
    app.get('/api/savedimgs',(req,res) => {
        const sql_search = 'SELECT capture_time FROM Images'
        const results = getImageDb().prepare(sql_search)
        const times = results.all().map(item => item.capture_time)
        res.json({message: 'success', time: times})
    })
    app.get('/api/imgurl',(req,res) => {
        const id = req.query.id
        const sql_search = `SELECT img FROM Images WHERE ${id} = capture_time`
        const results = getImageDb().prepare(sql_search)
        res.setHeader('Content-Type', 'image/jpeg')
        res.setHeader('accept-range', 'byte')
        res.setHeader('accept-ranges', 'bytes')
        res.send(new Buffer(results.all()[0].img.replace(/^data:image\/\w+;base64,/, ""), 'base64'))
    })
}

module.exports = { imgControlCallback }