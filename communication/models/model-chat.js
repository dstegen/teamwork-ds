/*!
 * communication/models/model-chat.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { dateIsRecent } = require('../../lib/dateJuggler');
const config = require('../../main/models/model-config').getConfig();
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');


function getChat (issueId) {
  let returnChat = [];
  try {
    returnChat = loadFile(path.join(__dirname, '../../data/issues/'+issueId, 'comments.json'), false);
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
  if (fields.chatterId !== '' && fields.userchat !== '' && fields.issueId !== '') {
    let newChat = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: sani(fields.userchat),
      issueId: Number(fields.issueId)
    }
    let myChat = [];
    if (getChat(fields.issueId) && getChat(fields.issueId).length > 0) {
      myChat = getChat(fields.issueId);
    }
    try {
      myChat.push(newChat);
      saveFile(path.join(__dirname, '../../data/issues', fields.issueId), 'comments.json', myChat);
    } catch (e) {
      console.log('- ERROR writing chat to disk: '+e);
    }
  }
}

function getChatCount () {
  let chatMessagesCount = 0;
  config.classes.forEach( group => {
    chatMessagesCount += getChat(group).length;
  });
  return chatMessagesCount;
}

function cleanChat (group, days=15) {
  let myChat = getChat(group);
  myChat = myChat.filter( item => dateIsRecent(item.timeStamp, days));
  try {
    saveFile(path.join(__dirname, '../../data/issues', group), 'comments.json', myChat);
  } catch (e) {
    console.log('- ERROR writing chat to disk: '+e);
  }
}


module.exports = { getChat, updateChat, getChatCount, cleanChat };
