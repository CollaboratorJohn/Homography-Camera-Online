const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { imgControlCallback } = require('./img-manage/imgControl')
const { registUsrCallback } = require('./user-manage/registControl')
const { loginUsrCallback } = require('./user-manage/loginControl')
const { permissionCallback } = require('./user-manage/permissionControl')
const { initVideoCallback } = require('./video-manage/Play')
const { initPTZControlCallback } = require('./video-manage/PTZ')
const { initSocketEvents } = require('./online-session')
const dotenv = require('dotenv')
dotenv.config()

let app = express()
app.use(bodyParser.json({limit: '50mb'}))
const PORT = process.env.PORT
const VIDEO_PORT = process.env.VIDEO_PORT
const FFMPEG_PATH = process.env.FFMPEG_PATH

imgControlCallback(app)
registUsrCallback(app)
loginUsrCallback(app)
permissionCallback(app)
initPTZControlCallback(app)
initVideoCallback(FFMPEG_PATH, VIDEO_PORT)

// add static source files in production
if(process.env.ENV === 'PROD') {
    app.use(express.static(path.join(__dirname, './build')))
    app.get('*', (req, res, next) => {
        if (req.url.startsWith('/api')) return next();
        if (req.url.startsWith('/vid')) return next();
        res.sendFile(path.join(__dirname + '/build/index.html'));
    });  
}

// add socket.io realtime communatcate function
app = initSocketEvents(app)
// require('./setupProxy')

app.server.listen(PORT, () => console.log(`Server listening on ${PORT}`))
