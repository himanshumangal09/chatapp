const express = require('express');
const path = require('path');
const http = require('http');
const socketio=require('socket.io')
const Filter = require('bad-words')
const {genrateMessage}=require('./utils/messages')
const {genrateLocationMessage} = require('./utils/messages')
const {addUser,removeUser, getUser,getuserinroom} = require('./utils/users')
const app = express();
const server = http.createServer(app);
var port = process.env.PORT||3000;
const io = socketio(server)
io.on('connection',(socket)=>{
    socket.on('join',({username,room},callback)=>{
        socket.join(room)
       const {error,user} = addUser({id:socket.id,username,room})
       if(error)
       {
            return callback(error)
       }

        socket.emit('message',genrateMessage(user.username,'Welcome'))
        socket.broadcast.to(user.room).emit('message',genrateMessage(user.username,`${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getuserinroom(user.room)
        })
        callback(); 
    })
    socket.on('disconnect',()=>{
    const user = removeUser(socket.id)
    if(user)
        {
            io.to(user.room).emit('message',genrateMessage(user.username,`${user.username} has been disconnected`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getuserinroom(user.room)
            })
         }
    
    })
    socket.on('sendmessage',(message,callback)=>{
        const filter= new  Filter()
        if(filter.isProfane(message))
        {
            return callback('Profanity is not allowed')
        }
        const user = getUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('message',genrateMessage(user.username,message))
            callback()   
        }
    })
    socket.on('sendlocation',(coords,callback)=>{
        const user = getUser(socket.id)
        if(user)
        {
            io.to(user.room).emit('locationmessage',genrateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
            callback();   
        }
})

})
const publicpath=path.join(__dirname,'../public')
app.use(express.static(publicpath))
server.listen(port,()=>{
    console.log('server at port' + port)
})