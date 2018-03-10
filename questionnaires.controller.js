"use strict"

const responses = require('../models/responses');
const questionnairesService = require('../services/questionnaires.service')
let _apiPrefix

module.exports = apiPrefix => {
    _apiPrefix = apiPrefix
    return {
        read: read,
        createQuestionnaire: createQuestionnaire,
        readQuestionnaireById: readQuestionnaireById,
        updateQuestionnaire: updateQuestionnaire,
        deactivate: deactivate
    }
}

function read(req, res) {
    questionnairesService.read()
        .then(questionnaires => {
            const responseModel = new responses.ItemsResponse()
            responseModel.items = questionnaires
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        });
}

function readQuestionnaireById(req, res) {
    questionnairesService.readQuestionnaireById(req.params.id)
        .then(questionnaire => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = questionnaire
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function createQuestionnaire(req, res) {
    req.model.userId = req.auth.userId
    questionnairesService.createQuestionnaire(req.model)
        .then(id => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = id
            res.status(201)
                .location(`${_apiPrefix}/${id}`)
                .json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function updateQuestionnaire(req, res) {
    questionnairesService //Examine req.model
        .updateQuestionnaire(req.params.id, req.model)
        .then(questionnaire => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function deactivate(req, res) {
    questionnairesService
        .deactivate(req.params.id)
        .then(() => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(new responses.ErrorResponse(err))
        })
}