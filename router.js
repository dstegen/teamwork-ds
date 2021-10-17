/*!
 * router.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { deliver, uniSend } = require('webapputils-ds');
const { login, logout, userLoggedIn, userDetails, setPasswordAction, updatePasswordAction } = require('./user');
const mainController = require('./main');
const issueController = require('./issue');
const communicationController = require('./communication');
const fileController = require('./main/file-controller');
const loginView = require('./user/views/login-view');


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (route.startsWith('data') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) {
   deliver(request, response);
  } else if (route === 'login') {
    login(request, response);
  } else if (route === 'logout') {
    logout(request, response);
  } else if (userLoggedIn(request)) {
    let user = userDetails(request);
    if (route.startsWith('file')) {
      fileController(request, response, user);
    } else if (route === 'setpassword') {
      setPasswordAction(request, response);
    } else if (route === 'updatepassword') {
      updatePasswordAction(request, response);
    } else if (route.startsWith('issue')) {
      issueController(request, response, wss, wsport, user);
    } else if (route.startsWith('communication')) {
      communicationController(request, response, wss, wsport, user);
    } else {
      mainController(request, response, wss, wsport, user);
    }
  } else {
    uniSend(loginView(), response);
  }
}


module.exports = router;
