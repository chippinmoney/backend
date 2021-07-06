const { Group } = require('../models/Group')
const { GroupMember } = require('../models/GroupMember')

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

  async incCount(groupId) {
    await Group.updateOne({_id: groupId}, {$inc: {"member.count": 1}})
  }

  async getAmount(groupId) {
    await Group.findOne({_id: groupId}, {name:0, member:0, ewalletId: 0, metadata:0})
  }

  async setAmountUpperLimit(groupId, limit) {
    await Group.updateOne({_id: groupId}, {$set: {"amount.upperLimit": limit}})
  }

  async addAmountCurrent(groupId, amount) {
    await Group.updateOne({_id: groupId}, {$inc: {"amount.current": amount}})
  }

  async getGroupMemberCount(groupId) {
    return await GroupMember.count({groupId})
  }

  async getGroupMember(groupId, userId) {
    return await GroupMember.findOne({groupId, userId})
  }

  async getAllGroupMembers(groupId) {
    return await GroupMember.find({groupId})
  }

  async updateGroupMemberWallet(userId, groupId, ewalletId) {
    await GroupMember.updateOne({userId, groupId}, {$set: {ewalletId}})
  }
}

module.exports = {
  GroupController
}