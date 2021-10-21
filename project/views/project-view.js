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
    <div id="project-list-view" class="container py-3" style="min-height: 500px;">
      <div class="row row-cols-1 row-cols-lg-2 gx-4 gy-1 py-3">
        ${projectCard(project,user)}
        <div class="col">
          <div class="card mb-1">
            <div class="card-body">
              <div class="card-title d-flex justify-content-between my-0 align-middle">
                <h5 class="mb-0 mt-1">Issues:</h5>
                <a href="/issue/create?projectId=${project.id}" class="btn btn-primary btn-sm text-capitalize">Create issue</a>
              </div>
            </div>
          </div>
          ${issueList(project.id, undefined, '')}
          <hr class="my-4" />
          ${issueList(project.id, undefined, 'closed')}
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function projectCard (project, user) {
  let projectIssues = getAllIssues().filter(item => item.projectId === project.id);
  let issuesClosed = projectIssues.filter(item => item.state === 'closed').length;
  let projectProgress = Number(issuesClosed/projectIssues.length*100).toFixed(0);
  return `
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title d-flex justify-content-between">
            ${project.name}
            <a href="/project/edit/${project.id}" class="btn btn-sm btn-warning">Edit</a>
          </h4>
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
      </div>
      ${chat([project.id], user)}
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
