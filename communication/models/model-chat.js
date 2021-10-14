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


function getChat (myGroup) {
  let returnChat = [];
  try {
    returnChat = loadFile(path.join(__dirname, '../../data/classes', myGroup, 'chat.json'), true);
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
  if (fields.chatterId !== '' && fields.userchat !== '') {
    let newChat = {
      chaterId: Number(fields.chatterId),
      timeStamp: new Date(),
      chat: sani(fields.userchat)
    }
    let myChat = getChat(fields.group);
    try {
      myChat.push(newChat);
      saveFile(path.join(__dirname, '../../data/classes', fields.group), 'chat.json', myChat);
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
    saveFile(path.join(__dirname, '../../data/classes', group), 'chat.json', myChat);
  } catch (e) {
    console.log('- ERROR writing chat to disk: '+e);
  }
}


module.exports = { getChat, updateChat, getChatCount, cleanChat };
