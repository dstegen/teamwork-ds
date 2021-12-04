/*!
 * communication/templates/chat-window.js
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
const userAvatar = require('../../user/templates/user-avatar');
const { getProjectById } = require('../../project/models/model-project');


function chatWindow (myGroup, user, windowLength=400, oneSide=true) {
  return `
    <div class="pb-5 px-3 mb-3">
      <div class="py-3 mb-3 border-bottom">
        <h5><a href="/project/view/${myGroup}">${getProjectById(myGroup).name }</a> <span class="text-muted">(Project)</span> </h5>
      </div>
      <div id="chat-window-${myGroup}" class="collapse show">
        <div id="${myGroup}" class="chat-window p-2" style="max-height: ${windowLength}px; overflow: auto;">
          ${chatterEntry(myGroup, user, oneSide)}
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
}


// Additional functions

function chatterEntry (myGroup, user, oneSide) {
  let returnHtml = '';
  getChat(myGroup).forEach( item => {
    let cssInline = 'd-inline';
    if (item.chat.split('').length > 46) cssInline = '';
    if (oneSide || item.chaterId === user.id) {
      returnHtml += `
        <div class="d-flex justify-content-start mb-3">
          <div class="me-2">
            ${userAvatar(item.chaterId)}
          </div>
          <div>
            <div class="supersmall text-muted">${getUserFullName(item.chaterId)} | ${moment(item.timeStamp).format('dd DD.MM.YYYY HH:MM')}</div>
            <div class="${cssInline} rounded text-break">${item.chat}</div>
          </div>
        </div>
      `;
    } else if (!oneSide && item.chaterId !== user.id) {
      returnHtml += `
        <div class="d-flex justify-content-end mb-3">

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


module.exports = chatWindow;
