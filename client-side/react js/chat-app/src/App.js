import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import io from "socket.io-client";
import { useState } from 'react'
import { MdAutoDelete } from 'react-icons/md';

function App() {
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [cmd, setComd] = useState('add');
  const [messageData, setMessageData] = useState([]);
  const socket = io("http://localhost:9000");
  function randomColor() {
    const color = 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')';

    return color;
  }
  const generateId = () => {
    let ids = Math.round(Math.random() * 255) + Math.round(Math.random() * 255);
    console.log(ids)
    return ids
  }
  const handleSubmitNewMessage = async () => {

    let ids = generateId();
    let color = randomColor();

    if (userName.length !== 0 || message.length !== 0) {
      let time = Date.now()
      let massageTime = DateTimetransform(time);
      let newUserName = userName;
      let newMessage = message
      const initialValue = { message: newMessage, name: newUserName, id: ids, cmd: cmd, color: color, time: massageTime };
      socket.emit('message', initialValue)
      setMessage('')

    }

  }
  socket.on('message', async (data) => {
    if (data.cmd === 'add') {
      setMessageData([...messageData, data]);
    } else if (data.cmd === 'delete') {
      deleteItems(data);
    }
  })
  const deleteItems = async (data) => {
    //setMessageData([...messageData].filter(item=>item.id!==data.id))
    document.getElementById(data.id).style.display = 'none';
    const initialValue = { message: data.message, name: data.name, id: data.id, color: data.color, cmd: 'delete' };
    socket.emit('message', initialValue)

  }
  const DateTimetransform = (value) => {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let counter;
      for (const i in intervals) {
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
      }
    }
    return value;
  }



  return (
    <div className="App">
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-sm-12'>
            <h1 className="text-center">welecome to Chat application</h1>
            <div>
              <input type="text" v-model="name" onChange={e => setUserName(e.target.value)} id="username" className="form-control" placeholder="Enter name..." />
            </div>
            <div className="card">
              <div id="mass" className="card-block" >
                {messageData.map((data, index) =>
                (
                  <div className='dropdown'>
                    <div className="card" id={data.id} style={{ color: data.color, display: 'flex' }}>
                      <div className="container darker">
                        <p>{data.name}:  {data.message}</p>
                        <span className="time-left" >{data.time}</span>
                      </div>
                    </div>
                    <div className="dropdown-content">
                      <MdAutoDelete className='deleteBtn' style={{ color: data.color }} onClick={() => deleteItems(data)} key={index} />
                    </div>
                  </div>

                )
                )}
              </div>
              <textarea className="form-control" value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message..."></textarea>
              <button className="btn" onClick={handleSubmitNewMessage}>Send</button>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
