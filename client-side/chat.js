const socket = io("http://192.168.0.110:9000")

const message = document.getElementById('message');
const messages = document.getElementById('messages');
const username=document.getElementById('username');
let ids;


const makeRandomColor=()=>{
  var c = '';
  while (c.length < 7) {
    c += (Math.random()).toString(16).substr(-6).substr(-1)
  }
  return '#' + c;
}

const handleSubmitNewMessage = () => {
  ids= makeRandomColor();
  
  socket.emit('message', { data: message.value,name:username.value ,ids})
}

socket.on('message', ( data ) => {
  console.log(data)
  handleNewMessage(data);
})
const deletMessase=(id)=>{
  console.log(id)
}

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
}

const buildNewMessage = (message) => {
  const li = document.createElement("div");
  var element=document.createElement('div');
  element.id = ids;
  element.className="dp"
  element.innerText= message.name+":"+message.data;
  element.addEventListener('click',deletMessase(ids),false)
  console.log(element)
  li.appendChild( element);
  document.getElementById('message').style.backgroundColor = ids ; 
  return li;
}

