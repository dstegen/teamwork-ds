/*!
 * calendar/models/model-calendar.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const uuidv4 = require('uuid').v4;
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');
const { getAllIssues } = require('../../issue/models/model-issue');
const { addActivity } = require('../../main/models/model-activity');


function getAllEvents (id) {
  let allEvents = loadFile(path.join(__dirname, '../../data/events.json'));
  let myColors = {
    101: 'var(--bs-primary)',
    102: 'var(--bs-success)',
    103: 'var(--bs-secondary)',
    104: 'var(--bs-warning)',
    105: 'var(--bs-info)'
  }
  if (id !== undefined) {
    allEvents = allEvents.filter(item => item.sourceUrl === '/calendar/load/'+id);
    allEvents.forEach( item => {
      item.color = myColors[item.sourceUrl.split('/')[3]];
    });
  }
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
          start: issue.startDate,
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
  return getAllEvents().filter(item => item.id === Number(eventId))[0];
}

function createCalendar (fields) {
  console.log(fields);
  let allCalendars = loadFile(path.join(__dirname, '../../data/calendars.json'));
  let newCal = {};
  try {
    let nextCalId = Math.max(...allCalendars.map( item => item.id)) + 1;
    newCal.id = nextCalId;
    newCal.name = sani(fields.name);
    newCal.color = sani(fields.color);
    newCal.url = '/calendar/load/'+nextCalId;
    allCalendars.push(newCal);
    saveFile(path.join(__dirname, '../../data'), 'calendars.json', allCalendars);
    console.log('+ Created new calendar successfully: '+nextCalId);
  } catch (e) {
    console.log('- ERROR while creating new calendar: '+e);
  }
}

function getAllCalendars () {
  return loadFile(path.join(__dirname, '../../data/calendars.json'));
}

function updateEvent (fields, user) {
  console.log(fields);
  let tmpEvent = {};
  let membersArray = [];
  let allEvents = getAllEvents();
  Object.keys(fields).forEach(key => {
    if (key === 'id') {
      if (fields.id === null || fields.id === '' || fields.id === undefined) {
        tmpEvent.id = Math.max(...allEvents.map( item => item.id)) + 1;
      } else {
        fields.id = sani(fields.id);
      }
    } else if (key === 'online' && fields.online === 'true') {
      // Online meeting
      tmpEvent.online = true;
      tmpEvent.url = '/meeting/attend/'+tmpEvent.id;
      tmpEvent.key = uuidv4();
    } else if (key.startsWith('membersItems')) {
      if (fields[key] != '') membersArray.push(sani(fields[key]));
    } else {
      tmpEvent[key] = sani(fields[key]);
    }
  });
  if (membersArray.length > 0) tmpEvent.members = membersArray.toString();
  //console.log(tmpEvent);
  if (allEvents.filter(item => item.id === Number(fields.id)).length > 0) {
    // Update event
    Object.keys(tmpEvent).forEach( key => {
      if (!['id','url','key'].includes(key)) {
        allEvents.filter(item => item.id === Number(fields.id))[0][key] = tmpEvent[key];
      }
    });
    addActivity('updated calendar event "'+tmpEvent.title+'"', user.id, 'calendar', tmpEvent.id);
    console.log('+ Event updated: '+tmpEvent.title+' '+tmpEvent.start);
  } else {
    // Add event
    allEvents.push(tmpEvent);
    addActivity('added calendar event "'+tmpEvent.title+'"', user.id, 'calendar', tmpEvent.id);
    console.log('+ Event added: '+tmpEvent.title+' '+tmpEvent.start);
  }
  saveFile(path.join(__dirname, '../../data'), 'events.json', allEvents);
}

function deleteEvent (eventId, user) {
  let delEventTitle = getEvent(eventId).title;
  let allEvents = getAllEvents().filter(item => item.id !== Number(eventId));
  saveFile(path.join(__dirname, '../../data'), 'events.json', allEvents);
  addActivity('Calendar event "'+delEventTitle+'" deleted', user.id, 'calendar', Number(eventId));
  console.log('- Deleted event with ID: '+eventId);
}


module.exports = { getAllEvents, getProjectEvents, getEvent, updateEvent, deleteEvent, createCalendar, getAllCalendars };
