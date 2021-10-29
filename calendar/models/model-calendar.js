/*!
 * calendar/models/model-calendar.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');
const { getAllIssues } = require('../../issue/models/model-issue');
const { addActivity } = require('../../main/models/model-activity');


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
  return getAllEvents().filter(item => item.id === eventId)[0];
}

function updateEvent (fields, user) {
  let allEvents = getAllEvents();
  //console.log(fields);
  let membersArray = [];
  if (allEvents.filter(item => item.id === Number(fields.id)).length > 0) {
    // update
    //console.log('+ Update event: '+fields.title+' '+fields.start);
    if (Object.keys(fields).includes('allDay') && fields.allDay === 'true') {
      allEvents.filter(item => item.id === Number(fields.id))[0].allDay = true;
    } else {
      allEvents.filter(item => item.id === Number(fields.id))[0].allDay = false;
    }
    Object.keys(fields).forEach( key => {
      if (key.startsWith('membersItems')) {
        if (fields[key] != '') membersArray.push(sani(fields[key]));
      } else if (key !== 'id' && key !== 'allDay') {
        allEvents.filter(item => item.id === Number(fields.id))[0][key] = sani(fields[key]);
      }
    });
    if (membersArray.length > 0) {
      allEvents.filter(item => item.id === Number(fields.id))[0]['members'] = membersArray.toString();
    }
  } else {
    // add
    let tmpEvent = {};
    tmpEvent.id = Math.max(...allEvents.map( item => item.id)) + 1;
    Object.keys(fields).forEach( key => {
      if (key.startsWith('membersItems')) {
        if (fields[key] != '') membersArray.push(sani(fields[key]));
      } else if (key === 'allDay') {
        if (fields.allDay === 'true') {
          tmpEvent.allDay = true;
        } else {
          tmpEvent.allDay = false;
        }
      } else if (key !== 'id') {
        tmpEvent[key] = sani(fields[key]);
      }
    });
    if (membersArray.length > 0) {
      tmpEvent['members'] = membersArray.toString();
    }
    //console.log(tmpEvent);
    allEvents.push(tmpEvent);
  }
  saveFile(path.join(__dirname, '../../data/'), 'events.json', allEvents);
  addActivity('Calendar event "'+fields.title+'" updated', user.id, 'calendar', fields.id);
  console.log('+ Event updated/added: '+fields.title+' '+fields.start);
}

function deleteEvent (eventId, user) {
  let delEventTitle = getEvent(eventId).title;
  let allEvents = getAllEvents().filter(item => item.id !== Number(eventId));
  saveFile(path.join(__dirname, '../../data/'), 'events.json', allEvents);
  addActivity('Calendar event "'+delEventTitle+'" deleted', user.id);
  console.log('- Deleted event with ID: '+eventId);
}


module.exports = { getAllEvents, getProjectEvents, getEvent, updateEvent, deleteEvent };
