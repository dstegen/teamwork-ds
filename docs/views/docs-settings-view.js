/*!
 * docs/views/docs-settings-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getDocs } = require('../models/model-docs');
const addModal = require('../templates/add-modal');


function docsSettingsView () {
  return `
    <div class="container py-3 mb-5">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Manage your docs
        <span id="clock" class="d-none d-md-block">16:34:06</span>
      </h2>
      <div class="row g-0">
        <div class=" col-12 col-md-6 p-3 border" style="min-height: 500px;">
          <h4>Team docs</h4>
          <div class="ps-3">
            ${getDocs().map(docsTree).join('')}
          </div>
        </div>
      </div>
    </div>
    ${addModal('Edit title','/docs/settings/manage','editdoc','Update')}
  `;
}


// Additional functions

function docsTree (docTopic) {
  return `
    <div>
      <h5 class="d-flex text-decoration-underline" onmouseover="$('.pen-${docTopic.id}').show()" onmouseout="$('.pen-${docTopic.id}').hide()">
        ${docTopic.name}
        <span class="d-flex">
          ${editDocTitlePen(docTopic, docTopic.id)}
          ${delButton(docTopic, docTopic.id, 'topic')}
        </span>
      </h5>
      <ul id="${docTopic.id}" class="sortable-docs">
        ${docTopic.docs.map(item => menuLink(item, docTopic.id)).join('')}
      </ul>
    </div>
  `;
}

function menuLink (item, topicObjId) {
  return `
    <li id="${item.id}" class="d-flex" role="button" onmouseover="$('.pen-${item.id}').show()" onmouseout="$('.pen-${item.id}').hide()">
      ${item.name}
      <span class="d-flex">
        ${editDocTitlePen(item, topicObjId)}
        ${delButton(item, topicObjId, 'doc')}
      </span>
    </li>
  `;
}

function editDocTitlePen (item, topicObjId) {
  return `
    <a id="pen-${item.id}" class="pen-${item.id} ms-3" style="display: none;" href="#" onclick="editDocTitleModal('${item.id}','${item.name}','${topicObjId}')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
      </svg>
    </a>
  `;
}

function delButton (item, topicObjId, what) {
  return `
    <form style="display: none;" class="pen-${item.id} ms-3" id="delform-${item.id}" action="/docs/settings/delete" method="post">
      <input type="text" readonly class="d-none" id="what" name="what" value="${what}">
      <input type="text" readonly class="d-none" id="topicObjId" name="topicObjId" value="${topicObjId}">
      <input type="text" readonly class="d-none" id="id" name="id" value="${item.id}">
      <a href="#" onclick="fileDelete('delform-${item.id}')">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </a>
    </form>
  `;
}


module.exports = docsSettingsView;
