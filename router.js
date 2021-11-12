/*!
 * router.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { deliver, uniSend } = require('webapputils-ds');
const { userController, login, logout, userLoggedIn, userDetails } = require('./user');
const mainController = require('./main');
const issueController = require('./issue');
const communicationController = require('./communication');
const projectController = require('./project');
const fileController = require('./main/file-controller');
const boardController = require('./board');
const calendarController = require('./calendar');
const meetingController = require('./meeting');
const searchController = require('./main/search-controller');
const adminController = require('./admin');
const loginView = require('./user/views/login-view');


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (request.url.includes('public') || request.url.includes('favicon')) {
    deliver(request, response);
  } else if (request.url.includes('bootstrap') || request.url.includes('jquery') || request.url.includes('tokenfield') || request.url.includes('bs-custom-file') || request.url.includes('moment') || request.url.includes('flatpickr')) {
    request.url = 'node_modules/'+request.url;
    deliver(request, response);
  } else if (route === 'login') {
    login(request, response);
  } else if (route === 'logout') {
    logout(request, response);
  } else if (userLoggedIn(request)) {
    let user = userDetails(request);
    if (route.startsWith('data/attachements') || route.startsWith('data/users/pics')) {
      deliver(request, response);
    } else if (route.startsWith('file')) {
      fileController(request, response, user);
    } else if (route.startsWith('user')) {
      userController(request, response);
    } else if (route.startsWith('issue')) {
      issueController(request, response, wss, wsport, user);
    } else if (route.startsWith('communication')) {
      communicationController(request, response, wss, wsport, user);
    } else if (route.startsWith('project')) {
      projectController(request, response, wss, wsport, user);
    } else if (route.startsWith('board') || route.startsWith('kanban')) {
      boardController(request, response, user);
    } else if (route.startsWith('calendar')) {
      calendarController(request, response, wss, wsport, user);
    } else if (route.startsWith('meeting')) {
      meetingController(request, response, wss, wsport, user);
    } else if (route.startsWith('search')) {
      searchController(request, response, wss, wsport, user);
    } else if (route.startsWith('admin') && user.admin) {
      adminController(request, response, wss, wsport, user);
    } else {
      mainController(request, response, wss, wsport, user);
    }
  } else {
    uniSend(loginView(), response);
  }
}


module.exports = router;
