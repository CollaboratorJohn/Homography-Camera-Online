const express = require('express')
// const { checkLoginMiddleware } = require('./authorize')
const { registUsrCallback } = require('./user-manage/registControl')
const { loginUsrCallback } = require('./user-manage/loginControl')
const { permissionCallback } = require('./user-manage/permissionControl')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

const PORT = process.env.PORT

registUsrCallback(app)
loginUsrCallback(app)
permissionCallback(app)

app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
