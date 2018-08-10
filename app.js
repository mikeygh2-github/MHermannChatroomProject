
const express = require('express');
const app = express();

global.socket_user_ids = [];
global.username_list = [];
global.username_color_list = [];

//set the template engine ejs
app.set('view engine', 'ejs');

//middlewares
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
	res.render('index')
})

//Listen on port 3000
server = app.listen(3000)

//socket.io instantiation
const io = require("socket.io")(server)


//Create listener for socket connection creation.
io.on('connection', (socket) => {
    console.log('New user ' + socket.client.id + ' connected to chatroom.');
    
    try {
        username_list.push("Anonymous");
        socket_user_ids.push(socket.client.id);
    } catch (ex) {
        console.log(ex);
    }

    //default username
    socket.username = "Anonymous";

    //Create listener for username change. 
    socket.on('change_username', (data) => {
        try {
            //If ther is no old username set, then this is a new user. 
            if (data.old_username === "") {
                console.log('A new user has changed their username to ' + data.username + '.');
            } else {
                console.log('User ' + data.old_username + ' has changed their username to ' + data.username + '.');
            }
            socket.username = data.username;
            var user_index = socket_user_ids.indexOf(socket.client.id);
            username_list[user_index] = data.username;

        } catch (ex) {
            console.log(ex);
        }
        
    })

    //Listen for "new_message" event.
    socket.on('new_message', (data) => {
        var userIndex = socket_user_ids.indexOf(socket.client.id);
        //Broadcast the new message.
        io.sockets.emit('new_message', {
            message: data.message,
            username: socket.username,
            userColor: username_color_list[userIndex]
        });
    })

    //Listen for "typing" event.
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { username: socket.username })
    })

    //Listen for "set_color" event.
    socket.on('set_color', (data) => {
        var userIndex = socket_user_ids.indexOf(socket.client.id);
        username_color_list[userIndex] = data.newUserColor;
    })

});

