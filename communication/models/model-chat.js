/*!
 * communication/models/model-chat.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');


function getComments (issueId) {
  let returnChat = [];
  try {
    returnChat = loadFile(path.join(__dirname, '../../data/issues/'+issueId.toString(), 'comments.json'), false);
    return returnChat;
  } catch (e) {
    console.log('- ERROR reading comment file: '+e);
    return [
      {
        "chaterId": 0,
        "timeStamp": new Date(),
        "chat": "Error, comment not available at the moment..."
      }
    ]
  }
}

function updateComments (fields) {
  if (fields.chatterId !== '' && fields.userchat !== '' && fields.issueId !== '') {
    let newChat = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: sani(fields.userchat),
      issueId: Number(fields.issueId)
    }
    let myChat = [];
    if (getComments(fields.issueId) && getComments(fields.issueId).length > 0) {
      myChat = getComments(fields.issueId);
    }
    try {
      myChat.push(newChat);
      saveFile(path.join(__dirname, '../../data/issues', fields.issueId.toString()), 'comments.json', myChat);
    } catch (e) {
      console.log('- ERROR writing comment to disk: '+e);
    }
  }
}

function getChat (projectId) {
  let returnChat = [];
  try {
    returnChat = loadFile(path.join(__dirname, '../../data/projects/'+projectId.toString(), 'chat.json'), false);
    return returnChat;
  } catch (e) {
    console.log('- ERROR reading chat file: '+e);
    return [
      {
        "chaterId": 0,
        "timeStamp": new Date(),
        "chat": "Error, chat not available at the moment..."
      }
    ]
  }
}

function updateChat (fields) {
  console.log(fields);
  if (fields.chatterId !== '' && fields.userchat !== '' && fields.group !== '') {
    let newChat = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: sani(fields.userchat),
      projectId: Number(fields.group)
    }
    let myChat = [];
    if (getChat(fields.group) && getChat(fields.group).length > 0) {
      myChat = getChat(fields.group);
    }
    try {
      myChat.push(newChat);
      saveFile(path.join(__dirname, '../../data/projects', fields.group), 'chat.json', myChat);
    } catch (e) {
      console.log('- ERROR writing chat to disk: '+e);
    }
  }
}


module.exports = { getChat, updateChat, getComments, updateComments };
