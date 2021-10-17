/*!
 * issue/templates/issue-list.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const { getAllProjects } = require('../../project/models/model-project');
const { getUserFullName } = require('../../user/models/model-user');


function issueList (projectId, user) {
  let allIssues = getAllIssues().filter( item => item.projectId === projectId);
  if (user.id) {
    allIssues = allIssues.filter( item => item.assignee === user.id);
  }
  return `
    <div class="col-12 col-md-6 p-3">
      <h5>Project: ${getAllProjects().filter(item => item.id === projectId)[0].name}</h5>
      <div class="list-group">
        ${allIssues.map(issueListItem).join('')}
      </div>
    </div>
  `;
}


// Additional functions

function issueListItem (item) {
  let statusPillColor = 'bg-primary';
  if (item.status === 'backlog') statusPillColor = 'bg-dark';
  let priorityPill = '';
  if (item.priority === 'blocker') priorityPill = `<span class="badge bg-danger rounded-pill">${item.priority}</span>`;
  return `
    <a href="/issue/view/${item.id}" class="list-group-item d-flex justify-content-between align-items-center list-group-item-action">
      <span>
        <strong>${item.name}</strong>
        <span class="d-none d-lg-inline text-muted"> - ${getUserFullName(item.assignee)}</span>
      </span>
      <span>
        ${priorityPill}
        <span class="badge ${statusPillColor} rounded-pill">${item.status}</span>
      </span>
    </a>
  `;
}


module.exports = issueList;
