const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' }); // sets VARIABLES.ENV to the db config

mongoose.connect(process.env.DATABASE); // process.env.DATABASE
mongoose.Promise = global.Promise; // tells mongoose which promise library to use
mongoose.connection.on('error', error => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error.message}`); // tells you whether or not the connection to mongodb was successful
});

require('./app/models/User');
require('./app/models/Verification');

const app = require('./app/server.js');

const server = require('http').Server(app); 
const io = require('socket.io', {'forceNew':true})(server);

// admin namespace

const room = io.of('/board');
const connections = [];

room.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length)

    socket.on('join', (data) => {
      socket.join(data.board);
      room.in(data.board).emit('auth', `New user joined the ${data.board}`)
    })

    socket.on('user', (data) => {
      room.in(data.board).emit('user', data);
    })

    socket.once('disconnect', (data) => {
      connections.splice(connections.indexOf(socket), 1);
      socket.disconnect();
      console.log('user disconnected. %s sockets remaining.', connections.length)
      room.emit('auth', 'User disconnected!!!!!!')
    });
})

// sets port for express server
app.set('port', process.env.PORT || 5000);

// listens on port 3000 and enables server to run
server.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// RESEND VERIFICATION LINK
// FORGOTTEN PASSWORD
// HOW TO MAKE DIFFERENT USERS JOIN DIFFERENT ROOMS BASED ON THEIR CREDENTIALS OR RELATIONSHIP WITH ADMIN