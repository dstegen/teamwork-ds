/*!
 * board/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateTopic, updateCard, deleteFromBoard, updateOrder } = require('./models/model-board');
const getNaviObj = require('../lib/getNaviObj');
const kanbanBoardView = require('./views/kanban-board-view');
const kanbanBoardListView = require('./views/kanban-board-list-view');
const boardView = require('./views/board-view');
const view = require('../main/views/base-view');


function boardController (request, response, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('board') && (route.includes('update') || route.includes('delete') || route.includes('reorder'))) {
    updateBoard(request, response);
  } else if (route.startsWith('board')) {
    let myGroup = route.split('/')[1];
    if (myGroup === undefined) myGroup = 1;
    uniSend(view('', naviObj, boardView(myGroup, user)), response);
  } else if (route.startsWith('kanban')) {
    let projectId = route.split('/')[1];
    if (projectId === undefined) {
      uniSend(view('', naviObj, kanbanBoardListView(user)), response);
    } else {
      uniSend(view('', naviObj, kanbanBoardView(projectId, user, true)), response);
    }
  }
}


// Additional functions

function updateBoard (request, response) {
  getFormObj(request).then(
    data => {
      if (request.url.includes('delete')) {
        deleteFromBoard(data.fields);
      } else if (request.url.includes('reorder')) {
        updateOrder(data.fields);
      } else if (data.fields.section === 'topics') {
        updateTopic(data.fields);
      } else if (data.fields.section === 'cards') {
        updateCard(data.fields, data.files);
      }
      uniSend(new SendObj(302, [], '', '/board/'+request.url.substr(1).split('?')[0].split('/')[1]), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update board: '+error.message);
  });
}


module.exports = boardController;
