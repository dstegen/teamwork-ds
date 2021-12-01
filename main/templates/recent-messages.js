/*!
 * main/templates/recent-messages.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getUserById } = require('../../user/models/model-user');
const { getLatestMessages } = require('../../communication/models/model-messages');
const simpleList = require('./simple-list');
const userAvatar = require('../../user/templates/user-avatar');


function recentMessages (userId) {
  let itemsList = [];
  getLatestMessages(userId).forEach( item => {
    let allMessages = item.messages.filter( item => item.chaterId !== userId);
    let message = allMessages[allMessages.length-1];
    if (message !== undefined) {
      itemsList.push(`<a href="/communication/private/${item.id}">${message.chat} - ${userAvatar(message.chaterId, '20')} ${getUserById(message.chaterId).fname}</a>`);
    }
  });
  return simpleList('<h5 class="border p-3 mt-5">Recent private messages</h5>', itemsList);
}


module.exports = recentMessages;
