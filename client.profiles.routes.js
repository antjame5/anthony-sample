"use strict"

const router = require('express').Router()
const clientProfileApiPrefix = "api/client-profiles"
const clientProfileControllerFactory = require('../controllers/client.profiles.controller')
const validateBody = require('../filters/validate.body')
const validateId = require('../filters/id.filter')
const profile = require('../models/client.profile')

module.exports = apiPrefix => {
    const clientProfileController = clientProfileControllerFactory(apiPrefix)
    router.get('/', clientProfileController.read)
    router.get('/:id([0-9a-fA-F]{24})', clientProfileController.readById)
    router.get('/user/:id([0-9a-fA-F]{24})', clientProfileController.readByUserId)
    router.post('/createProfile', validateBody(profile), validateId.bodyIdDisallowed, clientProfileController.create)
    router.put('/createProfile/:id([0-9a-fA-F]{24})', validateBody(profile), validateId.bodyIdRequired, validateId.putIdsIdentical,  clientProfileController.update)
    router.delete('/:id([0-9a-fA-F]{24})', clientProfileController.delete)
    
    
    return router
}  