/*!
 * communication/views/communication-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const classChat = require('../templates/chat-window');
const { getPrivateMessages } = require('../../communication/models/model-messages');
const privateMessages = require('../templates/private-messages-window');
//const newPrivateMessage = require('../templates/new-private-message');
const { getAllProjects } = require('../../project/models/model-project');
const { getUserFullName } = require('../../user/models/model-user');


function communicationNewView (user, wsport, type='project', chatId=1) {
  let menuTree = [
    {
      name: 'Projects',
      type: 'project',
      id: 0,
      chats: [],
      chaterIds: []
    },
    {
      name: 'Private Messages',
      type: 'private',
      id: 1,
      chats: [],
      chaterIds: []
    }
  ];
  menuTree.filter(item => item.id === 0)[0].chats = getAllProjects().map(item => {return [item.name, item.id]});
  menuTree.filter(item => item.id === 1)[0].chats = getPrivateMessages(user.id).map(item => {return [getUserFullName(item.chatMates.filter(item => item !== user.id)[0]), item.id]});
  if (type === 'project') chatId = Number(chatId);
  return `
    <div id="communication-newview" class="main">
      <div id="docs-sidebar" class="flex-shrink-0 bg-white">
        <div class="p-3">
          <div id="all-inside">
            <div class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom">
              <span class="fs-5 fw-semibold">Communication</span>
            </div>
            <ul class="list-unstyled ps-0">
            ${menuTree.map(topicObj => menuTopic(topicObj, type, chatId)).join('')}
            </ul>
          </div>
        </div>
      </div>
      <div class="d-flex m-0 p-0">
        <button class="btn btn-sm btn-light m-0 p-0" onclick="toggleSidebar()">II</button>
      </div>
      <div id="chat-window" class="w-100 py-5 px-4 mb-5 overflow-auto">
        ${type === 'project' ? classChat(chatId, user,) : privateMessages(user.id, chatId)}
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const wsProtocol = location.protocol.replace('http','ws');
      const socket = new WebSocket(wsProtocol+'//'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        location.reload();
        console.log(msg.data);
      };
    </script>
  `;
}


// Additional functions

function menuTopic (topicObj, type, chatId) {
  let showMe = 'show';
  if (topicObj.type === type) showMe = 'show';
  return `
    <li class="mb-1">
    <div class="d-flex justify-content-between" >
      <button class="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse" data-bs-target="#sidemenu-${topicObj.id}" aria-expanded="${showMe === 'show' ? 'true' : 'false'}">
        ${topicObj.name}
      </button>
      <button id="add-new-doc-button-${topicObj.id}" class="btn btn-sm btn-light" style="display: none;" onclick="newDocModal('${topicObj.id}')"> + </a>
    </div>
      <div class="collapse ${showMe}" id="sidemenu-${topicObj.id}" style="">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          ${topicObj.chats.map(item => menuLink(item, topicObj.type, chatId)).join('')}
        </ul>
      </div>
    </li>
  `;
}

function menuLink (item, type, chatId) {
  let showMe = '';
  if (item[1] === chatId) showMe = 'active';
  return `
    <li class="d-flex justify-content-between">
      <a href="/communication/${type}/${item[1]}" class="link-dark rounded ${showMe}">${item[0]}</a>
    </li>
  `;
}


module.exports = communicationNewView
