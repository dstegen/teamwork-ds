/*!
 * main/views/get-welcome.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const { getDaytime } = require('../../lib/dateJuggler');


function getWelcome (lang) {
  switch (getDaytime()) {
    case 'AM':
      return locale.teacher.welcome_morning[lang];
    case 'PM':
      return locale.teacher.welcome_afternoon[lang];
    case 'NIGHT':
      return locale.teacher.welcome_evening[lang];
    default:
      return locale.teacher.welcome_afternoon[lang];
  }
}


module.exports = getWelcome;
