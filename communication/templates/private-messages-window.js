/*!
 * communication/templates/private-messages-window.js
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


function privateMessagesWindow (userId, chatId) {
  let allMessages = getPrivateMessages(userId).filter(item => item.id === chatId);
  let returnHtml = '';
  allMessages.forEach( (msg, i) => {
    let myGroup = userId+'_'+i;
    let chatMateId = msg.chatMates.filter( id => id !== userId)[0];
    if (chatMateId > 99999) {
      returnHtml += `
        <div class="pb-5 px-3 mb-3">
          <div class="py-3 mb-3 border-bottom d-flex">
            ${userAvatar(chatMateId, 32)}
            <h5 class="ms-3 my-auto">${getUserFullName(chatMateId)} <span class="text-muted">(private)</span></h5>
          </div>
          <div id="chat-window-${myGroup}" class="collapse show">
            <div id="${myGroup}" class="chat-window p-2" style="max-height: 400px; overflow: auto;">
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


module.exports = privateMessagesWindow;
