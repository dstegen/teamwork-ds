/*!
 * main/views/mydashboard-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const issueList2 = require('../../issue/templates/issue-list2');
const { getAllEvents } =require('../../calendar/models/model-calendar');
const calendarDayView = require('../../calendar/views/calendar-day-view');
const activitiesList = require('../templates/activities-list');
const recentMessages = require('../templates/recent-messages');
const userAvatar = require('../../user/templates/user-avatar');


function mydashboardView (wss, wsport, user) {
  return `
    <div id="dashboard" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        <span>${userAvatar(user.id, '38')} ${user.fname}s Dashboard</span>
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row py-2">
        <div class="col-12 col-lg-6">
          <div class="d-flex justify-content-between p-3 mb-3 border">
            <h5 class="m-0">My open issues</h5>
          </div>
          ${issueListWrapper(user)}
          ${recentMessages(user.id)}
        </div>
        <div class="col-12 col-lg-6">
          ${calendarDayView(getAllEvents(), user)}
          <div class="mt-5">
            ${activitiesList(user)}
          </div>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function issueListWrapper (user) {
  return `
    <div class="mb-3">
      ${issueList2(getAllIssues(), user, '')}
    </div>
  `;
}


module.exports = mydashboardView;
