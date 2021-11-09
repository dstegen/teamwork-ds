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
const uuidv4 = require('uuid').v4;
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');
const { getAllIssues } = require('../../issue/models/model-issue');
const { addActivity } = require('../../main/models/model-activity');


function getAllEvents (id) {
  let allEvents = loadFile(path.join(__dirname, '../../data/calendars/'+id+'_events.json'));
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

function getEvent (eventId, sourceId='/calendar/load/101') {
  return getAllEvents(sourceId.split('/')[3]).filter(item => item.id === Number(eventId))[0];
}

function createCalendar () {
  try {
    let nextCalId = fs.readdirSync(path.join(__dirname, '../../data/calendars')).length+100;
    saveFile(path.join(__dirname, '../../data/calendars'), nextCalId+'_events.json', []);
    console.log('+ Created new calendar successfully: '+nextCalId);
  } catch (e) {
    console.log('- ERROR while creating new calendar: '+e);
  }
}

function getCalendarUrls () {
  try {
    let returnList = [];
    let allCalendars = fs.readdirSync(path.join(__dirname, '../../data/calendars'));
    if (allCalendars.length > 0) {
      allCalendars.forEach( item => {
        if (item.includes('event')) {
          returnList.push('/calendar/load/'+item.split('_')[0]);
        }
      });
    return returnList;
    }
  } catch (e) {
    console.log('- ERROR reading all calendars: '+e);
    return [];
  }
}

function updateEvent (fields, user) {
  console.log(fields);
  let allEvents = getAllEvents(fields.sourceUrl.split('/')[3]);
  let membersArray = [];
  if (allEvents.filter(item => item.id === Number(fields.id)).length > 0) {
    // update
    //console.log('+ Update event: '+fields.title+' '+fields.start);
    if (Object.keys(fields).includes('allDay') && fields.allDay === 'true') {
      allEvents.filter(item => item.id === Number(fields.id))[0].allDay = true;
    } else {
      allEvents.filter(item => item.id === Number(fields.id))[0].allDay = false;
    }
    allEvents.filter(item => item.id === Number(fields.id))[0].online = false;
    Object.keys(fields).forEach( key => {
      if (key.startsWith('membersItems')) {
        if (fields[key] != '') membersArray.push(sani(fields[key]));
      } else if (key === 'online') {
        // Online meeting
        if (fields[key] === 'true') {
          allEvents.filter(item => item.id === Number(fields.id))[0].online = true;
          allEvents.filter(item => item.id === Number(fields.id))[0].url = '/meeting/attend/'+fields.id;
          allEvents.filter(item => item.id === Number(fields.id))[0].key = uuidv4();
        }
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
    tmpEvent.id = Math.max(...getAllEvents(fields.sourceUrl.split('/')[3]).map( item => item.id)) + 1;
    if (tmpEvent.id < 1) tmpEvent.id = Number(fields.sourceUrl.split('/')[3])*1000000+1;
    Object.keys(fields).forEach( key => {
      if (key.startsWith('membersItems')) {
        if (fields[key] != '') membersArray.push(sani(fields[key]));
      } else if (key === 'allDay') {
        if (fields.allDay === 'true') {
          tmpEvent.allDay = true;
        } else {
          tmpEvent.allDay = false;
        }
      } else if (key === 'online' && fields[key] === 'true') {
        // Online meeting
        tmpEvent.online = true;
        tmpEvent.url = '/meeting/attend/'+tmpEvent.id;
        tmpEvent.key = uuidv4();
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
  saveFile(path.join(__dirname, '../../data/calendars'), fields.sourceUrl.split('/')[3]+'_events.json', allEvents);
  addActivity('updated calendar event "'+fields.title+'" updated', user.id, 'calendar', fields.id);
  console.log('+ Event updated/added: '+fields.title+' '+fields.start);
}

function deleteEvent (eventId, user, calId=101) {
  let delEventTitle = getEvent(eventId).title;
  let allEvents = getAllEvents(calId).filter(item => item.id !== Number(eventId));
  saveFile(path.join(__dirname, '../../data/calendars'), calId+'_events.json', allEvents);
  addActivity('Calendar event "'+delEventTitle+'" deleted', user.id, 'calendar', Number(eventId));
  console.log('- Deleted event with ID: '+eventId);
}


module.exports = { getAllEvents, getProjectEvents, getEvent, updateEvent, deleteEvent, createCalendar, getCalendarUrls };
