/*!
 * communication/templates/private-messages.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const moment = require('moment');
const { humanDate } = require('../../lib/dateJuggler');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getPrivateMessages } = require('../../communication/models/model-messages');
const { getUserById, getUserFullName } = require('../../user/models/model-user');
const userAvatar = require('../../user/templates/user-avatar');


function privateMessages (userId) {
  let allMessages = getPrivateMessages(userId);
  let returnHtml = '';
  allMessages.forEach( (msg, i) => {
    let myGroup = userId+'_'+i;
    let chatMateId = msg.chatMates.filter( id => id !== userId)[0];
    if (chatMateId > 99999) {
      returnHtml += `
        <div class="border py-2 px-3 mb-3">
          <div class="d-flex justify-content-between">
            <h4>${locale.headlines.private_chat_with[config.lang]} ${getUserFullName(chatMateId)}</h4>
            <span>
              <button type="button" class="btn btn-sm btn-outline-info" id="toggle-button-${myGroup}" onclick="toggleChat('chat-window-${myGroup}')"> - </button>
            </span>
          </div>
          <div id="chat-window-${myGroup}" class="collapse show">
            <hr />
            <div id="${myGroup}" class="chat-window p-2" style="max-height: 250px; overflow: auto;">
              ${chatterEntry(msg.messages, userId)}
            </div>
            <hr />
            <form id="classChat-form" action="/communication/message" class="d-flex justify-content-between" method="post">
              <input type="text" name="chatterId" class="d-none" hidden value="${userId}" />
              <input type="text" name="chatMate" class="d-none" hidden value="${chatMateId}" />
              <input type="text" name="privateMessageId" class="d-none" hidden value="${msg.id}" />
              <input type="texte" class="form-control me-2" id="userchat" name="userchat" maxlength="128" placeholder="${getUserById(userId).fname}, ${locale.placeholder.write_something[config.lang]}" value="" />
              <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.send[config.lang]}</button>
            </form>
          </div>
        </div>
      `;
    }
  });
  return returnHtml;
}


// Additional functions

function chatterEntry (messages, userId) {
  let returnHtml = '';
  let lastMoment = moment().day();
  messages.forEach( item => {
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    if (moment(item.timeStamp).day() !== lastMoment) {
      returnHtml += `<div class="w-100 small text-muted text-center py-3">- - - - - - - - - - ${humanDate(item.timeStamp)} - - - - - - - - - -</div>`
    }
    if (item.chaterId === userId) {
      returnHtml += `
        <div class="d-flex justify-content-start mb-2">
          <div class="me-2">
            ${userAvatar(item.chaterId)}
          </div>
          <div>
            <div class="supersmall text-muted">${moment(item.timeStamp).format('dd DD.MM.YYYY HH:MM')}</div>
            <div class="${cssInline} rounded text-break">${item.chat}</div>
          </div>
        </div>
      `;
    } else {
      returnHtml += `
        <div class="d-flex justify-content-end mb-2">

          <div class="me-2">
            <div class="supersmall text-muted">${moment(item.timeStamp).format('dd DD.MM.YYYY HH:MM')}</div>
            <div class="${cssInline} rounded text-break">${item.chat}</div>
          </div>
          <div>
            ${userAvatar(item.chaterId)}
          </div>
        </div>
      `;
    }
    lastMoment = moment(item.timeStamp).day();
  });
  return returnHtml;
}


module.exports = privateMessages;
