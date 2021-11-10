/*!
 * helper/add-example-events.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');
const uuidv4 = require('uuid').v4;
const { initUsers, getAllUsers } = require('../user/models/model-user');
const loadFile = require('../utils/load-file');
const saveFile = require('../utils/save-file');
const { getWeekDates } = require('../lib/dateJuggler');

let events = [];
if (fs.existsSync (path.join(__dirname, '../data/events.json'))) {
  events = loadFile(path.join(__dirname, '../data/events.json'));
}

initUsers();
let allUserIds = getAllUsers().map(item => { return item.id; });

console.log('\n+++ Adding some example events to the calendar...\n');

let thisWeekArray = getWeekDates(0);
individualMeetings(thisWeekArray);
weeklyMeetings(thisWeekArray);
weekendWorkshop(thisWeekArray);

let nextWeekArray = getWeekDates(1);
individualMeetings(nextWeekArray);
weeklyMeetings(nextWeekArray);
weekendWorkshop(nextWeekArray);

saveFile(path.join(__dirname, '../data'), 'events.json', events);


// Additional functions

function individualMeetings (weeksArray) {
  let meetingTitles = ['Product meeting','Marketing meeting','Developer meeting'];
  let timesArray = ['T12:00:00+01:00','T13:00:00+01:00','T15:00:00+01:00','T16:00:00+01:00','T17:00:00+01:00'];
  allUserIds.forEach( userId => {
    let startDate = weeksArray[Math.floor(Math.random() * (5 - 0) + 0)];
    startDate = startDate.split('T')[0]+timesArray[userId%5];
    events.push(
      {
        id: getNewId(),
        title: meetingTitles[userId%3],
        start: startDate,
        end: '',
        members: userId.toString(),
        allDay: false,
        online: false,
        sourceUrl: '/calendar/load/101',
        description: ''
      }
    );
  });
}

function weeklyMeetings (weeksArray) {
  [1,3].forEach( day => {
    let eventId = getNewId();
    events.push(
      {
        id: eventId,
        title: 'Group Meeting',
        start: weeksArray[day],
        end: '',
        members: allUserIds.toString(),
        allDay: false,
        online: true,
        url: '/meeting/attend/'+eventId,
        key: uuidv4(),
        sourceUrl: '/calendar/load/101',
        description: ''
      }
    );
  });
}

function weekendWorkshop (weeksArray) {
  events.push(
    {
      id: getNewId(),
      title: 'Weekend workshop',
      start: weeksArray[4].split('T')[0],
      end: weeksArray[6].split('T')[0],
      members: allUserIds.toString(),
      allDay: true,
      sourceUrl: '/calendar/load/101',
      description: ''
    }
  );
}

function getNewId () {
  if (events.length > 0) {
    return Math.max(...events.map( item => item.id)) + 1;
  } else {
    return 9000001;
  }
}
