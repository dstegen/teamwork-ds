/*!
 * helper/user-importer.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const uuidv4 = require('uuid').v4;

let startId = 100100;


function userImporter(namesList, users=[]) {
  namesList.forEach( name => {
    if (name.split(',')[0] && name.split(',')[0] !== '') {
      let tmpObj = {};
      tmpObj.userId = name.split(',').slice(0,2).toString().toLowerCase().replace(',','.')+'@me.com';
      tmpObj.id = getNextUserId(users);
      tmpObj.password = uuidv4().toString();
      tmpObj.role = 'member';
      tmpObj.fname = name.split(',')[0];
      tmpObj.lname = name.split(',')[1];
      tmpObj.position = name.split(',')[2];
      tmpObj.email = name.split(',').slice(0,2).toString().toLowerCase().replace(',','.')+'@me.com';
      users.push(tmpObj);
    }
  });
  return users;
}


// Additional functions

function getNextUserId (users) {
  if (users === undefined ) {
    startId++;
    return startId;
  } else {
    return Math.max(...users.map( item => item.id)) + 1;
  }
}


module.exports = userImporter;
