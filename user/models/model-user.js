/*!
 * user/models/model-user.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { dateIsRecent } = require('../../lib/dateJuggler');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');

let users = [];


function initUsers () {
  users = loadFile(path.join(__dirname, '../../data/users.json'), true);
}

function getPasswdObj () {
  let passwdObj = {};
  users.forEach( user => {
    passwdObj[user.userId] = user.password;
  });
  return passwdObj;
}

function getUserDetails (userId) {
  let currUser = users.filter( user => user.userId === userId )[0];
  if (currUser != undefined) {
    return currUser;
  } else {
    return {};
  }
}

function getAllUsers () {
  return users;
}

function usersOnline () {
  let onlineUsers = [];
  try {
    let sessionIds = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sessionids.json')));
    onlineUsers = sessionIds.map( user => { return Object.values(user)[0]; } ).length;
  } catch (e) {
    console.log('- ERROR reading determing online students: '+e);
  }
  return onlineUsers;
}

function cleanLogins () {
  if (fs.existsSync(path.join(__dirname, '../../sessionids.json'))) {
    let sessionIds = loadFile(path.join(__dirname, '../../sessionids.json'));
    sessionIds = sessionIds.filter( item => dateIsRecent(item.timeStamp, 1));
    saveFile(path.join(__dirname, '../../'), 'sessionids.json', sessionIds);
  }
}

function getUserById (id) {
  if (id !== '' && typeof(id) === 'number') {
    return users.filter( user => user.id === id)[0];
  } else {
    return {}
  }
}

function getUserFullName (id) {
  let user = users.filter( user => user.id === id)[0];
  if (users.filter( user => user.id === id).length >0) {
    return user.fname + ' ' + user.lname;
  } else {
    return '';
  }
}

function getUserShortName (id) {
  let user = users.filter( user => user.id === id)[0];
  if (users.filter( user => user.id === id).length >0) {
    return user.fname.split('')[0] + '. ' + user.lname;
  } else {
    return '';
  }
}

function getUserInitials (id) {
  let user = users.filter( user => user.id === id)[0];
  if (users.filter( user => user.id === id).length >0) {
    return user.fname.split('')[0] + user.lname.split('')[0];
  } else {
    return '';
  }
}


function updateUser (fields) {
  if (fields.id !== '' && fields.userId !== '') {
    // update user
    let tmpObj = users.filter( user => user.id === Number(fields.id))[0];
    Object.keys(fields).forEach( key => {
      if (key !== 'id' && key !== 'password' && fields[key] !== '') {
        tmpObj[key] = sani(fields[key]);
      }
    });
  } else if (fields.userId !== '') {
    // add user
    let myPassword = '123';
    if (fields.password !== '' && typeof(fields.password) === 'string') {
      myPassword = fields.password;
    }
    users.push({
      userId: sani(fields.userId),
      id: getNewId(users),
      password: bcrypt.hashSync(myPassword),
      role: 'member',
      position: sani(fields.position),
      fname: sani(fields.fname),
      lname: sani(fields.lname),
      email: sani(fields.email),
      phone: sani(fields.phone)
    });
  }
  saveFile(path.join(__dirname, '../../data'), 'users.json', users);
  console.log('+ User sucessfully added/updated: '+fields.userId);
  initUsers();
}

function updatePassword (fields) {
  let curUser = users.filter( user => user.userId === fields.userId)[0];
  if (curUser !== undefined) {
    curUser.password = bcrypt.hashSync(fields.new_password);
    saveFile(path.join(__dirname, '../../data'), 'users.json', users);
    console.log('+ Password sucessfully updated for userId: '+fields.userId);
  }
}



// Additional functions

function getNewId (users) {
  if (users.length > 0) {
    return Math.max(...users.map( item => item.id)) + 1;
  } else {
    return 100001;
  }
}


module.exports = { initUsers, getPasswdObj, getUserDetails, getAllUsers, usersOnline, cleanLogins, getUserById, updateUser, updatePassword, getUserFullName, getUserShortName, getUserInitials };
