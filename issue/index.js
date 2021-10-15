/*!
 * issue/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const loadFile = require('../utils/load-file');
const view = require('../main/views/base-view');
const { createIssue, getAllIssues, getIssue, updateIssue, deleteIssue } = require('./models/model-issue');
const editIssueView = require('./views/edit-issue-view');


function issueController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  //console.log(route);
  let issue = getIssue(Number(route.split('/')[2]));
  let naviObj = getNaviObj(user);
  if (route.startsWith('issue/create')) {
    uniSend(view(wsport, naviObj, editIssueView(createIssue(), user)), response);
  } else if (route.startsWith('issue/update')) {
    //updateIssue
    uniSend(view(wsport, naviObj, editIssueView(issue, user)), response);
  } else {
    uniSend(view(wsport, naviObj, editIssueView(issue, user)), response);
  }
}


module.exports = issueController;
