/*!
 * timetracking/models/model-timetracking.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4;
const { newDate } = require('../../lib/dateJuggler');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');


function getAllTimetracking (user) {
  let allTimetracking = [];
  if (fs.existsSync(path.join(__dirname, '../../data/timetracking.json'))) {
    allTimetracking = loadFile(path.join(__dirname, '../../data/timetracking.json'));
  } else {
    saveFile(path.join(__dirname, '../../data'), 'timetracking.json', allTimetracking);
  }
  if (user !== undefined) allTimetracking = allTimetracking.filter(item => item.userId === user.id)
  return allTimetracking;
}

function updateTimetracking (fields, user) {
  let allTimetracking = getAllTimetracking();
  let trackingObj = {};
  if (fields.id && fields.id !== '') {
    // Update
    trackingObj = allTimetracking.filter(item => item.id === fields.id)[0];
    trackingObj.description = sani(fields.description);
    trackingObj.projectId = Number(fields.projectId);
    trackingObj.issueId = Number(fields.issueId);
    trackingObj.date = fields.date;
    trackingObj.time = fields.time.replace(',','.');
    trackingObj.timeStamp = newDate();
    console.log('+ Updated timetracking ID: '+fields.id);
  } else {
    // Add
    trackingObj.id = uuidv4();
    trackingObj.description = sani(fields.description);
    trackingObj.projectId = Number(fields.projectId);
    trackingObj.issueId = Number(fields.issueId);
    trackingObj.userId = user.id;
    trackingObj.date = fields.date;
    trackingObj.time = fields.time.replace(',','.');
    trackingObj.timeStamp = newDate();
    allTimetracking.push(trackingObj);
    console.log('+ Added timetracking ID: '+trackingObj.id);
  }
  saveFile(path.join(__dirname, '../../data'), 'timetracking.json', allTimetracking);
}

function deleteTimetracking (fields, user) {

}


module.exports = { getAllTimetracking, updateTimetracking, deleteTimetracking };
