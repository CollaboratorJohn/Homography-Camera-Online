const express = require('express')
// const { checkLoginMiddleware } = require('./authorize')
const { registUsrCallback } = require('./user-manage/registControl')
const { loginUsrCallback } = require('./user-manage/loginControl')
const { permissionCallback } = require('./user-manage/permissionControl')
const { initVideoCallback } = require('./video-manage')

const dotenv = require('dotenv')
dotenv.config()

const app = express()

const PORT = process.env.PORT
// const VIDEO_PORT = process.env.VIDEO_PORT
const FFMPEG_PATH = process.env.FFMPEG_PATH

registUsrCallback(app)
loginUsrCallback(app)
permissionCallback(app)
initVideoCallback(app, FFMPEG_PATH)

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
