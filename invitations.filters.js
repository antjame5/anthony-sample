"use strict"
const responses = require("../models/responses")
const usersService = require('../services/users.service')

module.exports = {
    resolveUser: _resolveUsername
}

// Route middleware to search if username exist in database
function _resolveUsername(req, res, next) {
    if (req.model.email) {
        next()
    } else {
        usersService.readByUsername(req.model.username)
            .then(user => {
                if (user && req.headers['x-username']) {
                    next()
                } else if (user) {
                    req.model.email = user.email
                    next()
                } else {
                    req.model.noUserFound = true
                    return Promise.reject(new responses.ErrorResponse(`${req.model.username} does not exist`))
                }
            })
            .catch(errors => {
                console.warn(errors)
                res.status(500).send(errors)
            })
    }
}
