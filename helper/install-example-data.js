/*!
 * helper/install-example-data.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const readline = require('readline');
const { initUsers, getAllUsers } = require('../user/models/model-user');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');
const userImporter = require('./user-importer');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('\n- Do you want to install example data? (Y/N) ', (answer) => {
  if (answer === 'Y' || answer === 'y') {
    console.log(' Ok, installing example data...');
    initUsers();
    let users = getAllUsers();
    try {
      // Add members to users
      let namesList = loadFile(path.join(__dirname, '../helper/names_int.csv'), false, true).toString().split('\n');
      users = userImporter(namesList, users);
      saveFile(path.join(__dirname, '../data'), 'users.json', users);
      // Add Tasks to project "0"

      // Add Events to calendar

    } catch (e) {
      console.log('- ERROR couldn\'t install example data: '+e);
    }
    process.exit(0);
  } else {
    process.exit(0);
  }
});
