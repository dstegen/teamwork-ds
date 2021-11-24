/*!
 * issue/templates/issue-history.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllActivties } = require('../../main/models/model-activity');
const { getUserFullName } = require('../../user/models/model-user');
const { humanDate } = require('../../lib/dateJuggler');
const userAvatar = require('../../user/templates/user-avatar');


function issueHistory (issueId) {
  let myActivities = getAllActivties().filter(item => (item.type === 'issue' && Number(item.url.split('/')[3]) === issueId));
  return `
    <div class="d-flex justify-content-between mt-4 mb-3">
      <h5>History:</h5>
      <span>
        <button type="button" class="btn btn-sm btn-outline-info" id="toggle-button-issue${issueId}" onclick="toggleChat('chat-window-issue${issueId}')"> - </button>
      </span>
    </div>
    <div id="chat-window-issue${issueId}" class="collapse show" >
      ${myActivities.map(activityView).join('')}
    </div>
  `;
}


// Additional functions

function activityView (activity) {
  let fullName = getUserFullName(activity.member).split(' ');
  return `
  <p class="activity type-${activity.type} text-truncate">
    ${userAvatar(activity.member, '20')} ${fullName[0]} <a href="${activity.url}">${activity.text}</a>
    <br />
    <small class="text-muted"><span style="width: 25px; display: inline-block;"></span>${getUserFullName(activity.member)}, ${humanDate(activity.timestamp)}</small>
  </p>`;
}


module.exports = issueHistory;
