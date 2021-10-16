/*!
 * issue/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const { createIssue, getIssue, updateIssue } = require('./models/model-issue');
const editIssueView = require('./views/edit-issue-view');
const issueListView = require('./views/issue-list-view');
const issueView = require('./views/issue-view');
const communicationController = require('../communication');


function issueController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  //console.log(route);
  let issue = getIssue(Number(route.split('/')[2]));
  let naviObj = getNaviObj(user);
  if (route.startsWith('issue/create')) {
    uniSend(view(wsport, naviObj, editIssueView(createIssue(user), user)), response);
  } else if (route.startsWith('issue/update')) {
    //add/updateIssue
    getFormObj(request).then(
      data => {
        updateIssue(data.fields);
        uniSend(new SendObj(302, [], '', '/issue/edit/'+data.fields.id), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('issue/edit')) {
    uniSend(view(wsport, naviObj, editIssueView(issue, user)), response);
  } else if (route.startsWith('issue/view')) {
    uniSend(view(wsport, naviObj, issueView(issue, user)), response);
  } else if (route.startsWith('issue/comment')) {
    communicationController (request, response, wss, wsport, user);
  } else {
    uniSend(view(wsport, naviObj, issueListView(user)), response);
  }
}


module.exports = issueController;
