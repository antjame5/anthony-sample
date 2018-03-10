"use strict"

const Joi = require("joi")
Joi.objectId = require("joi-objectid")(Joi)

const userSchema = {
    _id: Joi.objectId(),
    firstName: Joi.string().regex(/^[a-zA-Z]{1,16}$/).required(),
    lastName: Joi.string().regex(/^[a-zA-Z]{1,20}$/).required(),
    username: Joi.string().regex(/^[a-zA-Z0-9-_]{5,18}$/).required(),
    imageUrl: Joi.string().uri({ allowRelative: true }).max(1000).allow("", null),
    phone: Joi.number().integer().min(1000000000).max(9999999999).allow("", null),
    email: Joi.string().email().required(),
    supporterIds: Joi.array().items(Joi.objectId()).allow("", null),
    password: Joi.string().regex(/^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{6,24}$/).required(),
    userType: Joi.string().valid("Client", "Therapist", "Supporter", "Admin").required(),
    agreesToPrivacyStatement: Joi.boolean().invalid(false).required()
}

module.exports = Joi.object().keys(userSchema)
