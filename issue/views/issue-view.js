/*!
 * issue/views/issue-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const { getUserFullName } = require('../../user/models/model-user');
const { getAllProjects } = require('../../project/models/model-project');
const { getAllIssues,getIssue } = require('../models/model-issue');
const { humanDate } = require('../../lib/dateJuggler');
const issueComments = require('../templates/issue-comments');
const issuePills = require('../templates/issue-pills');
const issueTypeIcon = require('../templates/issue-type-icon');
const issueList2 = require('../templates/issue-list2');
const uploadForm = require('../templates/upload-form');


function issueView (issue, user, wsport) {
  let subTaskHtml = '';
  if (issue.type !== 'SubTask') {
    subTaskHtml = `
      <div class="mt-5">
        <div class="d-flex justify-content-between mb-2">
          <h5>SubTasks:</h5>
          <a href="/issue/create?projectId=${issue.projectId}&masterId=${issue.id}" class="btn btn-sm btn-primary">Add SubTask </a>
        </div>
        <div class="row">
          <div class="col-12 col-lg-6">
            ${issueList2(getAllIssues().filter(item => Number(item.masterId) === issue.id))}
          </div>
        </div>
        <hr />
      </div>
    `;
  }
  return `
    <div id="issue-view" class="container py-3">
      <div class=" p-3 my-3 border">
        <small class="small text-uppercase"><a href="/project/view/${issue.projectId}">${getAllProjects().filter(item => item.id === issue['projectId'])[0].name}</a></small>
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
        ${subTaskHtml}
        <div class="mt-5">
          <h5>Attachements:</h5>
          ${uploadForm(issue)}
          <hr />
        </div>
        ${issueComments(issue.id, user)}
      </div>
    </div>
    <script>
      // Websockets
      const hostname = window.location.hostname ;
      const wsProtocol = location.protocol.replace('http','ws');
      const socket = new WebSocket(wsProtocol+'//'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
      socket.onmessage = function (msg) {
        location.reload();
        console.log(msg.data);
      };
    </script>
  `;
}


// Additional functions

function issueDetails (issue) {
  let returnHtml1 = '<div class="col-12 col-lg-6 row">';
  let returnHtml2 = '<div class="col-12 col-lg-6 row">';
  Object.keys(issue).forEach( key => {
    if (!['id','name','description','projectId','masterId'].includes(key)) {
      let value = issue[key];
      if (key === 'reporter' || key === 'assignee') {
        let fullName = getUserFullName(issue[key]);
        let memberImage = '<span class="p-2 supersmall border rounded-circle">' + fullName[0][0] + fullName[1][0] + '</span>';
        if (fs.existsSync(path.join(__dirname, '../../data/users/pics/', issue[key]+'.jpg'))) {
          memberImage = `<img src="/data/users/pics/${issue[key]}.jpg" height="20" width="20" class="img-fluid border rounded-circle"/>`;
        }
        value = memberImage+'&nbsp;'+fullName;
      } else if (key === 'watchers') {
        value = [];
        issue['watchers'].split(',').forEach(item => {
          if (item !== '') value.push(getUserFullName(Number(item)));
        });
        value = value.toString();
      } else if (key.includes('Date')) {
        if (issue[key] !== '') value = humanDate(issue[key]);
      } else if (key === 'state') {
        value = issuePills(issue.state);
      } else if (key === 'priority') {
        value = issuePills(issue.priority, issue.priority);
      } else if (key === 'type') {
        if (issue.masterId > -1) {
          value = issueTypeIcon(issue.type)+' [<a href="/issue/view/'+issue.masterId+'">'+getIssue(Number(issue.masterId)).name+'</a>]';
        } else {
          value = issueTypeIcon(issue.type);
        }
      }
      if (key.includes('Date') || key.includes('watchers')) {
        returnHtml2 += `
          <div class="col-3 text-capitalize mb-2">${key}</div>
          <div class="col-1" text-center>:</div>
          <div class="col-7">${value}</div>
          <br />
        `;
      } else {
        returnHtml1 += `
          <div class="col-3 text-capitalize">${key}</div>
          <div class="col-1" text-center>:</div>
          <div class="col-7">${value}</div>
          <br />
        `;
      }
    }
  });
  return '<div class="row">'+returnHtml1+'</div>'+returnHtml2+'</div></div>';
}


module.exports = issueView;
