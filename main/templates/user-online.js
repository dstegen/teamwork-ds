/*!
 * main/templates/user-online.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const { usersOnline } = require('../../user/models/model-user');
const simpleList = require('../templates/simple-list');


function userOnline (allGroups, lang='en') {
  return `
    <div class="border py-2 px-3 mb-3">
      <h4>${locale.headlines.students_online[lang]}</h4>
      <hr />
      ${studentsOnline(allGroups, lang)}
    </div>
  `;
}


// Additional functions

function studentsOnline (allGroups, lang) {
  let returnHtml = '';
  allGroups.forEach( group => {
    let headline = '';
    if (allGroups.length > 1) {
      headline = locale.headlines.class[lang]+' '+group;
    }
    returnHtml += simpleList(headline, usersOnline(group));
  });
  return returnHtml;
}


module.exports = userOnline;
