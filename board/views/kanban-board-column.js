/*!
 * views/board/kanban-board-column.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllIssues } = require('../../issue/models/model-issue');
const sortItemsByDate = require('../../utils/sort-items-by-date');
const kanbanBoardCard = require('./kanban-board-card');


function kanbanBoardColumn (myTopic, myBoard, projectId) {
  let cardsArray = [];
  cardsArray = getAllIssues().filter( item => item.projectId === Number(projectId));
  cardsArray = cardsArray.sort((a,b) => sortItemsByDate(b,a));
  return `
    <div id="topic-${myTopic.id}" class="col sortable ui-sortable sortable-list board-topic">
      <h5 class="card px-3 py-2 bg-light d-flex justify-content-between">
        ${myTopic.topic}
      </h5>
      ${cardsArray.map( card => kanbanBoardCard(card, myTopic.autofillWith)).join('')}
    </div>
  `;
}


module.exports = kanbanBoardColumn;
