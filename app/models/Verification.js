const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const verificationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  createdAt: { type: Date, expires: 1800, default: Date.now },
});

verificationSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Verification', verificationSchema);
