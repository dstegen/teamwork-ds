/*!
 * main/views/admin-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { formatDay } = require('../../lib/dateJuggler');
const { getAllUsers, usersOnline, getUserFullName } = require('../../user/models/model-user');
const getWelcome = require('./get-welcome');


function adminView (user) {
  return `
    <div id="admin-dashboard" class="container py-3">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Admin Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
            <h4>${getWelcome(config.lang)} ${getUserFullName(user.id)},</h4>
            <p>
              ${locale.teacher.today_is[config.lang]} ${formatDay()}.
            </p>
            <br />

          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>Statistics:</h4>
            ${helperCounts('Members', getAllUsers().filter( item => item.role === 'member' ).length)}
            <hr />
            ${helperCounts('Users online', usersOnline())}
            <br />
          </div>
        </div>
      </div>
    </div>
  `;
}


// Additional functions

function helperCounts (title, counts) {
  return `
    <p>
      ${title}: <strong>${counts}</strong>
    </p>
  `;
}


module.exports = adminView;
