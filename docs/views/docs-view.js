/*!
 * docs/views/docs-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getDocs } = require('../models/model-docs');
const addModal = require('../templates/add-modal');


function docsView (docsObj) {
  return `
    <div class="main">
      <div class="flex-shrink-0 p-3 bg-white border" style="width: 280px;">
        <ul class="list-unstyled ps-0">
        ${getDocs().map(topicObj => menuTopic(topicObj, docsObj.id)).join('')}
        </ul>
        <hr />
        <div class="d-flex justify-content-end">
          <button class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#add-topic-modal">Add new topic</button>
        </div>
      </div>
      <div class="w-100 h-75">
        <div id="docs-field" class="p-3">${docsObj.content}</div>
        <div class="d-flex justify-content-end border-top">
          <button id="startEdit" type="button" class="btn btn-primary mt-2 me-2" onclick="initTrumbowyg('#docs-field')">Edit</button>
          <span id="saveEdit" style="display: none;">
            <button type="button" class="btn btn-outline-secondary mt-2 me-2" onclick="cancelEditDoc()">Cancel</button>
            <button type="button" class="btn btn-primary mt-2 me-2" onclick="saveDoc('${docsObj.id}')">Update</button>
          </span>
        </div>
      </div>
    </div>
    ${addModal('Add a new topic','/docs/addtopic','topic')}
    ${addModal('Add a new doc','/docs/create','doc')}
  `;
}


// Additional functions

function menuTopic (topicObj, docsObjId) {
  let showMe = '';
  if (topicObj.docs.filter(item => item.id === docsObjId).length > 0) showMe = 'show';
  return `
    <li class="mb-1">
    <div class="d-flex justify-content-between" onmouseover="$('#add-new-doc-button-${topicObj.id}').show()" onmouseout="$('#add-new-doc-button-${topicObj.id}').hide()">
      <button class="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse" data-bs-target="#sidemenu-${topicObj.id}" aria-expanded="${showMe === 'show' ? 'true' : 'false'}">
        ${topicObj.name}
      </button>
      <button id="add-new-doc-button-${topicObj.id}" class="btn btn-sm btn-light" style="display: none;" onclick="newDocModal('${topicObj.id}')"> + </a>
    </div>
      <div class="collapse ${showMe}" id="sidemenu-${topicObj.id}" style="">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          ${topicObj.docs.map(item => menuLink(item, docsObjId, topicObj.id)).join('')}
        </ul>
      </div>
    </li>
  `;
}

function menuLink (item, docsObjId, topicObjId) {
  return `
    <li class="d-flex justify-content-between" onmouseover="$('#pen-${item.id}').show()" onmouseout="$('#pen-${item.id}').hide()">
      <a href="/docs/view/${item.id}" class="link-dark rounded ${item.id === docsObjId ? 'active': ''}">${item.name}</a>
      ${editDocTitlePen(item, topicObjId)}
    </li>
  `;
}

function editDocTitlePen (item, topicObjId) {
  return `
    <a id="pen-${item.id}" href="#" style="display: none;" onclick="editDocTitleModal('${item.id}','${item.name}','${topicObjId}')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
      </svg>
    </a>
  `;
}


module.exports = docsView;
