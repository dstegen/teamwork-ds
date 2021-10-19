/*!
 * issue/templates/issue-list.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const { getUserFullName } = require('../../user/models/model-user');
const { humanDate } = require('../../lib/dateJuggler');


function issueList (projectId, user, state='all') {
  let allIssues = getAllIssues().filter( item => item.projectId === projectId);
  if (state !== 'all') {
    switch (state) {
      case 'closed':
        allIssues = allIssues.filter( item => item.state === 'closed');
        break;
      default:
        allIssues = allIssues.filter( item => item.state !== 'closed');
    }
  }
  if (user && user.id) {
    allIssues = allIssues.filter( item => item.assignee === user.id);
  }
  return `
    <div class="list-group">
      ${allIssues.map(issueListItem).join('')}
    </div>
  `;
}


// Additional functions

function issueListItem (item) {
  let statusPillColor = 'bg-primary';
  let priorityPill = '';
  let listGroupItemColor = '';
  if (item.state === 'backlog') {
    statusPillColor = 'bg-secondary';
    listGroupItemColor = 'list-group-item-light';
  }
  if (item.state === 'closed') {
    statusPillColor = 'bg-info';
    listGroupItemColor = 'list-group-item-light';
  }
  if (item.state === 'in progress') {
    statusPillColor = 'bg-success';
    listGroupItemColor = 'list-group-item-light';
  }
  if (item.priority === 'blocker' && item.state !== 'closed') priorityPill = `<span class="badge bg-danger rounded-pill">${item.priority}</span>`;
  if (item.priority === 'critical' && item.state !== 'closed') priorityPill = `<span class="badge bg-danger rounded-pill">${item.priority}</span>`;
  if (item.priority === 'high' && item.state !== 'closed') priorityPill = `<span class="badge bg-warning rounded-pill">${item.priority}</span>`;
  if (item.type === 'Bug' && item.state !== 'closed') listGroupItemColor = 'list-group-item-danger';
  return `
    <a href="/issue/view/${item.id}" class="list-group-item d-flex justify-content-between align-items-center list-group-item-action ${listGroupItemColor}">
      <span>
        <strong>${item.name}</strong>
        <span class="d-none d-lg-inline text-muted"> - ${getUserFullName(item.assignee)}</span>
        <small class="d-block text-muted supersmall">${humanDate(item.updateDate)}</small>
      </span>
      <span>
        ${priorityPill}
        <span class="badge ${statusPillColor} rounded-pill">${item.state}</span>
      </span>
    </a>
  `;
}


module.exports = issueList;
