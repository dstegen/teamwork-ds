/*!
 * issue/models/model-issue.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const { newDate } = require('../../lib/dateJuggler');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const createDir = require('../../utils/create-dir');
const sani = require('../../utils/sanitizer');
const { addActivity } = require('../../main/models/model-activity');
const issuePills = require('../templates/issue-pills');
const { getUserFullName } = require('../../user/models/model-user');


function createIssue (user, projectId, masterId) {
  let newIssue = loadFile(path.join(__dirname, './blueprint-issue.json'));
  let allIssues = getAllIssues();
  if (allIssues.length > 0) {
    newIssue.id = Math.max(...allIssues.map( item => item.id)) + 1;
  } else {
    newIssue.id = 1;
  }
  newIssue.projectId = projectId;
  newIssue.priority = 'medium';
  newIssue.reporter = user.id;
  newIssue.createDate = newDate();
  newIssue.updateDate = newDate();
  newIssue.type = masterId !== undefined ? 'SubTask' : 'Taks';
  newIssue.masterId = Number(masterId);
  return newIssue;
}

function getAllIssues (projectId=undefined) {
  let allIssues = loadFile(path.join(__dirname, '../../data/issues.json'));
  if (projectId !== undefined && typeof(projectId) === 'number') allIssues = allIssues.filter( item => item.projectId === projectId);
  return allIssues;
}

function getIssue (id) {
  let issue = getAllIssues().filter( item => item.id === id)[0];
  return issue;
}

function updateIssue (fields, user) {
  //console.log(fields);
  let issue = {};
  let tagArray = [];
  let watchersArray = [];
  Object.keys(fields).forEach( key => {
    if (['id','reporter','assignee','projectId'].includes(key)) {
      issue[key] = Number(sani(fields[key]));
    } else if (key === 'tags' || key === 'watchers') {
      // do nothing!
    } else if (key.startsWith('tagsItems')) {
      // For tokenfield
      if (fields[key] != '') tagArray.push(sani(fields[key]));
    } else if (key.startsWith('watchersItems')) {
      // For tokenfield
      if (fields[key] != '') watchersArray.push(sani(fields[key]));
    } else {
      issue[key] = sani(fields[key]);
    }
  });
  // For tokenfield
  if (tagArray.length > 0) {
    issue['tags'] = tagArray.toString();
  }
  if (watchersArray.length > 0) {
    issue['watchers'] = watchersArray.toString();
  }
  let allIssues = getAllIssues();
  if (allIssues.filter( item => item.id === issue.id).length > 0) {
    // update
    if (allIssues.filter( item => item.id === issue.id)[0].assignee !== issue.assignee) {
      addActivity('changed assignee of issue: "'+fields.name+'" to '+getUserFullName(issue.assignee), user.id, 'issue', fields.id);
    } else if (allIssues.filter( item => item.id === issue.id)[0].state !== issue.state) {
      addActivity('changed state of issue: "'+getIssue(Number(issue.id)).name+'" to '+issuePills(issue.state), user.id, 'issue', issue.id);
    } else {
      addActivity('updated issue: "'+fields.name+'"', user.id, 'issue', fields.id);
    }
    Object.keys(issue).forEach( key => {
      if (key !== 'id') {
        allIssues.filter( item => item.id === issue.id)[0][key] = issue[key];
      }
    });
    if (issue.state === 'in progress') allIssues.filter( item => item.id === issue.id)[0]['startDate'] = newDate();
    allIssues.filter( item => item.id === issue.id)[0]['updateDate'] = newDate();
  } else {
    //add
    allIssues.push(issue);
    addActivity('added issue: "'+fields.name+'"', user.id, 'issue', fields.id);
  }
  // create issue subfolder, if not exists
  if (!fs.existsSync(path.join(__dirname, '../../data/issues', (issue.id).toString()))) {
    createDir(path.join(__dirname, '../../data/issues', (issue.id).toString()));
    // save empty comments file
    saveFile(path.join(__dirname, '../../data/issues', (issue.id).toString()), 'comments.json', []);
  }
  // create empty attachements subfolder,if not exists
  if (!fs.existsSync(path.join(__dirname, '../../data/attachements', (issue.id).toString()))) {
    createDir(path.join(__dirname, '../../data/attachements', (issue.id).toString()));
  }
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
  console.log('+ Issue "'+issue.name+'" updated successfully!');
}

function changeIssueState (issueId, state, user) {
  let allIssues = getAllIssues();
  if (state === 'start') {
    state = 'in progress';
    allIssues.filter( item => item.id === issueId)[0].assignee = user.id;
    allIssues.filter( item => item.id === issueId)[0].startDate = newDate();
  }
  if (state === 'closed') {
    allIssues.filter( item => item.id === issueId)[0].closeDate = newDate();
  }
  allIssues.filter( item => item.id === issueId)[0].state = state;
  allIssues.filter( item => item.id === issueId)[0].updateDate = newDate();
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
  addActivity('changed state of issue: "'+getIssue(Number(issueId)).name+'" to '+issuePills(state), user.id, 'issue', issueId);
  console.log('+ Issue "'+issueId+'" state successfully updated to "'+state+'"');
}

function deleteIssue (id) {
  let allIssues = getAllIssues().filter( item => item.id !== id);
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
}

function updateChecklist (fields, user) {
  //console.log(fields);
  let allIssues = getAllIssues();
  let curIssue = allIssues.filter(item => item.id === (Number(fields.id)))[0];
  if (!curIssue.checklist) {
    curIssue.checklist = {
      listId: curIssue.id,
      items: []
    }
  }
  if (curIssue.checklist.items.filter(item => item.itemId === Number(fields.itemId)).length > 0) {
    // update
    let curItem = curIssue.checklist.items.filter(item => item.itemId === Number(fields.itemId))[0];
    if (fields.item) curItem.item = sani(fields.item);
    if (fields.done === 'true') {
      curItem.done = true;
    } else {
      curItem.done = false;
    }
  } else {
    // add item
    curIssue.checklist.items.push(
      {
        item: sani(fields.item),
        itemId: curIssue.checklist.items.length > 0 ? Math.max(...curIssue.checklist.items.map( item => item.itemId)) + 1 : 1001,
        done: false
      }
    );
  }
  curIssue.updateDate = newDate();
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
  addActivity('updated issue checklist: "'+getIssue(Number(curIssue.id)).name+'"', user.id, 'issue', curIssue.id);
  console.log('+ Issue "'+curIssue.name+'" checklist updated');
}

function deleteChecklistItem (fields) {
  //console.log(fields);
  let allIssues = getAllIssues();
  let curIssue = allIssues.filter(item => item.id === (Number(fields.id)))[0];
  curIssue.checklist.items = curIssue.checklist.items.filter(item => item.itemId !== Number(fields.itemId));
  curIssue.updateDate = newDate();
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
}


module.exports = { createIssue, getAllIssues, getIssue, updateIssue, deleteIssue, changeIssueState, updateChecklist, deleteChecklistItem };
