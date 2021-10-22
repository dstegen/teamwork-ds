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


function createIssue (user, projectId) {
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
  return newIssue;
}

function getAllIssues () {
  let allIssues = loadFile(path.join(__dirname, '../../data/issues.json'));
  return allIssues;
}

function getIssue (id) {
  let issue = getAllIssues().filter( item => item.id === id)[0];
  return issue;
}

function updateIssue (fields) {
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
    Object.keys(issue).forEach( key => {
      if (key !== 'id') {
        allIssues.filter( item => item.id === issue.id)[0][key] = issue[key];
      }
    });
    allIssues.filter( item => item.id === issue.id)[0]['updateDate'] = newDate();
  } else {
    //add
    allIssues.push(issue);
  }
  // create issue subfolder, if not exists
  if (!fs.existsSync(path.join(__dirname, '../../data/issues', (issue.id).toString()))) {
    createDir(path.join(__dirname, '../../data/issues', (issue.id).toString()));
    // save empty comments file
    saveFile(path.join(__dirname, '../../data/issues', (issue.id).toString()), 'comments.json', []);
  }
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
  console.log('+ Issue "'+issue.name+'" updated successfully!');
}

function changeIssueState (issueId, state, user) {
  let allIssues = getAllIssues();
  if (state === 'start') {
    state = 'in progress';
    allIssues.filter( item => item.id === issueId)[0].assignee = user.id;
  }
  if (state === 'closed') {
    allIssues.filter( item => item.id === issueId)[0].closeDate = newDate();
  }
  allIssues.filter( item => item.id === issueId)[0].state = state;
  allIssues.filter( item => item.id === issueId)[0].updateDate = newDate();
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
  console.log('+ Issue "'+issueId+'" state successfully updated to "'+state+'"');
}

function deleteIssue (id) {
  let allIssues = getAllIssues().filter( item => item.id !== id);
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
}


module.exports = { createIssue, getAllIssues, getIssue, updateIssue, deleteIssue, changeIssueState };
