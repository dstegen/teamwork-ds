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
const { getProjectById } = require('../../project/models/model-project');


function boardView (group, user, single=false) {
  let myBoard = getBoard(group);
  let project = getProjectById(Number(group));
  if (myBoard.topics !== undefined) {
    return `
      <div ${single ? 'class="board-bg"' : ''}>
        <div class="container ${single ? 'py-3' : ''} d-flex justify-content-between">
          <div class="d-flex justify-content-between py-2 px-3 my-3 border w-100 bg-light project-board-headline">
            <h2 class="m-0"><a href="/project/view/${group}">${project.name}</a></h2>
            <button class="btn btn-outline-primary" type="button" data-bs-toggle="collapse" data-bs-target="#board-collapse-${group}" aria-expanded="${single ? 'true' : 'false'}" aria-controls="board-collapse-${group}">&#9661;</button>
          </div>
        </div>
        <div id="board-collapse-${group}" ${single ? '' : 'class="collapse"'}>
          <div id="board-frame" class="container pb-3 d-flex board-frame">
            <div class="row row-cols-1 row-cols-md-2  row-cols-lg-3 row-cols-xl-5 g-3">
              ${myBoard.topics.map( topics => boardColumn(topics, myBoard, group, user)).join('')}
            </div>
            ${user.role === 'member2' ? boardColumnForm(group) : ''}
          </div>
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
