"use strict"

const responses = require('../models/responses');
const clientProfileServices = require('../services/client.profiles.service')
let _apiPrefix

module.exports = apiPrefix => {
    _apiPrefix = apiPrefix
    return {
        read: read,
        readById: readById,
        create: create,
        update: update,
        delete: _delete,
        readByUserId: readByUserId
        }
}

function read(req, res) {
    clientProfileServices.read()
        .then(clientProfiles => {
            const responseModel = new responses.ItemsResponse()
            responseModel.items = clientProfiles
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        });
}

function readById(req, res) {
    clientProfileServices.readById(req.params.id)
        .then(profile => {
            const responseModel = new responses.ItemResponse()
            responseModel.item = profile
            res.json(responseModel)
        })
        .catch(err => {
            console.log(err)
            res.status(500).send(new responses.ErrorResponse(err))
        })
}

function readByUserId(req, res) {
    clientProfileServices.readByUserId(req.params.id)
    .then( profile => {
        const responseModel = new responses.ItemResponse()
        responseModel.item = profile
        res.json(responseModel)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(new responses.ErrorResponse(err))
    })
}

function create(req, res) {
      req.model.userId = req.auth.userId
      clientProfileServices.create(req.model)
      .then(id => {
          const responseModel = new responses.ItemResponse()
          responseModel.item = id
          res.status(201)
          .location(`${_apiPrefix}/${id}`)
          .json(responseModel)
      })
      .catch(err => {
          console.log(err)
          res.statis(500).send(new responses.ErrorResponse(err))
      })
}

function update(req, res) {
    clientProfileServices
    .update(req.params.id, req.model)
    .then(profile => {
        const responseModel = new responses.SuccessResponse()
        res.status(200).json(responseModel)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send(new responses.ErrorResponse(err))
    })
}

function _delete(req, res) {
    clientProfileServices
        .delete(req.params.id)
        .then(() => {
            const responseModel = new responses.SuccessResponse()
            res.status(200).json(responseModel)
        })
        .catch(err => {
            console.log(err)
            return res.status(500).send(new responses.ErrorResponse(err))
        })
}
