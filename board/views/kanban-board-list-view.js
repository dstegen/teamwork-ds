/*!
 * views/board/kanban-board-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const kanbanBoardView = require('./kanban-board-view');
const { getAllProjects } = require('../../project/models/model-project');


function kanbanBoardListView (user) {
  let allProjectIds = getAllProjects().map( item => { return item.id});
  let returnHtml = `<div class="board-bg py-3">
                      <div class="container">
                        <h2 class="d-flex justify-content-between py-2 px-3 my-3 border" style="background-color: white;">
                          Kanban Boards
                          <span id="clock" class="d-none d-md-block">23:22:14</span>
                        </h2>
                      </div>
  `;
  allProjectIds.forEach( projectId => {
    returnHtml += kanbanBoardView(projectId.toString(), user);
  });
  returnHtml += '</div>'
  return returnHtml;
}


module.exports = kanbanBoardListView;
