"use strict"

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const schema = {
        _id: Joi.objectId(),
        name: Joi.string().max(75).required(),
        description: Joi.string().max(500).required(),
        traumaTypeIds: Joi.array().items(Joi.objectId()).unique().default([]),
        isDraft: Joi.valid(true, false),
        questions: Joi.array().items(Joi.object({
                prompt: Joi.string().max(150).required(),
                description: Joi.string().max(500).allow(''),
                type: Joi.string().valid("short-text", "long-text", "multiple", "single", "emoji").required(),
                answers: Joi.alternatives().when('type', { is: Joi.any().valid('single', 'multiple'), then: Joi.array().items(Joi.string()), otherwise: Joi.any().allow([]).required() })
        })).min(1).required()
}

module.exports = Joi.object().keys(schema)

