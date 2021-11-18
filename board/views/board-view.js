/*!
 * views/board/board-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getBoard } = require('../models/model-board');
const boardColumn = require('./board-column');
const boardColumnForm = require('./board-column-form');


function boardView (group, user) {
  let myBoard = getBoard('', group);
  if (myBoard.topics !== undefined) {
    return `
      <div class="board-bg mb-5">
        <div class="container py-3 px-0">
          <h2 class="d-flex justify-content-between py-2 px-3 border bg-light">
            Free board ${group}
            <span id="clock" class="d-none d-md-block">23:11:40</span>
          </h2>
        </div>
        <div id="board-frame" class="container px-0 pb-3 d-flex board-frame sortable ui-sortable">
          ${myBoard.topics.map( topics => boardColumn(topics, myBoard, group, user)).join('')}
          ${boardColumnForm(group)}
        </div>
      </div>
    `;
  } else {
    return `
      <div class="container p-3">
        <h4>No boards are defined for ${group}</h4>
      </div>
    `;
  }
}


module.exports = boardView;
