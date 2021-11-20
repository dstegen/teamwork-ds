/*!
 * timetracking/views/timetracking-overview.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getProjectById } = require('../../project/models/model-project');
const { getIssue } = require('../../issue/models/model-issue');
const timetrackingModal = require('../templates/timetracking-modal');

let trackingSum = 0;


function timetrackingOverview (trackingData, user=undefined) {
  trackingSum = 0;
  return `
    <div id="timetracking-overview" class="container py-3 mb-5">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        ${user !== undefined ? user.fname+'s ' : ''}Timetracking overview
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#timetrackingModal"> + </button>
      </h2>
      <div class="border p-3">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Issue</th>
              <th scope="col">Project</th>
              <th scope="col">Date</th>
              <th scope="col">Time (hrs)</th>
              <th scope="col">Description</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            ${trackingData.map(timetrackingRow).join('')}
          </tbody>
        </table>
        <p>Tracking sum: ${trackingSum} hrs.</p>
      </div>
    </div>
    ${timetrackingModal()}
  `;
}


// Additional functions

function timetrackingRow (trackingItem) {
  trackingSum = trackingSum + Number(trackingItem.time);
  return `
    <tr>
      <td>${getIssue(trackingItem.issueId).name}</td>
      <td>${getProjectById(trackingItem.projectId).name}</td>
      <td>${trackingItem.date}</td>
      <td>${trackingItem.time}</td>
      <td class="text-truncate">${trackingItem.description}</td>
      <td class="d-flex justify-content-end"><button type="button" class="btn btn-sm btn-warning" onclick='editTimetracking(${JSON.stringify(trackingItem)})' >Edit</button></td>
    </tr>
  `;
}


module.exports = timetrackingOverview;
