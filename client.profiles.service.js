const axios = require("axios")

function read() {
    return axios.get('/api/client-profiles')
        .then(xhrSuccess)
        .catch(err => {
            return $q.reject(err)
        })
}

function _readTherapists() {
    return axios.get('/api/users/therapists')
        .then(xhrSuccess)
        .catch(onError)
}

function _readSupporters() {
    return axios.get('/api/users/supporters')
        .then(xhrSuccess)
        .catch(onError)
}

function _readClients() {
    return axios.get('/api/users/clients')
        .then(xhrSuccess)
        .catch(onError)
}

function readById(id) {
    return axios.get(`/api/client-profiles/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

function create(profileData) {
    return axios.post('/api/client-profiles/createProfile', profileData)
        .then(xhrSuccess)
        .catch(onError)
}

function update(profileData, id) {
    return axios.put(`/api/client-profiles/createProfile/${id}`, profileData)
        .then(xhrSuccess)
        .catch(onError)
}

function _delete(id) {
    return axios.delete(`/api/client-profiles/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

function _readByUserId(id) {
    return axios.get(`/api/client-profiles/user/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

function xhrSuccess(response) {
    return response.data
}

function onError(error) {
    console.log(error.data)
    return Promise.reject(error.data)
}

module.exports = {
    read: read,
    readById: readById,
    create: create,
    update: update,
    delete: _delete,
    readTherapists: _readTherapists,
    readSupporters: _readSupporters,
    readClients: _readClients,
    readByUserId:_readByUserId
}