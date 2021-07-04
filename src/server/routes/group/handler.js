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
    const {walletId, user_first_name, user_last_name, user_email} = req.body

    // add user to wallet
    const apiResponse = await rapydClient.addWalletContact(walletId, user_first_name, user_last_name, user_email)

    // send result
    res.status(apiResponse.statusCode).send(apiResponse)
  }

  async deleteGroup(req, res) {
    const {groupId} = req.query

    // delete wallet
    const group = await groupController.getById(groupId)
    await rapydClient.deleteWallet(group.ewalletId)

    // delete group and groupmembers
    const promiseList = []
    promiseList.push(groupMemberController.deleteByGroupId(groupId))
    promiseList.push(groupController.delete(groupId))
    await Promise.all(promiseList)

    res.status(200).send("OK")
  }
}

module.exports = {
  GroupHandler
}