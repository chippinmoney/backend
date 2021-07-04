const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GroupSchema = new Schema({
  name: {type: String, required: true},
  amount: {
    upperLimit: {type: Number, default: 0},
    current: {type: Number, default: 0}
  },
  member: {
    count: {type: Number, default: 0}
  },
  ewalletId: {type: String, required: true},
  metadata: {type: Schema.Types.Mixed}
})

const Group = mongoose.model('Group', GroupSchema)

module.exports = {
    Group
}