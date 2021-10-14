/*!
 * communication/models/model-messages.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const uuidv4 = require('uuid').v4;
const moment = require('moment');
const { dateIsRecent } = require('../../lib/dateJuggler');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');


function getPrivateMessages (userId) {
  let messages = [];
  try {
    messages = loadFile(path.join(__dirname, '../../data/school', 'private-messages.json'), true).filter( item => item.chatMates.includes(userId));
    messages.sort((a, b) => reorderPrivateMessages(a, b));
    return messages;
  } catch (e) {
    console.log('- ERROR reading private messages file: '+e);
    return [];
  }
}

function getLatestMessages (userId) {
  let allMessages = [];
  try {
    allMessages = loadFile(path.join(__dirname, '../../data/school', 'private-messages.json'), true).filter(
      item => item.chatMates.includes(userId)
    ).filter(
        item => dateIsRecent(item.updated, 5)
      ).filter(
          item => item.messages[item.messages.length-1].chaterId !== userId
        );
    allMessages.sort((a, b) => reorderPrivateMessages(a, b));
    return allMessages;
  } catch (e) {
    console.log('- ERROR reading private messages file: '+e);
    return [];
  }
}

function getMessagesCount () {
  return loadFile(path.join(__dirname, '../../data/school', 'private-messages.json'), true).length;
}

function updatePrivateMessages (fields) {
  let allMessages = loadFile(path.join(__dirname, '../../data/school', 'private-messages.json'), true);
  if (fields.privateMessageId === '' || fields.privateMessageId === undefined) {
    if (allMessages.filter( item => item.chatMates.includes(Number(fields.chatterId)) ).filter(item => item.chatMates.includes(Number(fields.chatMate)) ).length > 0) {
      fields.privateMessageId = allMessages.filter( item => item.chatMates.includes(Number(fields.chatterId)) ).filter(item => item.chatMates.includes(Number(fields.chatMate)))[0].id;
      addPrivateMessage(allMessages, fields);
    } else {
      createNewPrivateMessage(allMessages ,fields);
    }
  } else if (fields.chatterId !== '' && fields.userchat !== '' && fields.privateMessageId !== '') {
    addPrivateMessage(allMessages, fields);
  }
}

function cleanMessages (userId, days=15) {
  let allMessages = loadFile(path.join(__dirname, '../../data/school', 'private-messages.json'), true);
  allMessages = allMessages.filter( item => dateIsRecent(item.updated, days));
  allMessages.forEach( myMessage => {
    myMessage.messages = myMessage.messages.filter( item => dateIsRecent(item.timeStamp, days));
  });
  try {
    saveFile(path.join(__dirname, '../../data/school'), 'private-messages.json', allMessages);
  } catch (e) {
    console.log('- ERROR writing private messages to disk: '+e);
  }
}


// Additional functions

function addPrivateMessage (allMessages, fields) {
  let newMessage = {
    chaterId: Number(fields.chatterId),
    timeStamp: new Date(),
    chat: sani(fields.userchat)
  }
  try {
    allMessages.filter( item => item.id === fields.privateMessageId)[0].messages.push(newMessage);
    allMessages.filter( item => item.id === fields.privateMessageId)[0].updated = new Date();
    saveFile(path.join(__dirname, '../../data/school'), 'private-messages.json', allMessages);
  } catch (e) {
    console.log('- ERROR writing private messages to disk: '+e);
  }
}

function createNewPrivateMessage (allMessages,fields) {
  let newCom = {
    chatMates: [Number(fields.chatterId),Number(fields.chatMate)],
    updated: new Date(),
    id: uuidv4(),
    messages: [
      {
        chaterId: Number(fields.chatterId),
        timeStamp: new Date(),
        chat: sani(fields.userchat)
      }
    ]
  }
  try {
    allMessages.push(newCom);
    saveFile(path.join(__dirname, '../../data/school'), 'private-messages.json', allMessages);
  } catch (e) {
    console.log('- ERROR creating new private message to disk: '+e);
  }
}

function reorderPrivateMessages (msgA, msgB) {
  // Sort latest message at top
  if (moment(msgA.updated).isAfter(moment(msgB.updated))) {
    return -1;
  }
  if (moment(msgB.updated).isAfter(moment(msgA.updated))) {
    return 1;
  }
  return 0;
}


module.exports = { getPrivateMessages, getLatestMessages, updatePrivateMessages, getMessagesCount, cleanMessages };
