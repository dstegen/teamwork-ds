/*!
 * issue/models/model-issue.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');


function createIssue () {
  let newIssue = loadFile(path.join(__dirname, './blueprint-issue.json'));
  let allIssues = getAllIssues();
  if (allIssues.length > 0) {
    newIssue.id = Math.max(...allIssues.map( item => item.id)) + 1;
  } else {
    newIssue.id = 1;
  }
  newIssue.priority = 'medium';
  newIssue.createDate = new Date();
  newIssue.lastEditDate = new Date();
  return newIssue;
}

function getAllIssues (user='none', orderedBy='idReverse', filteredBy='none') {
  let allIssues = loadFile(path.join(__dirname, '../../data/issues.json'));
  return allIssues;
}

function getIssue (id) {
  let issue = getAllIssues().filter( item => item.id === id)[0];
  return issue;
}

function updateIssue (issue) {
  let allIssues = getAllIssues();
  if (allIssues.filter().length > 0) {
    // update
  } else {
    //add
    allIssues.push(issue);
  }
  saveFile(path.join(__dirname, '../../data'), 'issues.json', allIssues);
}

function deleteIssue (id) {

}


module.exports = { createIssue, getAllIssues, getIssue, updateIssue, deleteIssue };
