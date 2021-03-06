/*!
 * main/templates/activities-list.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllActivties } = require('../models/model-activity');
const { getUserFullName } = require('../../user/models/model-user');
const { humanDate } = require('../../lib/dateJuggler');
const userAvatar = require('../../user/templates/user-avatar');

function activitiesList (user=undefined) {
  let allActivities = getAllActivties().slice(0,20);
  if (user) allActivities = getAllActivties().filter(item => item.member !== user.id);
  return `
    <div class="d-flex justify-content-between p-3 mb-3 border">
      <h5 class="m-0">Recent activities</h5>
      <span class="small">
        <a href="#" onclick="filterActivities('all')" class="text-muted">all</a>
         | <a href="#" onclick="filterActivities('issue')" class="text-muted">issues</a>
         | <a href="#" onclick="filterActivities('comment')" class="text-muted">comments</a>
         | <a href="#" onclick="filterActivities('docs')" class="text-muted">docs</a>
         | <a href="#" onclick="filterActivities('calendar')" class="text-muted">calendar</a>
      </span>
    </div>
    <div class="border p-3 mb-5" style="max-height: 295px; overflow: auto;">
      ${allActivities.map(activityView).join('')}
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


module.exports = activitiesList;
