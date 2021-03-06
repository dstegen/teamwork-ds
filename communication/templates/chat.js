/*!
 * communication/templates/chat.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const moment = require('moment');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getChat } = require('../../communication/models/model-chat');
const { getUserFullName } = require('../../user/models/model-user');
const { getProjectById } = require('../../project/models/model-project');
const userAvatar = require('../../user/templates/user-avatar');


function classChat (groupsList, user, windowLength=250) {
  let returnHtml = '';
  if (typeof(groupsList) === 'number') groupsList = [groupsList];
  groupsList.forEach( myGroup => {
    returnHtml += `
      <div class="border py-2 px-3 mb-3">
        <div class="d-flex justify-content-between">
          <h4>Project: <a href="/project/view/${getProjectById(myGroup).id}">${getProjectById(myGroup).name}</a></h4>
          <span>
            <button type="button" class="btn btn-sm btn-outline-info" id="toggle-button-${myGroup}" onclick="toggleChat('chat-window-${myGroup}')"> - </button>
          </span>
        </div>
        <div id="chat-window-${myGroup}" class="collapse show">
          <hr />
          <div id="${myGroup}" class="chat-window p-2" style="max-height: ${windowLength}px; overflow: auto;">
            ${chatterEntry(myGroup, user)}
          </div>
          <hr />
          <form id="classChat-form-${myGroup}" action="/communication/chat" class="d-flex justify-content-between" method="post">
            <input type="text" name="chatterId" class="d-none" hidden value="${user.id}" />
            <input type="text" name="group" class="d-none" hidden value="${myGroup}" />
            <input type="texte" class="form-control me-2" id="userchat-${myGroup}" name="userchat" maxlength="128" placeholder="${user.fname}, ${locale.placeholder.write_something[config.lang]}" value="" />
            <button type="button" class="btn btn-sm btn-primary" onclick="sendChat('${myGroup}');">${locale.buttons.send[config.lang]}</button>
          </form>
        </div>
      </div>
      <script>
        document.getElementById('userchat-${myGroup}').addEventListener('keypress', function (e) {
          if (e.key === 'Enter') sendChat('${myGroup}');
          return false;
        });
      </script>
    `;
  });
  return returnHtml;
}


// Additional functions

function chatterEntry (myGroup, user) {
  let returnHtml = '';
  getChat(myGroup).forEach( item => {
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    if (item.chaterId === user.id) {
      returnHtml += `
        <div class="d-flex justify-content-start mb-2">
          <div class="me-2">
            ${userAvatar(item.chaterId)}
          </div>
          <div>
            <div class="supersmall text-muted">${getUserFullName(item.chaterId)} | ${moment(item.timeStamp).format('dd DD.MM.YYYY HH:MM')}</div>
            <div class="${cssInline} rounded text-break">${item.chat}</div>
          </div>
        </div>
      `;
    } else {
      returnHtml += `
        <div class="d-flex justify-content-end mb-2">

          <div class="me-2">
            <div class="supersmall text-muted">${getUserFullName(item.chaterId)} | ${moment(item.timeStamp).format('dd DD.MM.YYYY HH:MM')}</div>
            <div class="${cssInline} rounded text-break">${item.chat}</div>
          </div>
          <div>
            ${userAvatar(item.chaterId)}
          </div>
        </div>
      `;
    }
  });
  return returnHtml;
}


module.exports = classChat;
