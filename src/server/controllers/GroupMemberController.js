const { GroupMember } = require('../models/GroupMember')

class GroupMemberController {
  constructor() {

  }

  async create(userId, groupId) {
    return await GroupMember.create({
      userId,
      groupId
    })
  }

  async delete(memberId) {
    return await GroupMember.deleteOne({_id: memberId})
  }

  async getMembersByGroupId(groupId) {
    return await GroupMember.find({groupId})
  }

  async deleteByGroupId(groupId) {
    return await GroupMember.remove({groupId})
  }
}

module.exports = {
  GroupMemberController
}