
const http = require('http')
const { addAssistant, getAssistant, deleteAssistant } = require('./assistants')

// create server instance which supports socketio
function initOnlineSession(app) {
    let server = http.createServer(app)
    let io = require('socket.io')(server, { cors: true, path:'/assist' })
    return {server, io}
}

// return socketio entity
function initSocketEvents(app) {
    const {server, io} = initOnlineSession(app)
    io.on('connection', socket => {
        // when an assistant logs in
        socket.on('login', ({name, room}) => {
            const assistant = addAssistant(socket.id, name, room)
            // console.log(assistant)
            // if(err) return callback(err)
            socket.join(assistant.room)
            socket.in(room).emit('notification',{title:'notification', description:`${assistant.name} enters!`})
            io.in(room).emit('assistants', getAssistant(room))
            // callback()
        })
        // when assistants uploads code to the observer
        socket.on('uploadCode', code => {
            const assistant = getAssistant(socket.id)
            io.in(assistant.room).emit('code',code)
        })
        // when an assistant logs out
        socket.on('disconnect', () => {
            console.log(`${socket.id} assistant logout`)
            const assistant = deleteAssistant(socket.id)
            if(assistant) {
                io.in(assistant.room).emit('notification',{title:'notification', description:`${assistant.name} leaves!`})
            }
        })        
    })
    return server
}

module.exports = { initSocketEvents }