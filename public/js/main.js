const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");4
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// get username and room from url

const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

//console.log(username, room);



const socket = io();
socket.emit('joinRoom', {username, room});

socket.on('message', message =>{
    // console.log(message);

    outputMessage(message);


    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;


});

socket.on('roomUsers', message =>{
    // console.log(message);

    updateRoom(message.room);

    updateUserList(message.users);
});
//message submit

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get msg text    
    const msg = e.target.elements.msg.value;

    // Emit message to server. 
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = ''; 
    e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');

    div.classList.add('message');

    div.innerHTML = `<p class="meta">${message.username} <span> ${message.time}</span></p>
    <p class="text">
        ${message.msg}
    </p>`;

    chatMessages.appendChild(div);

}

function updateRoom(room){
    roomName.innerHTML = room;
}

function updateUserList(users){

    userList.innerHTML = '';
    for(let i=0; i<users.length; i++){
        // console.log(users[i]);
        const li = document.createElement("li");
        li.textContent = users[i].username;
        userList.appendChild(li);
    }
}