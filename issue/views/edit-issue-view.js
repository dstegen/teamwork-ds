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
    <div id="edit-issue-view" class="container">
      <div class="p-3 my-3 border">
        <div class="d-flex justify-content-between">
          <h4 class="m-0">Edit issue: <strong>${issue.name}</strong> [${issue.id}]</h4>
          <a href="/issue/view/${issue.id}" class="btn btn-sm btn-secondary">Cancel</a>
        </div>
        <hr />
        <form id="issue-form-${issue.id}" action="/issue/update/${issue.id}" method="post">
          <input type="text" name="id" class="d-none" hidden value="${issue.id}" />
          <input type="text" name="createDate" class="d-none" hidden value="${issue.createDate}" />
          <input type="text" name="updatedDate" class="d-none" hidden value="${issue.updatedDate}" />
          <div class="form-group row mb-1">
            ${helperIssueForm (issue)}
          </div>
          <div class="d-flex justify-content-center">
            <button type="submit" class="btn btn-sm btn-primary mt-3">Create/Update</button>
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
  let returnHtml = '';
  let allUserList = getAllUsers().map( item => { return [item.id, item.fname+' '+item.lname]; });
  allUserList.unshift([0,'']);
  let allProjectsList = getAllProjects().map( item => { return [item.id, item.name]; });
  Object.keys(issue).forEach( key => {
    if (key !== 'id') {
      if (key === 'description') {
        returnHtml += formTextArea(issue[key], key, '', '') + '<div class="col-3"></div>';
      } else if (key === 'state') {
        returnHtml += formSelect (['backlog','open','in progress','resolved','closed'], issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'type') {
        returnHtml += formSelect (['Task','SubTask','Bug','Request'], issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'priority') {
        returnHtml += formSelect (['blocker','high','medium','low'], issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'reporter' || key === 'assignee') {
        returnHtml += formSelect (allUserList, issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'projectId' && issue[key] !== '') {
        returnHtml += formSelect (allProjectsList, issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
        //returnHtml += formTextInput(issue[key], key, 'required', '', 'disabled') + '<div class="col-3"></div>';
      } else if (key === 'dueDate') {
        returnHtml += formTextInput(issue[key], key, 'required', '', '', 'date') + '<div class="col-3"></div>';
      } else if (key.includes('Date')) {
        // do nothing
      } else {
        returnHtml += formTextInput(issue[key], key, 'required', '') + '<div class="col-3"></div>';
      }
    }
  });
  return returnHtml;
}


module.exports = editIssueView;
