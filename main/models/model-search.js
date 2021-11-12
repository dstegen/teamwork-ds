/*!
 * main/main/models/model-search.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Requird modules
const sani = require('../../utils/sanitizer');
const { getAllProjects } = require('../../project/models/model-project');
const { getAllIssues } = require('../../issue/models/model-issue');
const { getAllEvents } = require('../../calendar/models/model-calendar');
const { getBoard } = require('../../board/models/model-board');
const { getChat, getComments } = require('../../communication/models/model-chat');
const { getUserFullName } = require('../../user/models/model-user');


function search (searchTerm) {
  searchTerm = sani(searchTerm).toUpperCase();
  let result = [];
  result = find(result, getAllProjects(),'name', 'project', '/project/view/', searchTerm);
  result = find(result, getAllProjects(),'description', 'project', '/project/view/', searchTerm);
  result = find(result, getAllIssues(),'name', 'issue', '/issue/view/', searchTerm);
  result = find(result, getAllIssues(),'description', 'issue', '/issue/view/', searchTerm);
  result = find(result, getAllEvents(),'title', 'event', '/calendar/view/', searchTerm);
  result = find(result, getAllEvents(),'description', 'event', '/calendar/view/', searchTerm);
  result = find(result, getBoard('', 1).cards,'title', 'board', '/board/1/', searchTerm);
  result = find(result, getBoard('', 1).cards,'description', 'board', '/board/1/', searchTerm);
  getAllProjects().map(item => { return item.id }).forEach( projectId => {
    result = find(result, getChat(projectId),'chat', 'chat', '/communication', searchTerm);
  });
  getAllIssues().map(item => { return item.id }).forEach( issueId => {
    result = find(result, getComments(issueId),'chat', 'comment', '/issue/view/', searchTerm);
  });
  //console.log(result);
  return result;
}


// Additional functions

function find (result, list, field, type, path, searchTerm) {
  list.forEach( item => {
    if (item[field] && item[field].toUpperCase().includes(searchTerm)) {
      if (field === 'description' & type === 'event') {
        field = 'title';
      } else if (field === 'description') {
        field = 'name';
      }
      let description = item.description ? item.description : '';
      if (type === 'chat' || type === 'comment') description = getUserFullName(item.chaterId);
      let id = item.id ? item.id : '';
      if (type === 'comment') id = item.issueId;
      result.push(
        {
          name: item[field],
          description: description,
          type: type,
          id: id,
          url: path+id
        }
      )
    }
  });
  return result;
}


module.exports = { search };
