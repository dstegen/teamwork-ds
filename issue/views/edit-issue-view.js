/*!
 * issue/views/edit-issue-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllUsers } = require('../../user/models/model-user');
const { getAllProjects } = require('../../project/models/model-project');
const formTextInput = require('../../main/templates/form-textinput');
const formTextArea = require('../../main/templates/form-textarea');
const formSelect = require('../../main/templates/form-select');


function editIssueView (issue) {
  let allUserObj = getAllUsers().map( item => { return {id: item.id, name: item.fname+' '+item.lname}; });
  return `
    <div id="edit-issue-view" class="container py-3">
      <div class="p-3 my-3 border">
        <div class="d-flex justify-content-between">
          <h4 class="m-0">Edit issue: <strong>${issue.name}</strong> [${issue.id}]</h4>
          <a href="/issue/view/${issue.id}" class="btn btn-sm btn-secondary">Cancel</a>
        </div>
        <hr />
        <form id="issue-form-${issue.id}" action="/issue/update/${issue.id}" method="post">
          <input type="text" name="id" class="d-none" hidden value="${issue.id}" />
          <input type="text" name="createDate" class="d-none" hidden value="${issue.createDate}" />
          <input type="text" name="updateDate" class="d-none" hidden value="${issue.updateDate}" />
          <div class="form-group row mb-1">
            ${helperIssueForm (issue)}
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-sm btn-primary mt-3">Update</button>
          </div>
        </form>
      </div>
      <script>
        var watchersArray = ${JSON.stringify(allUserObj)};
      </script>
    </div>
  `;
}


// Additional functions

function helperIssueForm (issue) {
  let returnHtml1 = '<div class="col-12 col-lg-6 row no-gutter">';
  let returnHtml2 = '<div class="col-12 col-lg-6 row no-gutter">';
  let allUserList = getAllUsers().map( item => { return [item.id, item.fname+' '+item.lname]; });
  allUserList.unshift([0,'']);
  let allProjectsList = getAllProjects().map( item => { return [item.id, item.name]; });
  Object.keys(issue).forEach( key => {
    if (!['id'].includes(key)) {
      if (key === 'projectId') {
        returnHtml1 += formSelect(allProjectsList, issue.projectId, 'projectId', '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'name') {
        returnHtml1 += formTextInput(issue.name, 'name', 'required', '') + '<div class="col-3"></div>';
      } else if (key === 'description') {
        returnHtml2 += formTextArea(issue.description, 'description', '', '') + '<div class="col-3"></div>';
      } else if (key === 'state') {
        returnHtml1 += formSelect (['backlog','open','in progress','resolved','closed'], issue[key], key, '', '', '') + '<div class="col-3"></div>';
      } else if (key === 'type') {
        returnHtml1 += formSelect (['Task','SubTask','Bug','Request'], issue[key], key, '', '', '') + '<div class="col-3"></div>';
      } else if (key === 'priority') {
        returnHtml1 += formSelect (['blocker','critical','high','medium','low'], issue[key], key, '', '', '') + '<div class="col-3"></div>';
      } else if (key === 'reporter' || key === 'assignee') {
        returnHtml2 += formSelect (allUserList, issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'dueDate') {
        returnHtml2 += formTextInput(issue[key], key, '', '', '', 'date') + '<div class="col-3"></div>';
      } else if (key.includes('Date')) {
        // do nothing
      } else if (key === 'tags') {
        returnHtml1 += formTextInput(issue[key], key, '', '') + '<div class="col-3"></div>';
      } else {
        returnHtml2 += formTextInput(issue[key], key, '', '') + '<div class="col-3"></div>';
      }
    }
  });
  return '<div class="row">'+returnHtml1+'</div>'+returnHtml2+'</div></div>';
}


module.exports = editIssueView;
