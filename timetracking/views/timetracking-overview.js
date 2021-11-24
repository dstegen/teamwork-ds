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
        ${user !== undefined ? user.fname+'s ' : ''}Timetracking
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#timetrackingModal"> + </button>
      </h2>
      <div class="border p-3 table-responsive">
        <table id="timetracking-table" class="table" data-order='[[ 2, "asc" ]]'>
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
      <td><a href="/issue/view/${trackingItem.issueId}">${getIssue(trackingItem.issueId).name}</a></td>
      <td><a href="/project/view/${trackingItem.projectId}">${getProjectById(trackingItem.projectId).name}</a></td>
      <td>${trackingItem.date}</td>
      <td>${trackingItem.time}</td>
      <td class="text-truncate">${trackingItem.description}</td>
      <td class="d-flex justify-content-end">
        ${delButton(trackingItem.id)}
        ${editPen(trackingItem)}
      </td>
    </tr>
  `;
}

function editPen (item) {
  return `
    <a id="pen-${item.id}" class="ms-3" href="#" onclick='editTimetracking(${JSON.stringify(item)})'>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
      </svg>
    </a>
  `;
}

function delButton (itemId) {
  return `
    <form class="ms-3" id="delform-${itemId}" action="/timetracking/delete" method="post">
      <input type="text" readonly class="d-none" id="id" name="id" value="${itemId}">
      <a href="#" onclick="fileDelete('delform-${itemId}')">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </a>
    </form>
  `;
}


module.exports = timetrackingOverview;
