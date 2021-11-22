/*!
 * timetracking/templates/timetracking-list.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllTimetracking } = require('../models/model-timetracking');
const { getIssue } = require('../../issue/models/model-issue');
const { getUserById } = require('../../user/models/model-user');

let trackingSum = 0;


function timetrackingList (projectId) {
  trackingSum = 0;
  let trackingData = getAllTimetracking().filter(item => item.projectId === projectId);
  return `
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Issue</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Member</th>
          </tr>
        </thead>
        <tbody>
          ${trackingData.map(timetrackingRow).join('')}
        </tbody>
        <tfoot>
        <tr>
          <td colspan="2"></td><td colspan="2"><strong>${trackingSum}</strong> hrs</td>
        </tr>
        </tfoot>
      </table>
    </div>
  `;
}


// Additional functions

function timetrackingRow (trackingItem) {
  trackingSum = trackingSum + Number(trackingItem.time);
  let curUser = getUserById(trackingItem.userId);
  return `
    <tr>
      <td><a href="/issue/view/${trackingItem.issueId}">${getIssue(trackingItem.issueId).name}</td>
      <td>${trackingItem.date}</td>
      <td>${trackingItem.time}</td>
      <td>${curUser.fname.split('')[0]}. ${curUser.lname}</td>
    </tr>
  `;
}


module.exports = timetrackingList;
