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
const { createIssue, getIssue, updateIssue, changeIssueState, updateChecklist, deleteChecklistItem } = require('./models/model-issue');
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
    let queryObj = {};
    let projectId = undefined;
    let masterId = undefined;
    if (request.url.includes('?')) {
      let query = request.url.substr(1).split('?')[1].split('&');
      for (let i=0; i<query.length; i++) {
        queryObj[query[i].split('=')[0]] = query[i].split('=')[1]
      }
      if (request.url.substr(1).split('?')[1].includes('masterId')) {
        masterId = Number(queryObj.masterId);
      }
      if (request.url.substr(1).split('?')[1].includes('projectId')) {
        projectId = Number(queryObj.projectId);
      }
    }
    uniSend(view(wsport, naviObj, editIssueView(createIssue(user, projectId, masterId))), response);
  } else if (route.startsWith('issue/update')) {
    //add/updateIssue
    getFormObj(request).then(
      data => {
        updateIssue(data.fields, user);
        uniSend(new SendObj(302, [], '', '/issue/view/'+data.fields.id), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update/add: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('issue/edit')) {
    uniSend(view(wsport, naviObj, editIssueView(issue, user)), response);
  } else if (route.startsWith('issue/view')) {
    uniSend(view(wsport, naviObj, issueView(issue, user, wsport)), response);
  } else if (route.startsWith('issue/comment')) {
    communicationController (request, response, wss, wsport, user);
  } else if (route.startsWith('issue/checklist')) {
    console.log(route);
    getFormObj(request).then(
      data => {
        data.fields.id = route.split('/')[2];
        if (route.includes('delete')) {
          deleteChecklistItem(data.fields);
        } else {
          updateChecklist(data.fields, user);
        }
        uniSend(new SendObj(302, [], '', '/issue/view/'+data.fields.id), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update checklist: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (['backlog','open','start','resolved','closed'].includes(route.split('/')[1])) {
    let state = route.split('/')[1];
    let issueId = Number(route.split('/')[2]);
    changeIssueState(issueId, state, user);
    uniSend(new SendObj(302, [], '', '/issue/view/'+issueId), response);
  } else {
    uniSend(view(wsport, naviObj, issueListView(user)), response);
  }
}


module.exports = issueController;
