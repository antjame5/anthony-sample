'use strict'

const Questionnaire = require('../models/questionnaire')
const mongodb = require('../mongodb')
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId

module.exports = {
    read: read,
    createQuestionnaire: createQuestionnaire,
    readQuestionnaireById: readQuestionnaireById,
    updateQuestionnaire: updateQuestionnaire,
    deactivate: deactivate
}

function read() {
    return conn.db().collection('questionnaires').find({ dateDeactivated: null }).toArray().then(questionnairesArray => {
        for (let i = 0; i < questionnairesArray.length; i++) {
            const questionnaire = questionnairesArray[i];
            questionnaire._id = questionnaire._id.toString()
            questionnaire.userId = questionnaire.userId.toString()

            for (let q = 0; q < questionnairesArray[i].traumaTypeIds.length; q++) {
                let traumaTypeId = questionnairesArray[i].traumaTypeIds
                traumaTypeId[q] = traumaTypeId[q].toString()
            }

        }
        return questionnairesArray
    })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function readQuestionnaireById(id) {
    return conn.db().collection('questionnaires').findOne({ _id: new ObjectId(id) })
        .then(questionnaire => {
            questionnaire._id = questionnaire._id.toString()
            questionnaire.userId = questionnaire.userId.toString()

            for (let i = 0; i < questionnaire.traumaTypeIds.length; i++) {
                let traumaTypeId = questionnaire.traumaTypeIds
                traumaTypeId[i] = traumaTypeId[i].toString()
            }
            return questionnaire
        })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function createQuestionnaire(model) {
    const safeDoc = {
        userId: new ObjectId(model.userId),
        name: model.name,
        description: model.description,
        traumaTypeIds: [],
        isDraft: model.isDraft,
        questions: [],
        dateCreated: new Date(),
        dateModified: new Date()
    }

    for(let traumaTypeId of model.traumaTypeIds){
        safeDoc.traumaTypeIds.push(new ObjectId(traumaTypeId))
    }

    for (let question of model.questions) {
        const questionSafeDocs = {
            prompt: question.prompt,
            description: question.description,
            type: question.type,
            answers: []
        }

        for(let answer of question.answers){
            let answerSafeDocs = answer
            questionSafeDocs.answers.push(answerSafeDocs)
        }
        safeDoc.questions.push(questionSafeDocs)
    }

    return conn.db().collection('questionnaires').insertOne(safeDoc)
        .then(result => result.insertedId.toString())
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })
}

function updateQuestionnaire(id, model) {
    const safeDoc = {
        _id: new ObjectId(model._id),
        name: model.name,
        description: model.description,
        traumaTypeIds: [],
        isDraft: model.isDraft,
        questions: [],
        dateModified: new Date()
    }

    for(let traumaTypeId of model.traumaTypeIds){
        safeDoc.traumaTypeIds.push(new ObjectId(traumaTypeId))
    }

    for (let question of model.questions) {
        const questionSafeDocs = {
            prompt: question.prompt,
            description: question.description,
            type: question.type,
            answers: []
        }

        for(let answer of question.answers){
            let answerSafeDocs = answer
            questionSafeDocs.answers.push(answerSafeDocs)
        }
        safeDoc.questions.push(questionSafeDocs)
    }

    return conn.db().collection('questionnaires').updateOne({ _id: new ObjectId(id) }, { $set: safeDoc }) //Examine safeDoc
        .then(result => { return result.matchedCount })
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}

function deactivate(id) {
    return conn.db().collection('questionnaires').updateOne({ _id: new ObjectId(id) }, { $set: { dateDeactivated: new Date(), dateModified: new Date() } })
        .then(deleteResult => undefined)
        .catch(err => {
            console.warn(err)
            return Promise.reject(err)
        })
}