const socket = io()

socket.on('messageFromServer', (dataFromServer) => {
          console.log(dataFromServer);
          socket.emit('messageToServer', { data: 'This is live data streaming Michelle 12' })
      })


      document.querySelector('#message-form').addEventListener('submit', (e) => {
          e.preventDefault();
          const newMessage = document.querySelector('#user-message').value;
          console.log(newMessage);
          socket.emit('newMessageToServer', { text: newMessage });
      });

      socket.on('messageToClient', (msg) => {
          document.querySelector('#user-message').value = '';
          console.log(msg)
          document.querySelector('#messages').innerHTML += `<li>${msg.text} </li>`;
      })
  