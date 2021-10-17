/*!
 * issue/templates/issue-comments.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getChat } = require('../../communication/models/model-chat');
const { getUserById, getUserFullName } = require('../../user/models/model-user');


function issueComments (issueId, user) {
    return `
      <div class="mt-5">
        <div class="d-flex justify-content-between">
          <h5>Comments:</h5>
          <span>
            <button type="button" class="btn btn-sm btn-outline-info" id="toggle-button-${issueId}" onclick="toggleChat('chat-window-${issueId}')"> - </button>
          </span>
        </div>
        <div id="chat-window-${issueId}" class="collapse show">
          <hr />
          <div id="${issueId}" class="chat-window">
            ${chatterEntry(issueId)}
          </div>
          <form id="classChat-form-${issueId}" action="/issue/comment" class="d-flex justify-content-between" method="post">
            <input type="text" name="chatterId" class="d-none" hidden value="${user.id}" />
            <input type="text" name="issueId" class="d-none" hidden value="${issueId}" />
            <input type="texte" class="form-control me-2" id="userchat-${issueId}" name="userchat" maxlength="128" value="" />
            <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.send[config.lang]}</button>
          </form>
        </div>
      </div>
    `;
    //<button type="button" class="btn btn-sm btn-primary" onclick="sendChat('${issueId}');">${locale.buttons.send[config.lang]}</button>
}


// Additional functions

function chatterEntry (issueId) {
  let returnHtml = '';
  if (getChat(issueId) && getChat(issueId).length > 0) {
    getChat(issueId).forEach( item => {
      let chatUser = getUserById(item.chaterId);
      let chatUserName = getUserFullName(item.chaterId);
      let cssInline = 'd-inline';
      if (item.chat.split('').length > 46) cssInline = '';
      let chatterImage = '<span class="p-2 small border rounded-circle">' + chatUser.fname.split('')[0] + chatUser.lname.split('')[0] + '</span>';
      if (fs.existsSync(path.join(__dirname, '../../data/school/pics/', item.chaterId+'.jpg'))) {
        chatterImage = `<img src="/data/school/pics/${item.chaterId}.jpg" height="40" width="40" class="img-fluid border rounded-circle"/>`;
      }
        returnHtml += `
          <div class="row no-gutters mb-2">
            <div class="col-1 d-flex justify-content-end">
              <div>
                ${chatterImage}
              </div>
            </div>
            <div class="col-9 pl-2">
              <div class="supersmall text-muted">${chatUserName} | ${moment(item.timeStamp).format('dd DD.MM.YYYY HH:MM')}</div>
              <div class="${cssInline} rounded text-break">${item.chat}</div>
            </div>
          </div>
        `;
    });
  }
  return returnHtml;
}


module.exports = issueComments;
