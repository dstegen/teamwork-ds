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


function issueListView () {
  return `
    <div id="issuelistview" class="container-fluid p-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Issues
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2 px-3">
        ${[1,2,3].map(issueList).join('')}
      </div>
    </div>
  `;
}


// Additional functions

function issueList (projectId) {
  return `
    <div class="col-12 col-md-6 p-3">
      <h5>Project: ${getAllProjects().filter(item => item.id === projectId)[0].name}</h5>
      <div class="list-group">
        ${getAllIssues().filter( item => item.projectId === projectId).map( item => { return '<a href="/issue/view/'+item.id+'" class="list-group-item list-group-item-action">'+item.name+'</a>'}).join('')}
      </div>
    </div>
  `;
}


module.exports = issueListView;
