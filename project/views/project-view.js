/*!
 * project/views/project-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const projectCard = require('../templates/project-card');
const { getAllIssues } = require('../../issue/models/model-issue');
const issueList2 = require('../../issue/templates/issue-list2');
const chat = require('../../communication/templates/chat');
const timetrackingList = require('../../timetracking/templates/timetracking-list');


function projectView (project, user) {
  return `
    <div id="project-list-view" class="container py-3 mb-5">
      <div class="row row-cols-1 row-cols-lg-2 gx-4 gy-1 py-3">
        <div class="col">
          ${projectCard(project)}
          ${chat([project.id], user)}
          <div class="p-3 border">
            <h4>Timetracking</h4>
            ${timetrackingList(project.id)}
          </div>
        </div>
        <div class="col">
          <div class="card mb-1">
            <div class="card-body">
              <div class="card-title d-flex justify-content-between my-0 align-middle">
                <h5 class="mb-0 mt-1">Issues:</h5>
                <a href="/issue/create?projectId=${project.id}" class="btn btn-primary btn-sm text-capitalize">Create issue</a>
              </div>
            </div>
          </div>
          ${issueList2(getAllIssues(project.id), undefined, '')}
          <hr class="my-4" />
          ${issueList2(getAllIssues(project.id), undefined, 'closed')}
        </div>
      </div>
    </div>
  `;
}


module.exports = projectView;
