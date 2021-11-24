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
  let trackingData = getAllTimetracking().filter(item => item.issueId === issueId);
  return `
    <div class="table-responsive">
      <table id="timetracking-table" class="table" data-order='[[ 0, "asc" ]]'>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Description</th>
            <th scope="col">Member</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          ${trackingData.map(item => timetrackingRow(item, user)).join('')}
        </tbody>
        <tfoot>
        <tr>
          <td></td><td colspan="3"><strong>${trackingSum}</strong> hrs</td>
        </tr>
        </tfoot>
      </table>
    </div>
  `;
}


// Additional functions

function timetrackingRow (trackingItem, user) {
  trackingSum = trackingSum + Number(trackingItem.time);
  let curUser = getUserById(trackingItem.userId);
  return `
    <tr>
      <td>${trackingItem.date}</td>
      <td>${trackingItem.time}</td>
      <td class="text-truncate">${trackingItem.description}</td>
      <td>${curUser.fname.split('')[0]}. ${curUser.lname}</td>
      <td>
        ${user.id === trackingItem.userId ? editPen(trackingItem) : ''}
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


module.exports = timetrackingMinilist;
