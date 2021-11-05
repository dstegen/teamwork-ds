/*!
 * issue/views/issue-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const { getAllProjects } = require('../../project/models/model-project');
const issueList2 = require('../templates/issue-list2');


function issueListView (user) {
  let allProjectsIds = getAllIssues().map(item => {return item.projectId});
  if (user !== undefined) allProjectsIds = Array.from(new Set(getAllIssues().filter(item => (item.assignee === user.id && item.state !== 'closed')).map(item => {return item.projectId})));
  return `
    <div id="issue-list-view" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        My Issues
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2 px-3">
        ${allProjectsIds.map(projectId => issueListWrapper(projectId, user)).join('')}
      </div>
    </div>
  `;
}


// Additional functions

function issueListWrapper (projectId, user) {
  return `
    <div class="col-12 col-md-6 p-3">
      <h5>Project: ${getAllProjects().filter(item => item.id === projectId)[0].name}</h5>
      ${issueList2(getAllIssues(projectId), user, '')}
    </div>
  `;
}


module.exports = issueListView;
