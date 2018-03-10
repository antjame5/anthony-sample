const axios = require('axios')

function read() {
    return axios.get('/api/support-invitations')
        .then(xhrSuccess)
        .catch(onError)
}

function create(supportData) {
    return axios.post('/api/support-invitations', supportData)
        .then(xhrSuccess)
        .catch(onError)
}

function _delete(id) {
    return axios.delete(`/api/support-invitations/${id}`)
        .then(xhrSuccess)
        .catch(onError)
}

function _confirm(inviteId, data) {
    return axios.post(`/api/support-invitations/confirm/${inviteId}`, data)
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
    create: create,
    delete: _delete,
    confirm: _confirm
}