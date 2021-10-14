/*!
 * main/views/admin-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../models/model-config').getConfig();
const { formatDay } = require('../../lib/dateJuggler');
const { getAllUsers, getTitleNameById, usersOnline } = require('../../user/models/model-user');
const { getMessagesCount } = require('../../communication/models/model-messages');
const { getChatCount } = require('../../communication/models/model-chat');
const getWelcome = require('./get-welcome');


function adminView (user) {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Dashboard
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row">
        <div class="col-12 col-md-6">
        <div class="border py-2 px-3 mb-3">
            <h4>${getWelcome(config.lang)} ${getTitleNameById(user.id)},</h4>
            <p>
              ${locale.teacher.today_is[config.lang]} ${formatDay()}.
            </p>
            <br />

          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="border py-2 px-3 mb-3">
            <h4>Statistics:</h4>
            ${helperCounts('Teachers', getAllUsers().filter( item => item.role === 'teacher' ).length)}
            ${helperCounts('Students', getAllUsers().filter( item => item.role === 'student' ).length)}
            ${helperCounts('Classes', config.classes.length)}
            <hr />
            ${helperCounts('Messages count', getMessagesCount())}
            ${helperCounts('Chat count', getChatCount())}
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
