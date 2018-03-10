"use strict"

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const schema = {

    _id: Joi.objectId(),
    username: Joi.when('email', {is: Joi.exist(), then: Joi.forbidden(), otherwise: Joi.required().disallow("", null)}),
    email: Joi.string().email().disallow("", null).optional()

}

module.exports = Joi.object().keys(schema)