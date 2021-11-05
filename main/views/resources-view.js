/*!
 * main/views/resources-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const { getAllUsers } = require('../../user/models/model-user');
const memberCard = require('../templates/member-card');
const issueList2 = require('../../issue/templates/issue-list2');
const sortItemsByDate = require('../../utils/sort-items-by-date');


function resourcesView () {
  return `
    <div id="members-view" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Resources - People
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row row-cols-1 row-cols-lg-2 gx-4 gy-1">
        ${getAllUsers().map(memberResources).join('')}
      </div>
    </div>
  `;
}


// Additional functions

function memberResources (user) {
  let myIssues = getAllIssues().filter(issue => issue.assignee === user.id);
  myIssues = myIssues.sort((a,b) => sortItemsByDate(b,a,'updateDate'));
  return `
    <div class="col mb-5">
    ${memberCard(user)}
    ${issueList2(myIssues, '', 'in progress')}
    ${issueList2(myIssues, '', 'open')}
    </div>
  `;
}


module.exports = resourcesView;
