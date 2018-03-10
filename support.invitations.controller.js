"use strict"

const responses = require('../models/responses');
const supportInvitationsService = require('../services/support.invitations.service')
const emailsService = require('../services/emails.service')
const userService = require('../services/users.service')
let _apiPrefix

module.exports = apiPrefix => {
    _apiPrefix = apiPrefix
    return {
        read: read,
        create: create,
        delete: _delete,
        confirm: _confirm
    }
}

function read(req, res) {
    supportInvitationsService.read()
        .then(tags => {
            const responseModel = new responses.ItemsResponse()
            responseModel.items = tags
            res.json(responseModel)
        })
        .catch(error => {
            console.error(error)
            res.status(500).send(new responses.ErrorResponse(err))
        });
}

function create(req, res) {
    let fromName, toName, toAddress, inviteId
    const responseModel = new responses.ItemResponse()
    req.model.userId = req.auth.userId
    userService.readById(req.model.userId)
        .then(client => {
            fromName = `${client.firstName} ${client.lastName}`
            toAddress = req.model.email
            return supportInvitationsService.create(req.model)
        })
        .then(id => {
            inviteId = id           
            return emailsService.sendSupportInvitation(fromName, toName, toAddress, inviteId)
        })
        .then(response => {
            responseModel.item = inviteId
            res.status(201)
                .location(`${_apiPrefix}/${inviteId}`)
                .json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function _delete(req, res) {
    supportInvitationsService.delete(req.params.id, req.model)
        .then(() => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(new responses.ErrorResponse(err))
        })
}
function _confirm(req, res) {
    supportInvitationsService.readById(req.params.inviteId)
        .then(data => {
            return usersService.readById(data.userId)
        })
        .then(data => {
            data.supporterIds.push(req.body.supportId)
            return usersService.update(data._id, data)
        })
        .then(data => {
            return usersService.updateIsEmailConfirmed(req.body.supportId)
        })
        .then(response => {
            const responseModel = new responses.ItemResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.warn(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}