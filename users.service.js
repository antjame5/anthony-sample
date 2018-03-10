"use strict"

const axios = require('axios')

function _read() {
    return axios.get('/api/users')
        .then(onSuccess)
        .catch(onError)
}

function _create(data) {
    return axios.post('/api/users', data)
        .then(onSuccess)
        .catch(onError)
}

function _update(id, data) {
    return axios.put(`/api/users/${id}`, data)
        .then(onSuccess)
        .catch(onError)
}

function _delete(id) {
    return axios.delete(`/api/users/${id}`)
        .then(onSuccess)
        .catch(onError)
}

function _deleteSupporter(id, userId) {
    return axios.delete(`/api/users/${id}/supporters/${userId}`)
    .then(onSuccess)
    .catch(onError)
}

function _readById(id) {
    return axios.get(`/api/users/${id}`)
        .then(onSuccess)
        .catch(onError)
}

function _readMySupporters() {
    return axios.get('api/users/my-supporters')
        .then(onSuccess)
        .catch(onError)
}

function _login(formData) {
    return axios.post('/api/users/login', formData)
}

function _logout(data) {
    return axios.post('/api/users/logout')
        .then(onSuccess)
        .catch(onError)
}

function _currentUser() {
    return axios.get(`/api/users/current`)
        .then(onSuccess)
        .catch(onError)
}

function _readClients() {
    return axios.get('/api/users/clients')
        .then(onSuccess)
        .catch(onError)
}

function _confirmEmail(data) {
    return axios
        .post(`/api/users/${data._id}/confirm-email`, data)
        .then(onSuccess)
        .catch(onError)
}

function _readTherapists() {
    return axios.get('/api/users/therapists')
        .then(onSuccess)
        .catch(onError)
}

function _readSupporters() {
    return axios.get('/api/users/supporters')
        .then(onSuccess)
        .catch(onError)
}

function _deleteSupporter(id, userId) {
    return axios.delete(`/api/users/${id}/supporters/${userId}`)
        .then(onSuccess)
        .catch(onError)
}

function _readMySupporters() {
    return axios.get('api/users/my-supporters')
        .then(onSuccess)
        .catch(onError)
}

function _passwordForm() {
    return axios.post('/api/users/password')
        .then(onSuccess)
        .catch(onError)
}

function _readUserClients() {
    return axios.get('/api/users/my-clients')
        .then(onSuccess)
        .catch(onError)
}

function _readSupportersById(clientId){
    return axios.get(`/api/users/${clientId}/supporters`)
}


function onSuccess(response) {
    return response.data
}

function onError(xhr) {
    console.log(xhr)
    return Promise.reject(xhr.data)
}

module.exports = {
    login: _login,
    read: _read,
    readById: _readById,
    create: _create,
    update: _update,
    delete: _delete,
    confirmEmail: _confirmEmail,
    logout: _logout,
    currentUser: _currentUser,
    readClients: _readClients,
    readTherapist: _readTherapists,
    readSupporters: _readSupporters,
    deleteSupporter: _deleteSupporter,
    readMySupporters: _readMySupporters,
    readUserClients: _readUserClients,
    readSupportersById: _readSupportersById,
    passwordForm: _passwordForm,
    deleteSupporter: _deleteSupporter   
}

