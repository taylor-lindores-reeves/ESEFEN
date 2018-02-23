const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' }); // sets VARIABLES.ENV to the db config

mongoose.connect(process.env.DATABASE); // process.env.DATABASE
mongoose.Promise = global.Promise; // tells mongoose which promise library to use
mongoose.connection.on('error', error => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error.message}`); // tells you whether or not the connection to mongodb was successful
});

require('./app/models/Verification');
require('./app/models/User');

const app = require('./app/server.js');

// sets port for express server
app.set('port', process.env.PORT || 5000);

// listens on port 3000 and enables server to run
app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});


// RESEND VERIFICATION LINK
// FORGOTTEN PASSWORD
// SET UP ADMIN PRIVILEGES I.E. DELETING AND VERIFYING OTHER USERS ACCOUNTS