
const http = require('http')
const { code_state } = require('./repository')
const { addAssistant, getAssistant, deleteAssistant } = require('./assistants')
// const bodyParser = require('body-parser')

// create server instance which supports socketio
function initOnlineSession(app) {
    let server = http.createServer(app)
    let io = require('socket.io')(server, { cors: true, path:'/assist' })
    return {server, io}
}

// return socketio entity
function initSocketEvents(app) {
    // upload newest code to clinet
    // app.use(bodyParser.json())
    app.post('/api/title',(req, res) => {
        console.log(code_state)
        res.send(code_state[req.body.title])
    })

    const {server, io} = initOnlineSession(app)
    io.on('connection', socket => {
        // when an assistant logs in
        socket.on('login', ({name, room}) => {
            const assistant = addAssistant(socket.id, name, room)
            
            // if(err) return callback(err)
            socket.join(assistant.room)
            socket.in(room).emit('notification',{title:'notification', description:`${assistant.name} enters!`})
            io.in(room).emit('assistants', getAssistant(room))
            // callback()
        })
        // when assistants uploads code to the observer
        socket.on('uploadCode', newcode => {
            const assistant = getAssistant(socket.id)
            code_state[newcode.title] = newcode.code
            io.in(assistant.room).emit('code',{code:newcode.code, title:newcode.title})
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
    return {server, io}
}

module.exports = { initSocketEvents }