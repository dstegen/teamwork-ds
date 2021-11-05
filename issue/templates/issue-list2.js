/*!
 * issue/templates/issue-list2.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getUserFullName } = require('../../user/models/model-user');
const { getProjectById } = require('../../project/models/model-project');
const { humanDate, dateIsRecent } = require('../../lib/dateJuggler');
const issuePills = require('./issue-pills');
const issueTypeIcon = require('./issue-type-icon');
const sortItemsByDate = require('../../utils/sort-items-by-date');


function issueList2 (allIssues, user, state='all') {
  if (state !== 'all') {
    switch (state) {
      case 'closed':
        allIssues = allIssues.filter( item => item.state === 'closed');
        break;
      case 'open':
        allIssues = allIssues.filter( item => item.state === 'open');
        break;
      case 'in progress':
        allIssues = allIssues.filter( item => item.state === 'in progress');
        break;
      default:
        allIssues = allIssues.filter( item => item.state !== 'closed');
    }
  }
  if (user && user.id) {
    allIssues = allIssues.filter( item => item.assignee === user.id);
  }
  allIssues.sort((a,b) => sortItemsByDate(b,a,'updateDate'));
  return `
    <div class="list-group">
      ${allIssues.map(issueListItem).join('')}
    </div>
  `;
}


// Additional functions

function issueListItem (item) {
  let listGroupItemColor = '';
  if (item.state === 'backlog') {
    listGroupItemColor = 'list-group-item-light';
  }
  if (item.state === 'closed') {
    listGroupItemColor = 'list-group-item-light';
  }
  if (item.type === 'Bug' && item.state !== 'closed') listGroupItemColor = 'list-group-item-danger';
  return `
    <a href="/issue/view/${item.id}" class="list-group-item d-flex justify-content-between align-items-center list-group-item-action ${listGroupItemColor}">
      <span>
        ${issueTypeIcon(item.type, true)}
        <strong>${item.name}</strong>
        ${dateIsRecent(item.createDate, 2) ? '<span class="fst-italic fw-bolder text-primary small align-top">new</span> ' : ''}
        <span class="d-none d-lg-inline text-muted small"> - ${getUserFullName(item.assignee)}</span>
        <small class="d-block text-muted supersmall">${humanDate(item.updateDate)} [${getProjectById(item.projectId).name}]</small>
      </span>
      <span>
        ${issuePills(item.priority)}
        ${issuePills(item.state)}
      </span>
    </a>
  `;
}


module.exports = issueList2;
