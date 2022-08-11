const express = require('express')
const path = require('path')
// const { checkLoginMiddleware } = require('./authorize')
const { registUsrCallback } = require('./user-manage/registControl')
const { loginUsrCallback } = require('./user-manage/loginControl')
const { permissionCallback } = require('./user-manage/permissionControl')
const { initVideoCallback } = require('./video-manage/Play')
const { initPTZControlCallback } = require('./video-manage/PTZ')
const { initSocketEvents } = require('./online-session')

const dotenv = require('dotenv')
dotenv.config()

let app = express()

const PORT = process.env.PORT
// const VIDEO_PORT = process.env.VIDEO_PORT
const FFMPEG_PATH = process.env.FFMPEG_PATH

registUsrCallback(app)
loginUsrCallback(app)
permissionCallback(app)
initPTZControlCallback(app)
initVideoCallback(app, FFMPEG_PATH)

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

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
