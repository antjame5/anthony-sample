"use strict"

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const schema = {
    bio: Joi.string().required().max(700),
    isBioPublic: Joi.boolean(),
    bioViewerIds: Joi.array().items(Joi.objectId()).unique().default([]),
    reason: Joi.string().max(500).required(),
    gender: Joi.string().required().max(20),
    agreesToTerms: Joi.boolean().invalid(false).required(),
    referralDescription: Joi.string().allow('', null).max(200),
    referralSource: Joi.string().valid('Friend', 'Therapist', 'WebSearch', 'Doctor', 'Other').required(),
    _id: Joi.objectId()

}

module.exports = Joi.object().keys(schema)