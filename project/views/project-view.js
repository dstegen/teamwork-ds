/*!
 * project/views/project-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const issueList = require('../../issue/templates/issue-list');
const chat = require('../../communication/templates/chat');

function projectView (project, user) {
  return `
    <div id="project-list-view" class="container p-3" style="min-height: 500px;">
      <div class="row row-cols-1 row-cols-lg-2 gx-4 gy-1 py-2">
        ${projectCard(project)}
        <div class="col">
          <div class="card">
            <div class="card-body">
              ${chat([project.id], user, 130)}
            </div>
          </div>
        </div>
        <div class="col">
        <h5>Open issues:</h5>
        ${issueList(project.id, undefined, '')}
        </div><div class="col">
        <h5>Closed issues:</h5>
        ${issueList(project.id, undefined, 'closed')}
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function projectCard (project) {
  let projectIssues = getAllIssues().filter(item => item.projectId === project.id);
  let issuesClosed = projectIssues.filter(item => item.state === 'closed').length;
  let projectProgress = Number(issuesClosed/projectIssues.length*100).toFixed(0);
  return `
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${project.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${project.id}</h6>
          <div class="card-text">
            ${Object.entries(project).map(projectDetailLine).join('')}
          </div>
          <hr />
          <div class="fw-bold mb-2">Progress:</div>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${projectProgress}%" aria-valuenow="${projectProgress}" aria-valuemin="0" aria-valuemax="100">${projectProgress}%</div>
          </div>
        </div>
        <div class="card-footer d-flex justify-content-end">
          <a href="/project/edit/${project.id}">Edit project</a>
        </div>
      </div>
    </div>
  `;
}

function projectDetailLine (inArray) {
  if (!['id','name'].includes(inArray[0])) {
    return `<span class="text-capitalize">${inArray[0]}: ${inArray[1]}</span><br />`;
  } else {
    return '';
  }
}

module.exports = projectView;
