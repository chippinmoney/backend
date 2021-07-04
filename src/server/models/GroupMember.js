const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupMemberSchema = new Schema({
  userId: {type: String, required: true},
  groupId: {type: String, required: true},
  amount: {
    contributed: {type: Number, default: 0},
  },
  metadata: {type: Schema.Types.Mixed}
})

const GroupMember = mongoose.model('GroupMember', GroupMemberSchema)

module.exports = {
    GroupMember
}