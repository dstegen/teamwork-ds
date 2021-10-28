/*!
 * views/board/board-column-form.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getAllProjects } = require('../../project/models/model-project');
const boardFormSelect = require('./board-form-select');


function boardColumnForm (group, myTopic) {
  let addButton = '';
  let delButton = `
    <button type="button" class="btn btn-danger" onclick="confirmDelete(this.form.name, '/board/${group}/delete')">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
      </svg>
    </button>
  `;
  if (myTopic === undefined) {
    myTopic = {
      id: 'null',
      order: '',
      topic: '',
      color: '',
      autofill: false,
      autofillWith: ''
    }
    addButton = `
      <div class="px-3 py-2 border bg-primary text-light text-center board-header" data-bs-toggle="collapse" data-bs-target="#addColumnForm-null">
        <strong>+ ${locale.buttons.add_column[config.lang]}</strong>
      </div>
    `;
    delButton = '';
  }
  return `
    <div>
      ${addButton}
      <div id="addColumnForm-${myTopic.id}" class="collapse px-3 py-2 border bg-light board-card">
        <form id="edit-column-form-${myTopic.id}" name="edit-column-form-${myTopic.id}" action="/board/${group}/update" method="post">
          <input type="text" name="id" class="d-none" hidden value="${myTopic.id}" />
          <input type="text" name="group" class="d-none" hidden value="${group}" />
          <input type="text" name="section" class="d-none" hidden value="topics" />
          <label for="topic-field">Title</label>
          <input type="text" class="form-control board-form form-control-sm" id="topic-field" name="topic" value="${myTopic.topic}">
          ${boardFormSelect(config.courseColors, myTopic.color, 'color', myTopic.autofill === true ? 'disabled' : '')}
          <div class="form-check form-check-inline mt-2">
            <label class="form-check-label" for="autofill">Autofill</label>
            <input class="form-check-input ml-2" type="checkbox" id="autofill" name="autofill" onchange="enableDisableInput(this, '#edit-column-form-${myTopic.id} select#with-field', '#edit-column-form-${myTopic.id} select#color-field')" ${myTopic.autofill === true ? 'checked' : ''}>
          </div>
          ${boardFormSelect(getAllProjects().map( item => { return [item.id, item.name]; }), myTopic.autofillWith, 'with', myTopic.autofill === true ? '' : 'disabled')}
          <div class="d-flex justify-content-between mt-3">
            ${delButton}
            <button type="submit" class="btn btn-primary">${myTopic.id === 'null' ? locale.buttons.add[config.lang] : locale.buttons.update[config.lang]}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}


module.exports = boardColumnForm;
