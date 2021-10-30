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


function activitiesList () {
  return `
    <h5 class="d-flex justify-content-between p-3 mb-3 border">
      Recent activities
      <span class="supersmall">
        <a href="#" onclick="filterActivities('all')" class="text-muted">all</a>
         | <a href="#" onclick="filterActivities('issue')" class="text-muted">issues</a>
         | <a href="#" onclick="filterActivities('comment')" class="text-muted">comments</a>
         | <a href="#" onclick="filterActivities('calendar')" class="text-muted">calendar</a>
      </span>
    </h5>
    <div class="border p-3 mb-5" style="max-height: 300px; overflow: auto;">
      ${getAllActivties().map(activityView).join('')}
    </div>
  `;
}


// Additional functions

function activityView (activity) {
  return `
  <p class="activity type-${activity.type}">
    + ${getUserFullName(activity.member)} <a href="${activity.url}">${activity.text}</a>
    <br />
    <small class="text-muted">&nbsp;&nbsp;&nbsp;&nbsp;${getUserFullName(activity.member)}, ${humanDate(activity.timestamp)}</small>
  </p>`;
}


module.exports = activitiesList;
