const fs = require('fs');
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/axioms.ddns.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/axioms.ddns.net/fullchain.pem')
};

const server = require('https').createServer(options);
const io = require('socket.io')(server);

const colors = ["\x1b[31m", "\x1b[32m", "\x1b[33m", "\x1b[34m", "\x1b[35m", "\x1b[36m", "\x1b[37m"]
var activeUsers = {};

io.on('connection', client => {
  
  client.on('message', data => { 
    console.log(colors[data.color] + data.name + ": " + "\x1b[0m" + data.message);
    io.emit('message', data);
  });

  client.on('disconnect', () => { 
    let msg = activeUsers[client.id] + colors[2] + " " + "has left the chat" + "\x1b[0m";
    delete activeUsers[client.id];
    console.log(msg);
    io.emit('leave', msg);
  });

  client.on('join', data => {
    let msg = colors[data.color] + data.name + colors[2] + " " + "has joined the chat" + "\x1b[0m"
    activeUsers[client.id] = "" + colors[data.color] + data.name;
    console.log(msg);
    io.emit('join', msg); 
  });

  client.on('leave', data => {
    
  });
});

server.listen(3000, function () {
  console.log('listening on *:3000');
});