/*!
 * main/main/models/model-activity.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const { newDate } = require('../../lib/dateJuggler');
const sortItemsByDate = require('../../utils/sort-items-by-date');

let activities = [];

if (fs.existsSync(path.join(__dirname, '../../data/activities.json'))) {
  activities = loadFile(path.join(__dirname, '../../data/activities.json'));
} else {
  saveFile(path.join(__dirname, '../../data'), 'activities.json', activities);
}


function getAllActivties () {
  activities.sort((a,b) => sortItemsByDate(b,a,'timestamp'));
  return activities;
}

function addActivity (text, memberId=null, type='', id=1) {
  if (text !== undefined && text !== '') {
    let linkUrl = '/'+type+'/view/'+id
    if (type === 'comment') linkUrl = '/issue/view/'+id
    activities.push({
      text: text,
      member: memberId,
      timestamp: newDate(),
      type: type,
      id: id,
      url: linkUrl
    });
    saveFile(path.join(__dirname, '../../data'), 'activities.json', activities);
  }
}


module.exports = { getAllActivties, addActivity };
