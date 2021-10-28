/*!
 * views/board/board-card-form.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const filesList = require('../../main/templates/files-list');


function boardCardForm (group, myTopicId, myCard) {
  let addButton = '';
  let delButton = `
    <button type="button" class="btn btn-danger" onclick="confirmDelete(this.form.name, '/board/${group}/delete')">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    </button>
  `;
  if (myCard === undefined) {
    myCard = {
      id: 'null',
      topicId: myTopicId,
      title: '',
      description: '',
      file: '',
      link: ''
    }
    delButton = '';
    addButton = `
      <div class="px-3 py-2 border mt-2 text-muted bg-light text-center board-header" data-bs-toggle="collapse" data-bs-target="#addCardForm-${myTopicId}-${myCard.id}">
        <strong>+</strong>
      </div>
    `;
  }
  let attachementsInForm = `
    <hr />
    <label class="mb-2">${locale.headlines.attachment_files[config.lang]}</label>
    <div class="custom-file">
      <input type="file" class="form-control form-control-sm custom-file-input" id="filetoupload-${myCard.id}" name="filetoupload">
      <label class="form-control form-control-sm custom-file-label text-truncate" for="filetoupload-${myCard.id}">${locale.placeholder.attachment[config.lang]}...</label>
      <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
    </div>
  `;
  let cardLink = `
    <label for="link-field">Link</label>
    <input type="text" class="form-control board-form form-control-sm" id="link-field" name="link" value="${myCard.link}">
  `;
  return `
    ${addButton}
    <div id="addCardForm-${myTopicId}-${myCard.id}" class="collapse px-3 py-2 border bg-light board-card">
      <form id="edit-column-form-${group}-${myCard.id}" name="edit-column-form-${group}-${myCard.id}" action="/board/${group}/update" method="post" enctype="multipart/form-data">
        <input type="text" name="group" class="d-none" hidden value="${group}" />
        <input type="text" name="id" class="d-none" hidden value="${myCard.id}" />
        <input type="text" name="topicId" class="d-none" hidden value="${myCard.topicId}" />
        <input type="text" name="section" class="d-none" hidden value="cards" />
        <label for="title-field">Title</label>
        <input type="text" class="form-control board-form form-control-sm mb-2" id="title-field" name="title" value="${myCard.title}">
        <label for="description-field">Description</label>
        <textarea class="form-control form-control-sm  mb-2" id="description-field" rows="3" name="description">${myCard.description}</textarea>
        ${cardLink}
        <div class="d-flex justify-content-between mt-3">
          ${delButton}
          <button type="submit" class="btn btn-primary">${myCard.id === 'null' ? locale.buttons.add[config.lang] : locale.buttons.update[config.lang]}</button>
        </div>
      </form>
      <div class="small mt-2">
        ${myCard.files ? filesList(myCard.files, '/board/'+group, group, '', myCard.id, '', true, 'cards') : ''}
      </div>
    </div>
  `;
}


module.exports = boardCardForm;
