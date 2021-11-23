/*!
 * user/templates/user-avatar.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const { getUserInitials } = require('../models/model-user');


function userAvatar (userId, size='40') {
  if (fs.existsSync(path.join(__dirname, '../../data/users/pics/', userId+'.jpg'))) {
    return `<img src="/data/users/pics/${userId}.jpg" height="${size}" width="${size}" class="img-fluid border rounded-circle align-text-top"/>`;
  } else if (Number(size) > 30) {
    return '<span class="p-2 small border rounded-circle">' + getUserInitials(userId) + '</span>';
  } else {
    return '<span class="p-1 supersmall border rounded-circle">' + getUserInitials(userId) + '</span>';
  }
}


module.exports = userAvatar;
