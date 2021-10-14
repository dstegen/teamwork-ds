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

function createIssue () {

}

function getAllIssues (user='none', orderedBy='idReverse', filteredBy='none') {
  let allIssues = loadFile(path.join(__dirname, '../../data/issues.json'));
  return allIssues;
}

function getIssue (id) {
  let issue = getAllIssues().filter( item => item.id === id)[0];
  return issue;
}

function editIssue (id) {

}

function deleteIssue (id) {

}


module.exports = { createIssue, getAllIssues, getIssue, editIssue, deleteIssue };
