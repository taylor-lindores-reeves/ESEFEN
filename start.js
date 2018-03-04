const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' }); // sets VARIABLES.ENV to the db config

mongoose.connect(process.env.DATABASE); // process.env.DATABASE
mongoose.Promise = global.Promise; // tells mongoose which promise library to use
mongoose.connection.on('error', error => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error.message}`); // tells you whether or not the connection to mongodb was successful
});

require('./app/entities/user/user.model');
require('./app/entities/admin/verification.model');

const app = require('./app/server.js');

const server = require('http').Server(app); 
const io = require('socket.io', {'forceNew':true})(server);

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


// SERVER
// 1. resend a verification link functionality
// 2. add forgotted password functionality
// 3. enable users to join different rooms and admins based on some criteria
// 4. let admins see all users currently in their session
// 5. use the keystone way to render views. looks good.


// STYLE
// 1. style the header
// 2. use res.locals to display stuff
// User registers and upon registering is asked for email address of administrator. 
// This creates a connection between admin and user. Once user is verified by admin, 
// there is a link between the admin who verified and therefore only these users are displayed on board.