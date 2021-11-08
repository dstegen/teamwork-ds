/*!
 * project/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { newDate } = require('../lib/dateJuggler');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const { getProjectById, getAllProjects, updateProject } = require('./models/model-project');
const projectListView = require('./views/project-list-view');
const editProjectView = require('./views/edit-project-view');
const projectView = require('./views/project-view');
const loadFile = require('../utils/load-file');


function projectController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let project = getProjectById(Number(route.split('/')[2]));
  let naviObj = getNaviObj(user);
  if (route.startsWith('project/create')) {
    let newProject = loadFile(path.join(__dirname, '../project/models/blueprint-project.json'));
    newProject.id = Math.max(...getAllProjects().map( item => item.id)) + 1;
    newProject.createDate = newDate();
    uniSend(view(wsport, naviObj, editProjectView(newProject)), response);
  } else if (route.startsWith('project/update')) {
    //add/updateIssue
    getFormObj(request).then(
      data => {
        updateProject(data.fields);
        uniSend(new SendObj(302, [], '', '/project/view/'+data.fields.id), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('project/edit')) {
    uniSend(view(wsport, naviObj, editProjectView(project)), response);
  } else if (route.startsWith('project/view')) {
    uniSend(view(wsport, naviObj, projectView(project, user, wsport)), response);
  } else {
    uniSend(view(wsport, naviObj, projectListView()), response);
  }
}


module.exports = projectController
