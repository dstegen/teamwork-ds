/*!
 * helper/install-example-data.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const execFileSync = require('child_process').execFileSync;
const { initUsers, getAllUsers } = require('../user/models/model-user');
const { getAllIssues } = require('../issue/models/model-issue');
const { newDate } = require('../lib/dateJuggler');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');
const createDir = require('../utils/create-dir');
const userImporter = require('./user-importer');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('\n--- Do you want to install example data? (Y/N) ', (answer) => {
  if (answer === 'Y' || answer === 'y') {
    console.log('+++ Ok, installing example data...\n');
    initUsers();
    let users = getAllUsers();
    try {
      // Add members to users
      console.log('+++ Adding some example members...\n');
      let namesList = loadFile(path.join(__dirname, '../helper/names_int.csv'), false, true).toString().split('\n');
      users = userImporter(namesList, users);
      saveFile(path.join(__dirname, '../data'), 'users.json', users);
      createDir(path.join(__dirname, '../data/users/pics'));
      users.map(item => {return item.id}).forEach( id => {
        if (fs.existsSync(path.join(__dirname, './example_pics', id.toString()+'.jpg'))) {
          fs.copyFileSync(path.join(__dirname, './example_pics', id.toString()+'.jpg'), path.join(__dirname, '../data/users/pics', id.toString()+'.jpg'));
        }
      });
      // Add Tasks to project "0"
      console.log('+++ Adding some example issues to the first project...\n');
      let issues = getAllIssues();
      let exampleIssues = loadFile(path.join(__dirname, './issues.json'));
      exampleIssues.forEach( (issue, i) => {
        issue.id = issues.length > 0 ? (Math.max(...issues.map( item => item.id)) + 1) : i;
        issue.createDate = newDate();
        issue.updateDate = newDate();
        issue.projectId = 0;
        issue.reporter = users[0].id;
        if (issue.state === 'in progress' || issue.state === 'closed') {
          issue.startDate = newDate();
        }
        if (issue.state === 'closed') {
          issue.closeDate = newDate();
        }
        createDir(path.join(__dirname, '../data/issues',issue.id.toString()));
      });
      issues = issues.concat(exampleIssues);
      saveFile(path.join(__dirname, '../data'), 'issues.json', issues);
      // Add Events to calendar
      console.log('+++ Adding some example events to the calendar...\n');
      let child = execFileSync('node', [path.join(__dirname, './add-example-events')]);
    } catch (e) {
      console.log('- ERROR couldn\'t install example data: '+e);
    }
  } else {
    process.exit(0);
  }
  console.log('+++ Adding example data finished!\n\n--- Pls start TeamWork-DS with "npm start" now.\n');
  process.exit(0);
});
