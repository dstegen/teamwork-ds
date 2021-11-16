/*!
 * docs/views/dosc-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getDocs } = require('../models/model-docs');


function docsView (docsObj) {
  return `
    <div class="main">
      <div class="flex-shrink-0 p-3 bg-white border" style="width: 280px;">
        <ul class="list-unstyled ps-0">
        ${getDocs().map(menuTopic).join('')}
        </ul>
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
  `;
}


// Additional functions

function menuTopic (topicObj) {
  let showMe = '';
  if (topicObj.order === 0) showMe = 'show';
  return `
    <li class="mb-1">
      <button class="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse" data-bs-target="#sidemenu-${topicObj.order}" aria-expanded="${showMe === 'show' ? 'true' : 'false'}">
        ${topicObj.name}
      </button>
      <div class="collapse ${showMe}" id="sidemenu-${topicObj.order}" style="">
        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
          ${topicObj.docs.map(item => { return '<li><a href="/docs/load/'+item.id+'" class="link-dark rounded">'+item.name+'</a></li>'}).join('')}
        </ul>
      </div>
    </li>
  `;
}


module.exports = docsView;
