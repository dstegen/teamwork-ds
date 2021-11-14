/*!
 * todolist/views/todolist-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const checklist = require('../templates/checklist');


function todolistView (tdListObj) {
  return `
    <div id="todolist-view" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        My todo lists
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row border p-3 g-0">
        ${tdListObj.lists.map(listViewWrapper).join('')}
        ${addListForm()}
      </div>
    </div>
  `;
}


// Additional functions

function listViewWrapper (list) {
  return `
    <div class="col-12 col-lg-6 col-xl-4 mb-5">
      ${checklist(list)}
    </div>
  `;
}

function addListForm () {
  return `
  <div class="col-12 col-lg-6 col-xl-4">
    <form action="/todolist/add" method="post" class="d-flex justify-conten-between">
      <input type="text" class="form-control ms-3" name="name" value="" placeholder="New list" style="border: none; border-bottom: 1px solid gray; border-radius: 0;" />
      <button type="submit" class="btn btn-sm btn-primary ms-3"> + </button>
    </form>
  </div>
  `;
}


module.exports = todolistView;
