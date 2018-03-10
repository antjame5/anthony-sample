"use strict"

const router = require('express').Router()
const questionnairesApiPrefix = "api/questionnaires"
const questionnairesControllerFactory = require('../controllers/questionnaires.controller')
const validateBody = require('../filters/validate.body')
const Questionnaire = require('../models/questionnaire')
const idFilter = require("../filters/id.filter")

module.exports = apiPrefix => {
    const questionnairesController = questionnairesControllerFactory(apiPrefix)


    // api routes ================================================================
    router.get('/', questionnairesController.read)

    router.get('/:id([0-9a-fA-F]{24})', questionnairesController.readQuestionnaireById)

    router.post('/', validateBody(Questionnaire), idFilter.bodyIdDisallowed, questionnairesController.createQuestionnaire)

    router.put('/:id([0-9a-fA-F]{24})', validateBody(Questionnaire), idFilter.bodyIdRequired, idFilter.putIdsIdentical, questionnairesController.updateQuestionnaire)

    router.delete('/:id([0-9a-fA-F]{24})', questionnairesController.deactivate)

    return router
}