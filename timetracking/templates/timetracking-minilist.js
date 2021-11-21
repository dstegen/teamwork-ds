/*!
 * timetracking/templates/timetracking-minilist.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllTimetracking } = require('../models/model-timetracking');
const { getUserById } = require('../../user/models/model-user');

let trackingSum = 0;


function timetrackingMinilist (issueId, user) {
  trackingSum = 0;
  let trackingData = getAllTimetracking(user).filter(item => item.issueId === issueId);
  return `
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Time (hrs)</th>
            <th scope="col">Description</th>
            <th scope="col">Member</th>
          </tr>
        </thead>
        <tbody>
          ${trackingData.map(timetrackingRow).join('')}
        </tbody>
      </table>
      <p>Tracking sum: ${trackingSum} hrs.</p>
    </div>
  `;
}


// Additional functions

function timetrackingRow (trackingItem) {
  trackingSum = trackingSum + Number(trackingItem.time);
  let curUser = getUserById(trackingItem.userId);
  return `
    <tr>
      <td>${trackingItem.date}</td>
      <td>${trackingItem.time}</td>
      <td class="text-truncate">${trackingItem.description}</td>
      <td>${curUser.fname.split('')[0]}. ${curUser.lname}</td>
    </tr>
  `;
}


module.exports = timetrackingMinilist;
