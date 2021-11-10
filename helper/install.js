/*!
 * helper/install.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');
const { newDate } = require('../lib/dateJuggler');
const saveFile = require('../utils/save-file');
const createDir = require('../utils/create-dir');
const bcrypt = require('bcryptjs');
const readline = require('readline');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


if (!fs.existsSync(path.join(__dirname, '../data'))) {
  console.log('Installing necessary data structure & files...');
  createDir(path.join(__dirname, '../data'));
  createDir(path.join(__dirname, '../data/issues'));
  createDir(path.join(__dirname, '../data/attachements'));
  createDir(path.join(__dirname, '../data/boards'));
  createDir(path.join(__dirname, '../data/projects'));
  createDir(path.join(__dirname, '../data/projects/0'));
  let config = {
    "lang": "en",
    "classes": [
    ],
    "courseColors": [
      "bg-green",
      "bg-blue",
      "bg-red",
      "bg-yellow",
      "bg-brown",
      "bg-grey",
      "bg-teal",
      "bg-purple",
      "bg-lightgrey"
    ]
  };
  saveFile(path.join(__dirname, '../data'), 'config.json', config);
  let issues = [];
  saveFile(path.join(__dirname, '../data'), 'issues.json', issues);
  let projects = [
    {
      "id": 0,
      "name": "Start with TeamWork-DS",
      "description": "This is your example project to get familiar with TeamWork-DS!",
      "createDate": newDate(),
      "state": "started",
      "dueDate": "",
      "finishDate": ""
    }
  ];
  saveFile(path.join(__dirname, '../data'), 'projects.json', projects);
  let chat = [];
  saveFile(path.join(__dirname, '../data/projects/0'), 'chat.json', chat);
  let privateMessages = [];
  saveFile(path.join(__dirname, '../data'), 'private-messages.json', privateMessages);
  let allEvents = [
    {
      "id": 9000000,
      "start": newDate(),
      "end": "",
      "title": "Start with TeamWork-DS",
      "allDay": true,
      "members": "100000"
    }
  ];
  saveFile(path.join(__dirname, '../data'), 'events.json', allEvents);
  let allCalendars = [
    {
      id: 101,
      name: 'Team calendar',
      color: 'primary',
      url: '/calendar/load/101'
    }
  ];
  saveFile(path.join(__dirname, '../data'), 'calendars.json', allCalendars);
  // Install steps: 0=install, 1=email, 2=passwd, 3=passwd complete, 4=install complete
  let steps = [false, false, false, false, false];
  console.log('\nFor loggin into the TeamWork-DS pls setup login credentials now!');
  rl.question('\n- Please enter your email-address: ', (email) => {
    //email = email;
    rl.question('\n- Please enter your password: ', (password) => {
      //password = password;
      rl.question('\n- Please enter your first name: ', fname => {
        //firstname
        rl.question('\n- Please enter your last name: ', lname => {
          //lastname
          steps[2] =true;
          if (steps[2]) steps[3] = createPasswd(email, password, fname, lname);
          console.log('\nOk, everything ist installed now! Pls start TeamWork-DS with "npm start"!\n');
          if (steps[3]) process.exit(0);
        });
      });
    });
  });
} else {
  console.log('Everything is already installed!');
  process.exit(0);
}


// Additional functions

function createPasswd (myEmail, myPassword, fname, lname) {
  let usersList = [];
  let tmpObj = {};
	tmpObj.userId = myEmail;
  tmpObj.id = 100000;
	tmpObj.password = bcrypt.hashSync(myPassword);
  tmpObj.role = 'member';
  tmpObj.fname = fname;
  tmpObj.lname = lname;
  tmpObj.email = myEmail;
  usersList.push(tmpObj);
  saveFile(path.join(__dirname, '../data'), 'users.json', usersList);
  return true;
}
