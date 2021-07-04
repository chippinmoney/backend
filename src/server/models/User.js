const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {type: String, required: true, unique: false},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, unique: false},
  metadata: {type: Schema.Types.Mixed}
})

const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}