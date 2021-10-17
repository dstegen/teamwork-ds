/*!
 * project/views/project-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllProjects } = require('../models/model-project');
const { getAllIssues } = require('../../issue/models/model-issue');


function projectListView () {
  let allProjects = getAllProjects();
  return `
    <div id="project-list-view" class="container-fluid p-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Projects overview
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 gx-4 gy-1">
        ${allProjects.map(projectCard).join('')}
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
            <div class="fw-bold mb-2">Details:</div>
            ${Object.entries(project).map(projectDetailLine).join('')}
          </div>
          <hr />
          <div class="fw-bold mb-2">Progress:</div>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${projectProgress}%" aria-valuenow="${projectProgress}" aria-valuemin="0" aria-valuemax="100">${projectProgress}%</div>
          </div>
        </div>
        <div class="card-footer text-end">
          <a href="#">Edit project</a>
        </div>
      </div>
    </div>
  `;
}

function projectDetailLine (inArray) {
  if (!['id','name'].includes(inArray[0])) {
    return `<span>${inArray[0]}: ${inArray[1]}</span><br />`;
  } else {
    return '';
  }
}

module.exports = projectListView;
