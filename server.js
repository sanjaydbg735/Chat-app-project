const path = require('path');
const express = require('express');
const http = require('http');
const formatMsg = require('./utils/formatMessage');
const {userjoin, getCurrentUser, userLeaves, getRoomUsers} = require('./users');

const socketio = require('socket.io');
// const { log } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// for static folders
app.use(express.static(__dirname + "/public"));

// when clint connects..
io.on('connection', socket=>{

    socket.on('joinRoom', ({username, room})=>{

        const user = userjoin(socket.id, username, room);

        socket.join(user.room);

        // welcome
        socket.emit('message', formatMsg('bot', 'Welcome to chatApp!'));          // Only to user

        //BroadCast when a user connects.   // broadcast to everybody expect user.
        socket.broadcast.to(user.room).emit('message', formatMsg('bot',`${user.username} has joined the chat`));


        // send users and room info.
        io.to(user.room).emit('roomUsers', {
            room : user.room, 
            users : getRoomUsers(user.room)
        });

    })

    socket.on('chatMessage', msg=>{
        const user = getCurrentUser(socket.id);
        // console.log(user);
        io.to(user.room).emit('message', formatMsg(user.username, msg));
    });


    // BroadCast message from user.     // broadCast to everybody.
    socket.on('disconnect',() =>{
        const user = userLeaves(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMsg('bot', `${user.username} has left the chat.`));

            // send users and room info.
            io.to(user.room).emit('roomUsers', {
                room : user.room, 
                users : getRoomUsers(user.room)
            });
        }

        
        
        
    });
});

const PORT = 3000 || process.env.PORT;


server.listen(PORT, ()=> console.log('Server running on port 3000'));