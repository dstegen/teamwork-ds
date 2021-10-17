/*!
 * issue/views/issue-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getUserFullName } = require('../../user/models/model-user');
const { getAllProjects } = require('../../project/models/model-project');
const { humanDate } = require('../../lib/dateJuggler');
const issueComments = require('../templates/issue-comments');


function issueView (issue, user) {
  return `
    <div id="issue-view" class="container p-3 my-3 border">
      <small class="small text-uppercase">${getAllProjects().filter(item => item.id === issue['projectId'])[0].name}</small>
      <div class="d-md-flex justify-content-between">
        <h4 class="m-md-0"><strong>${issue.name}</strong> [${issue.id}]</h4>
        <span>
          ${['backlog'].includes(issue.state) ? `<a href="/issue/open/${issue.id}" class="btn btn-sm btn-primary me-2">Open issue</a>` : ''}
          ${['backlog','open'].includes(issue.state) ? `<a href="/issue/start/${issue.id}" class="btn btn-sm btn-success me-2">Start working</a>` : ''}
          ${!['backlog','open','resolved', 'closed'].includes(issue.state) ? `<a href="/issue/resolved/${issue.id}" class="btn btn-sm btn-primary me-2">Resolve issue</a>` : ''}
          ${!['backlog','closed'].includes(issue.state) ? `<a href="/issue/closed/${issue.id}" class="btn btn-sm btn-primary me-2">Close issue</a>` : ''}
          ${['closed'].includes(issue.state) ? `<a href="/issue/open/${issue.id}" class="btn btn-sm btn-danger me-2">Re-open issue</a>` : ''}
          <a href="/issue/edit/${issue.id}" class="btn btn-sm btn-warning">Edit</a>
        </span>
      </div>
      <hr />
      <div>
        ${issue.description}
      </div>
      <hr />
      ${issueDetails(issue)}
      <div class="mt-5">
        <h5>Attachements:</h5>
        <hr />
      </div>
      ${issueComments(issue.id, user)}
    </div>
  `;
}


// Additional functions

function issueDetails (issue) {
  let returnHtml1 = '<div class="col-12 col-lg-6 row">';
  let returnHtml2 = '<div class="col-12 col-lg-6 row">';
  Object.keys(issue).forEach( key => {
    if (!['id','name','description','projectId'].includes(key)) {
      let value = issue[key];
      if (key === 'reporter' || key === 'assignee') {
        value = getUserFullName(issue[key]);
      } else if (key === 'watchers') {
        value = [];
        issue['watchers'].split(',').forEach(item => {
          if (item !== '') value.push(getUserFullName(Number(item)));
        });
        value = value.toString();
      } else if (key.includes('Date')) {
        if (issue[key] !== '') value = humanDate(issue[key]);
      } else if (key === 'state') {
        let statusPillColor = 'bg-primary';
        if (issue.state === 'backlog') statusPillColor = 'bg-secondary';
        value = `<span class="badge ${statusPillColor} rounded-pill">${issue.state}</span>`
      } else if (key === 'priority' && issue.priority === 'blocker') {
        value = `<span class="badge bg-danger rounded-pill">${issue.priority}</span>`;
      } else if (key === 'type' && issue.type === 'Bug') {
        value = `<span class="badge bg-danger rounded-pill">${issue.type}</span>`;
      }
      if (key.includes('Date') || key.includes('watchers')) {
        returnHtml2 += `
          <div class="col-3 text-capitalize">${key}</div>
          <div class="col-1" text-center>:</div>
          <div class="col-5">${value}</div>
          <br />
        `;
      } else {
        returnHtml1 += `
          <div class="col-3 text-capitalize">${key}</div>
          <div class="col-1" text-center>:</div>
          <div class="col-5">${value}</div>
          <br />
        `;
      }
    }
  });
  return '<div class="row">'+returnHtml1+'</div>'+returnHtml2+'</div></div>';
}

module.exports = issueView;
