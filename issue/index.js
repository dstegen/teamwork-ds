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


function issueController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  //console.log(route);
  let issue = getIssue(Number(route.split('/')[2]));
  let naviObj = getNaviObj(user);
  if (route.startsWith('issue/create')) {
    uniSend(view(wsport, naviObj, editIssueView(createIssue(), user)), response);
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
  } else {
    uniSend(view(wsport, naviObj, editIssueView(issue, user)), response);
  }
}


module.exports = issueController;
