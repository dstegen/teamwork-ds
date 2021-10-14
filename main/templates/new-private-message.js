/*!
 * main/templates/new-private-messages.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getAllUsers, getUserById, getTitleNameById } = require('../../user/models/model-user');


function newPrivateMessage (userId='', chatMateId='') {
  const user = getUserById(userId);
  let allUsers = [];
  let allOptions = '';
  if (user.role === 'teacher') {
    allUsers = getAllUsers().filter( item => user.group.includes(item.group));
    allOptions = allUsers.map( item => { return `<option value="${item.id}" ${item.id === Number(chatMateId) ? 'selected' : ''}>${getTitleNameById(item.id)}</option>` }).join('');
  } else if (user.role === 'student') {
    allUsers = getAllUsers().filter( item => (item.group.includes(user.group) && item.role === 'teacher'));
    allOptions = allUsers.map( item => { return '<option value="'+item.id+'">'+getTitleNameById(item.id, true)+'</option>' }).join('');
  }
  return `
    <div class="border py-2 px-3 mb-3">
      <form id="newMessage-form" action="/communication/message" method="post">
        <input type="text" name="chatterId" class="d-none" hidden value="${userId}" />
        <div class="form-group form-inline justify-content-between">
          <h4>${locale.headlines.send_message_to[config.lang]}</h4>
          <select class="form-control" id="chatMate" name="chatMate">
            <option></option>
            ${allOptions}
          </select>
        </div>
        <hr />
        <div class="d-flex justify-content-between">
          <input type="texte" class="form-control mr-2" id="userchat" name="userchat" maxlength="128" placeholder="${locale.placeholder.write_message[config.lang]}" value="" />
          <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.send[config.lang]}</button>
        </div>
      </form>
    </div>
  `;
}


module.exports = newPrivateMessage;
