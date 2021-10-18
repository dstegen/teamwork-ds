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
const { getProjectById } = require('./models/model-project');
const projectListView = require('./views/project-list-view');
const editProjectView = require('./views/edit-project-view');
const projectView = require('./views/project-view');


function projectController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let project = getProjectById(Number(route.split('/')[2]));
  let naviObj = getNaviObj(user);
  if (route.startsWith('project/create')) {
    uniSend(view(wsport, naviObj, editProjectView(project)), response);
  } else if (route.startsWith('project/update')) {
    uniSend(view(wsport, naviObj, editProjectView(project)), response);
  } else if (route.startsWith('project/edit')) {
    uniSend(view(wsport, naviObj, editProjectView(project)), response);
  } else if (route.startsWith('project/view')) {
    uniSend(view(wsport, naviObj, projectView(project, user)), response);
  } else {
    uniSend(view(wsport, naviObj, projectListView()), response);
  }
}


module.exports = projectController
