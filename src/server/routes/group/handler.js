const { RapydClient } = require("../../../rapyd/client");
const { ADMIN, RAPYD_API } = require("../../../config/rapyd");
const { GroupController } = require('../../controllers/GroupController')
const { GroupMemberController } = require('../../controllers/GroupMemberController')

const config = {
  secret_key: RAPYD_API.secret_key,
  access_key: RAPYD_API.access_key
}
const rapydClient = new RapydClient(config)

const groupController = new GroupController()
const groupMemberController = new GroupMemberController()

class GroupHandler {

  async createGroup(req, res) {
    console.log('post: /group/')
    const {group_name, user_first_name, user_last_name, user_email} = req.body
    const {first_name, last_name} = { ADMIN }

    // create wallet
    const groupResponse = await rapydClient.createWallet(first_name, last_name)
    const walletId = groupResponse.result.data.id
  
    // add user to wallet
    await rapydClient.addWalletContact(walletId, user_first_name, user_last_name, user_email)

    // create group
    const group = await groupController.create(group_name, 0, 1, walletId)
    
    // send result
    res.status(apiResponse.statusCode).send(group)
  }

  async addGroupMember(req, res) {
    console.log('post: /group/member')
    const {groupId, userId, walletId, user_first_name, user_last_name, user_email} = req.body

    // add user to wallet
    const apiResponse = await rapydClient.addWalletContact(walletId, user_first_name, user_last_name, user_email)

    // update member details
    await groupController.incCount(groupId)
    await groupController.updateGroupMemberWallet(userId, groupId, walletId)

    // send result
    res.status(apiResponse.statusCode).send(apiResponse)
  }

  async deleteGroup(req, res) {
    console.log('delete: /group/')
    const {groupId} = req.query

    // allow deletion only when group wallet is empty
    const groupAmount = await groupController.getAmount(groupId)
    if (groupAmount.current == 0) {
      // delete wallet
      const group = await groupController.getById(groupId)
      await rapydClient.deleteWallet(group.ewalletId)

      // delete group and groupmembers
      const promiseList = []
      promiseList.push(groupMemberController.deleteByGroupId(groupId))
      promiseList.push(groupController.delete(groupId))
      await Promise.all(promiseList)

      res.status(200).send("OK")
    } else {
      res.status(400).send("GROUP_WALLET_NOT_EMPTY")
    }
  }

  async getGroup(req, res) {
    console.log('get: /group/')
    const {groupId} = req.query

    const group = await groupController.getById(groupId)
    res.status(200).send(group)
  }

  async setUpperLimit(req, res) {
    console.log('post: /group/fund/upperLimit')
    const {upperLimit, groupId} = req.body

    await groupController.setAmountUpperLimit(groupId, upperLimit)
    res.status(201).send("SUCCESS")
  }

  async addMoney(req, res) {
    console.log('post: /group/member/fund')
    const {userId, amount, userWalletId, groupId, groupWalletId} = req.body

    const groupAmount = await groupController.getAmount(groupId)
    const groupCount = await groupController.getGroupMemberCount(groupId)
    const perMemberLimit = groupAmount.upperLimit / groupCount
    const groupMember = await groupController.getGroupMember(groupId, userId)

    // if final amount is less than upperLimit
    // and it satisfies maximum ratio limit, 
    // allow fund transfer
    if (
      groupAmount.current + amount <= groupAmount.upperLimit &&
      groupMember.amount.contributed + amount <= perMemberLimit
    ) {
      const apiResponse = await rapydClient.transferFromToWallet(amount, userWalletId, groupWalletId)
      await groupController.addAmountCurrent(groupId, amount)
      res.status(apiResponse.statusCode).send(apiResponse.result)
    }

    // else reject fund transfer
    else {
      res.status(400).send("CONTRIBUTION_LIMIT_EXCEEDED")
    }
  }

  async autoDisperseMoney(req, res) {
    console.log('post: /group/fund/disperse')
    const {groupId, groupWalletId} = req.body

    // calculate per-person split
    const groupAmount = await groupController.getAmount(groupId)
    const groupCount = await groupController.getGroupMemberCount(groupId)
    const perPersonSplit = groupAmount.current / groupCount
    const groupMemberList = await groupController.getAllGroupMembers(groupId)

    const transactionList = []
    groupMemberList.map(groupMember => {
      transactionList.push(rapydClient.transferFromToWallet(perPersonSplit, groupWalletId, groupMember.ewalletId))
    })
    await Promise.all(transactionList)

    res.status(200).send("SUCCESS")
  }
}

module.exports = {
  GroupHandler
}