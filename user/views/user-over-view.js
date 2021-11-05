/*!
 * user/views/user-over-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllUsers } = require('../models/model-user');
const memberCard = require('../../main/templates/member-card');

function userOverView () {
  return `
    <div id="members-view" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Team members
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 gx-4 gy-1">
        ${getAllUsers().map(memberCard).join('')}
      </div>
    </div>
  `;
}


module.exports = userOverView;
