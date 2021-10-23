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


function getAllEvents () {
  let allEvents = loadFile(path.join(__dirname, '../../data/events.json'));
  return allEvents;
}

function getEvent (eventId) {

}

function updateEvent (fields) {

}

function deleteEvent (eventId) {

}


module.exports = { getAllEvents, getEvent, updateEvent, deleteEvent };
