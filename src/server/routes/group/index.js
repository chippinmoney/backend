const GroupHandler = require('./handler').GroupHandler;
const express = require('express')
const groupRouter = express.Router()

const groupHandler = new GroupHandler()

// create group
groupRouter.post('/', groupHandler.createGroup)

// add member to group
groupRouter.post('/member', groupHandler.addGroupMember)

// delete group
groupRouter.delete('/', groupHandler.deleteGroup)

// get group
groupRouter.get('/', groupHandler.getGroup)

// set upper-limit in group
groupRouter.post('/fund/upperLimit', groupHandler.setUpperLimit)

// add member to group
groupRouter.post('/member/money', groupHandler.addMoney)



module.exports = {
  groupRouter
}