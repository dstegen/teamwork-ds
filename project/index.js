/*!
 * project/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const projectListView = require('./views/project-list-view');

function projectController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('project/create')) {
    uniSend(view(wsport, naviObj, projectListView()), response);
  } else {
    uniSend(view(wsport, naviObj, projectListView()), response);
  }
}


module.exports = projectController
