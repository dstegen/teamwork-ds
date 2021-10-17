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
const issueComments = require('../templates/issue-comments');


function issueView (issue, user) {
  return `
    <div id="issue-view" class="container p-3 my-3 border">
      <div class="d-flex justify-content-between">
        <h4 class="m-0">Issue: <strong>${issue.name}</strong> [${issue.id}]</h4>
        <a href="/issue/edit/${issue.id}" class="btn btn-sm btn-warning">Edit</a>
      </div>
      <hr />
      ${issueDetails(issue)}
      ${issueComments(issue.id, user)}
    </div>
  `;
}


// Additional functions

function issueDetails (issue) {
  let returnHtml = '<div class="row">';
  Object.keys(issue).forEach( key => {
    if (!['id','name'].includes(key)) {
      let value = issue[key];
      if (key === 'projectId') {
        value = getAllProjects().filter(item => item.id === issue[key])[0].name;
      } else if (key === 'reporter' || key === 'assignee') {
        value = getUserFullName(issue[key]);
      } else if (key === 'watchers') {
        value = [];
        issue['watchers'].split(',').forEach(item => {
          if (item !== '') value.push(getUserFullName(Number(item)));
        });
        value = value.toString();
      }
      returnHtml += `
        <div class="col-3">${key}</div>
        <div class="col-1" text-center>:</div>
        <div class="col-5">${value}</div>
        <br />
      `;
    }
  });
  returnHtml += '</div>';
  return returnHtml;
}

module.exports = issueView;
