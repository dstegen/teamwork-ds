/*!
 * calendar/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const { getAllEvents, getProjectEvents, updateEvent, deleteEvent, createCalendar } = require('./models/model-calendar');
const calendarView = require('./views/calendar-view');
const { getProjectById } = require('../project/models/model-project');


function calendarController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.split('/')[1] === 'project' && Number(route.split('/')[2]) > -1) {
    let project = getProjectById(Number(route.split('/')[2]));
    let calHeadline = 'Calendar for <a href="/project/view/'+project.id+'">'+project.name+'<a/>';
    uniSend(view(wsport, naviObj, calendarView(calHeadline, user, project)), response);
  } else if (route.startsWith('calendar/update')) {
    //add/updateIssue
    getFormObj(request).then(
      data => {
        updateEvent(data.fields, user);
        uniSend(new SendObj(302, [], '', '/calendar/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('calendar/delete')) {
    getFormObj(request).then(
      data => {
        deleteEvent(Number(data.fields.id), user);
        uniSend(new SendObj(302, [], '', '/calendar/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete event: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('calendar/load')) {
    let sendObj = new SendObj();
    sendObj.contentType = 'application/json';
    sendObj.statusCode = 200;
    if (route.includes('project')) {
      sendObj.data = JSON.stringify(getProjectEvents(route.split('/')[3]));
    } else {
      sendObj.data = JSON.stringify(getAllEvents(route.split('/')[2]));
    }
    uniSend(sendObj, response);
  } else if (route.startsWith('calendar/create')) {
    getFormObj(request).then(
      data => {
        createCalendar(data.fields, user);
        uniSend(new SendObj(302, [], '', '/calendar/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR creating new calendar: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
      }
    );
  } else {
    uniSend(view(wsport, naviObj, calendarView('Calendar', user)), response);
  }
}


module.exports = calendarController;
