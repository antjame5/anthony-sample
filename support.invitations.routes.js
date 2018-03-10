"use strict"

const router = require('express').Router()
const supportInvitationsApiPrefix = "api/support-invitations"
const supportInvitationsControllerFactory = require('../controllers/support.invitations.controller')
const invitationsFilters = require('../filters/invitations.filters')
const validateBody = require('../filters/validate.body')
const invitation = require('../models/support.invitation')
const idFilter = require('../filters/id.filter')

module.exports = apiPrefix => {
    const supportInvitationsController = supportInvitationsControllerFactory(apiPrefix)

    // api routes ===========================================================
    router.get('/', supportInvitationsController.read)
    router.post('/', validateBody(invitation), idFilter.bodyIdDisallowed, invitationsFilters.resolveUser, supportInvitationsController.create)
    router.post('/confirm/:inviteId([0-9a-fA-F]{24})', supportInvitationsController.confirm)
    router.delete('/:id([0-9a-fA-F]{24})', supportInvitationsController.delete)

    return router
}