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
    <div class="d-flex justify-content-between">
      <button class="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse" data-bs-target="#sidemenu-${topicObj.order}" aria-expanded="${showMe === 'show' ? 'true' : 'false'}">
        ${topicObj.name}
      </button>
      <button class="btn btn-sm btn-light" onclick="newDocModal('${topicObj.id}')"> + </a>
    </div>
      <div class="collapse ${showMe}" id="sidemenu-${topicObj.order}" style="">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          ${topicObj.docs.map(item => menuLink(item, docsObjId)).join('')}
        </ul>
      </div>
    </li>
  `;
}

function menuLink (item, docsObjId) {
  return `
    <li>
      <a href="/docs/view/${item.id}" class="link-dark rounded ${item.id === docsObjId ? 'active': ''}">${item.name}</a></li>
  `;
}


module.exports = docsView;
