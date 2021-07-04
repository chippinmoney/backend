const { Group } = require('../models/Group')

class GroupController {
  constructor() {

  }

  async create(name, upperLimit, memberCount, ewalletId) {
    return await Group.create({
      name,
      amount: {upperLimit},
      member: {count: memberCount},
      ewalletId
    })
  }

  async delete(groupId) {
    return await Group.deleteOne({_id: groupId})
  }

  async getById(groupId) {
    return await Group.findOne({_id: groupId})
  }
}

module.exports = {
  GroupController
}