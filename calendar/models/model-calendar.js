/*!
 * calendar/models/model-calendar.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const { newDate } = require('../../lib/dateJuggler');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const createDir = require('../../utils/create-dir');
const sani = require('../../utils/sanitizer');
const { getAllIssues } = require('../../issue/models/model-issue');


function getAllEvents () {
  let allEvents = loadFile(path.join(__dirname, '../../data/events.json'));
  return allEvents;
}

function getProjectEvents (projectId) {
  let returnEvents = [];
  let allProjectIssues = getAllIssues(projectId);
  if (allProjectIssues.length > 0) {
    allProjectIssues.forEach( issue => {
      returnEvents.push(
        {
          id: 8000000 + issue.id,
          title: issue.name+' ['+issue.id+']',
          start: issue.createDate,
          end: issue.updateDate,
          url: '/issue/view/'+ issue.id.toString(),
          backgroundColor: 'rgb(255, 0, '+(issue.id%3)*80+')',
          borderColor: 'white',
          allDay: true
        }
      );
    });
  }
  return returnEvents;
}

function getEvent (eventId) {

}

function updateEvent (fields) {

}

function deleteEvent (eventId) {

}


module.exports = { getAllEvents, getProjectEvents, getEvent, updateEvent, deleteEvent };
