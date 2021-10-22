/*!
 * views/board/board-card2.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
// Required modules
const issueTypeIcon = require('../../issue/templates/issue-type-icon');
const { humanDate } = require('../../lib/dateJuggler');


function boardCard2 (issue, state) {
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


module.exports = boardCard2;
