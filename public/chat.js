
$(function () {
   	//Set the socket and create the connection.
    var socket = io.connect('http://localhost:3000');


	//Set the buttons 
    var message = $("#message");
    var username = $("#username");
    var old_username = $("#old_username");
    var send_message = $("#send_message");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");
    var usercolor = $("#usercolor");
    var send_usercolor = $("#send_usercolor");

    var newUserColor = getRandomColor();
    //Trigger a set_color event.
    socket.emit('set_color', { newUserColor: newUserColor });
    //Hide alerts initially.
    $("#change_name_alert").hide();
    $("#change_color_alert").hide();

    //Listen for new messages("new_message" event).
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');
        chatroom.append("<p class='message' style='background-color:"
            + data.userColor + ";'>" + data.username + ": " + data.message + "</p>");
    })
    
	//Emit message.
    send_message.click(function () {
        socket.emit('new_message', { message: message.val() });
	})
	//Emit a change_username event on button click;
    send_username.click(function () {
        socket.emit('change_username', { username: username.val(), old_username: old_username.val() })
        $("#old_username").val(username.val());
        $("#userNameDiv").text(username.val());
        $("#change_name_alert").fadeTo(2000, 500).slideUp(500, function () {
            $("#change_name_alert").slideUp(500);
        });
    });

    //Emit a change_user_color event on button click;
    send_usercolor.click(function () {
        debugger;
        socket.emit('set_color', { newUserColor: "#" + usercolor.val() });
        $("#change_color_alert").fadeTo(2000, 500).slideUp(500, function () {
            $("#change_color_alert").slideUp(500);
        });
    });

	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})

	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});

//Called when a connection to set a color for the new
//user's messages. 
function setNewUserColor() {
    username_color_list = [];
    var newRandomColor = getRandomColor();
    while (username_color_list.indexOf(newRandomColor) > 0) {
        newRandomColor = getRandomColor();
    }
    username_color_list.push(newRandomColor);
    return newRandomColor;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
