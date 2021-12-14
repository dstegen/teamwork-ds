/*!
 * communication/views/communication-newview.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const classChat = require('../templates/chat-window');
const { getPrivateMessages, getLatestMessages } = require('../../communication/models/model-messages');
const privateMessages = require('../templates/private-messages-window');
const newPrivateMessage = require('../templates/new-private-message');
const { getAllProjects } = require('../../project/models/model-project');
const { getUserFullName } = require('../../user/models/model-user');


function communicationNewView (user, wsport, type='project', chatId=1) {
  let latestMsgsObj = getLatestMessages(user.id);
  if (latestMsgsObj.length > 0) {
    latestMsgsObj.forEach( chat => {
      let msgChaterIds = chat.messages.map(item => {return item.chaterId});
      chat.unreadMesssages = Math.abs(msgChaterIds.lastIndexOf(user.id)+1-msgChaterIds.length);
    });
  }
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
            <div class="d-flex align-items-center py-3 mb-3 link-dark text-decoration-none border-bottom d-flex justify-content-between">
              <h5>Communication</h5>
              <button type="button" class="btn btn-sm btn-light" onclick="window.open(window.location, '', 'width=900,height=750,top=100,left=800');">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-window" viewBox="0 0 16 16">
                <path d="M2.5 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1 .5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                <path d="M2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2zm13 2v2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zM2 14a1 1 0 0 1-1-1V6h14v7a1 1 0 0 1-1 1H2z"/>
              </svg>
              </button>
            </div>
            <ul class="list-unstyled ps-0">
            ${menuTree.map(topicObj => menuTopic(topicObj, type, chatId, latestMsgsObj)).join('')}
            </ul>
          </div>
        </div>
      </div>
      <div class="d-flex m-0 p-0">
        <button class="btn btn-sm btn-light m-0 p-0" onclick="toggleSidebar()">II</button>
      </div>
      <div id="chat-window" class="w-100 p-1 py-lg-3 px-lg-4 mb-5 overflow-auto">
        ${type === 'project' ? classChat(chatId, user,) : privateMessages(user.id, chatId)}
      </div>
    </div>
    <!-- Add-New-Private-Message -->
    <div class="modal fade" id="add-new-private-message-modal" tabindex="-1" aria-labelledby="add-new-private-message-modal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">New private message</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${newPrivateMessage(user.id)}
          </div>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function menuTopic (topicObj, type, chatId, latestMsgsObj) {
  let showMe = 'show';
  if (topicObj.type === type) showMe = 'show';
  let addButton = '';
  if (topicObj.type === 'private') addButton = `<button type="button" id="add-new-private-message" class="btn btn-sm btn-light" style="display: none;" data-bs-toggle="modal" data-bs-target="#add-new-private-message-modal"> + </a>`;
  return `
    <li class="mb-1">
    <div class="d-flex justify-content-between" onmouseover="$('#add-new-private-message').show()" onmouseout="$('#add-new-private-message').hide()">
      <button class="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse" data-bs-target="#sidemenu-${topicObj.id}" aria-expanded="${showMe === 'show' ? 'true' : 'false'}">
        ${topicObj.name}
      </button>
      ${addButton}
    </div>
      <div class="collapse ${showMe}" id="sidemenu-${topicObj.id}" style="">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          ${topicObj.chats.map(item => menuLink(item, topicObj.type, chatId, latestMsgsObj)).join('')}
        </ul>
      </div>
    </li>
  `;
}

function menuLink (item, type, chatId, latestMsgsObj) {
  let showMe = '';
  if (item[1] === chatId) showMe = 'active';
  let msgBadge = '';
  if (latestMsgsObj.filter(chat => chat.id === item[1]).length > 0) {
    msgBadge = `<div class="badge bg-warning my-auto">${latestMsgsObj.filter(chat => chat.id === item[1])[0].unreadMesssages}</div>`;
  }
  return `
    <li class="d-flex justify-content-between">
      <a href="/communication/${type}/${item[1]}" class="link-dark rounded ${showMe}">${item[0]}</a> ${msgBadge}
    </li>
  `;
}


module.exports = communicationNewView
