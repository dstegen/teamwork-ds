/*!
 * project/templates/project-card.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const { humanDate } = require('../../lib/dateJuggler');


function projectCard (project, small=false) {
  let projectIssues = getAllIssues().filter(item => item.projectId === project.id);
  let issuesClosed = projectIssues.filter(item => item.state === 'closed').length;
  let projectProgress = Number(issuesClosed/projectIssues.length*100).toFixed(0);
  let headlineClass = '';
  let detailClass = '';
  let cardLink = '';
  let editLink = `<span>
                    <a href="/board/${project.id}" class="btn btn-sm btn-primary me-2">View board</a>
                    <a href="/calendar/project/${project.id}" class="btn btn-sm btn-primary me-2">View calendar</a>
                    <a href="/project/edit/${project.id}" class="btn btn-sm btn-warning">Edit</a>
                  </span>`;
  if (small) {
    headlineClass = 'h5';
    detailClass = 'small';
    cardLink = `onclick="window.location.href='/project/view/${project.id}'" style="cursor: pointer;"`;
    editLink = '';
  }
  return `
      <div class="card">
        <div class="card-body" ${cardLink}>
          <h4 class="card-title d-flex justify-content-between ${headlineClass}">
            ${project.name}
            ${editLink}
          </h4>
          <h6 class="card-subtitle mb-2 text-muted">ID: ${project.id}</h6>
          <div class="card-text">
            ${Object.entries(project).map( entry => projectDetailLine(entry, detailClass)).join('')}
          </div>
          <hr />
          <div class="fw-bold mb-2">Progress:</div>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${projectProgress}%" aria-valuenow="${projectProgress}" aria-valuemin="0" aria-valuemax="100">${projectProgress}%</div>
          </div>
          <div class="d-flex justify-content-between mt-1 small">
            ${small ? '' : projectStateLine(projectIssues)}
          </div>
        </div>
        <div class="d-none card-footer d-flex justify-content-end">

        </div>
      </div>
  `;
}


// Additional functions

function projectDetailLine (inArray, detailClass) {

  if (inArray[0].includes('Date')) {
    let tmpDate = '';
    if (inArray[1] !== '') tmpDate = humanDate(inArray[1]);
    return `<span class="text-capitalize ${detailClass}">${inArray[0]}: ${tmpDate}</span><br />`;
  } else if (!['id','name'].includes(inArray[0])) {
    return `<span class="text-capitalize ${detailClass}">${inArray[0]}: ${inArray[1]}</span><br />`;
  } else {
    return '';
  }
}

function projectStateLine (projectIssues) {
  let returnHtml = '';
  ['backlog','open','in progress','resolved','closed'].forEach( state => {
    returnHtml += `<span>${state}: ${projectIssues.filter(item => item.state === state).length}</span>`;
  });
  return returnHtml;
}

module.exports = projectCard;
