"use strict"

const dotenv = require("dotenv")
const mongodb = require("../mongodb")
const conn = mongodb.connection
const ObjectId = mongodb.ObjectId
const sgMail = require("@sendgrid/mail")

module.exports = {
  send: _send,
  sendRegistrationConfirmation: _sendRegistrationConfirmation,
  sendInvite: _sendTreatmentInvitation,
  sendSupportInvitation: _sendSupportInvitation
}

function _send(toAddress, toName, subject, body) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: toAddress,
    from: process.env.FROM_ADDRESS,
    subject: subject,
    html: body,
    bcc: process.env.BCC_ADDRESS
  }

  const safeDoc = {
    toAddress: toAddress,
    fromAddress: process.env.FROM_ADDRESS,
    subject: subject,
    body: body
  }

  sgMail.send(msg)
    .then(response => conn.db().collection("emails").insertOne(safeDoc))
    .then(response => response.insertedId.toString())
    .catch(xhr => {
      console.warn(xhr)
      return Promise.reject(xhr)
    })
}

function _sendRegistrationConfirmation(toAddress, userId, toName) {
  let subject = "Thank you for Registering to Heal & Recover"
  let body = `<p>Dear ${toName},</p>
  <p>Thank you for registering to Heal & Recover. In order to complete your registration, please click the confirmation
      link below.</p>
  
      <a href="${process.env.ORIGIN}/users/${userId}/confirm-email" style="background-color:#0000ff;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;">Confirm Email</a>`

  return _send(toAddress, userId, subject, body)
}

function _sendTreatmentInvitation(fromName, toName, toAddress, inviteId) {
  let subject = `${fromName} has invited you to begin your journey in recovery`
  let body = `<p>Dear ${toName},</p>
  <p>${fromName} has officially invited you to begin a new journey in recovery. Please use the link below to accept their invitation</p>
  
    <a href="${process.env.ORIGIN}/confirm-treatment/${inviteId}" style="background-color:#0000ff;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;">Accept Invitation</a>`

  return _send(toAddress, toName, subject, body)
}

function _sendSupportInvitation(fromName, toName, toAddress, inviteId) {
  let subject = `${fromName} has invited you to be apart of their support group`
  let body = `<p>Hello,</p>
    <p>${fromName} has officially invited you to be apart of their support group on their journey to recovery. Please use the link.</p>
    <a href="${process.env.ORIGIN}/confirm-support/${inviteId}" style="background-color:#0000ff;border-radius:3px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;">Accept Invitation</a>`
  return _send(toAddress, toName, subject, body)
}