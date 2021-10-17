/*!
 * issue/views/issue-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const issueList = require('../templates/issue-list');


function issueListView (user) {
  let allProjectsIds = getAllIssues().map(item => {return item.projectId});
  if (user !== undefined) allProjectsIds = Array.from(new Set(getAllIssues().filter(item => item.assignee === user.id).map(item => {return item.projectId})));
  return `
    <div id="issuelistview" class="container-fluid p-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        My Issues
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2 px-3">
        ${allProjectsIds.map(projectId => issueList(projectId, user)).join('')}
      </div>
    </div>
  `;
}


module.exports = issueListView;
