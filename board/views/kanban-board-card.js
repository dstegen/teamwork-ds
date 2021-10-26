/*!
 * views/board/kanban-board-card.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const issueTypeIcon = require('../../issue/templates/issue-type-icon');
const { humanDate } = require('../../lib/dateJuggler');
const { getUserFullName } = require('../../user/models/model-user');


function kanbanBoardCard (issue, state) {
  if (issue.state === state) {
    return `
      <div id="issue-card-${issue.id}" class="card text-center ui-sortable-handle mb-3">
        <div class="card-header d-flex justify-content-between">
          <div>${issueTypeIcon(issue.type)}</div>
          <div class="text-muted">${issue.id}</div>
        </div>
        <div class="card-body">
          <h5 class="card-title"><a href="/issue/view/${issue.id}">${issue.name}</a></h5>
          <p class="small py-2 px-3">
            ${issue.description}
          </p>
          <small class="text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-check-fill mb-1" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg> ${getUserFullName(issue.assignee)}
          </small>
        </div>
        <div class="card-footer text-muted supersmall">
          Updeted: ${humanDate(issue.updateDate)}
        </div>
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = kanbanBoardCard;
