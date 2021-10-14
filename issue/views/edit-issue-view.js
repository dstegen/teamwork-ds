/*!
 * issue/views/edit-issue-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { getAllUsers, getUserById } = require('../../user/models/model-user');
const formTextInput = require('../../main/templates/form-textinput');
const formTextArea = require('../../main/templates/form-textarea');
const formSelect = require('../../main/templates/form-select');


function editIssueView (issue, user) {
  return `
    <div id="dashboard" class="container">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Edit issue: ${issue.name} [${issue.id}]
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="py-2 px-3 my-3 border">
        <form id="issue-form-${issue.id}" action="/issue/${issue.id}" method="post">
          <input type="text" name="issueId" class="d-none" hidden value="${issue.id}" />
          <input type="text" name="userId" class="d-none" hidden value="${user.id}" />
          <div class="form-group row mb-1">
            ${helperIssueForm (issue)}
          </div>
          <div class="d-flex justify-content-center">
            <button type="submit" class="btn btn-sm btn-primary mt-3">${locale.buttons.send[config.lang]}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}


// Additional functions

function helperIssueForm (issue) {
  let returnHtml = '';
  let allUserList = getAllUsers().map( item => { return [item.id, item.fname+' '+item.lname]; });
  Object.keys(issue).forEach((key, i) => {
    if (key !== 'id') {
      if (key === 'description') {
        returnHtml += formTextArea(issue[key], key, 'required', '') + '<div class="col-3"></div>';
      } else if (key === 'status') {
        returnHtml += formSelect (['backlog','open','in progress','resolved','closed'], issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'type') {
        returnHtml += formSelect (['Task','SubTask','Bug','Request'], issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'reporter' || key === 'assignee') {
        returnHtml += formSelect (allUserList, issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'projectId' && issue[key] !== '') {
        returnHtml += formTextInput(issue[key], key, 'required', '', 'disabled') + '<div class="col-3"></div>';
      } else if (key === 'watchers') {
        let watchersList = [];
          issue[key].forEach( item => {
            watchersList.push(getUserById(item).fname + ' ' + getUserById(item).lname);
          });
        returnHtml += formTextInput(watchersList, key, 'required', '') + '<div class="col-3"></div>';
      } else if (key.includes('Date')) {
        returnHtml += formTextInput(issue[key], key, 'required', '', 'disabled') + '<div class="col-3"></div>';
      } else {
        returnHtml += formTextInput(issue[key], key, 'required', '') + '<div class="col-3"></div>';
      }
    }
  });
  return returnHtml;
}


module.exports = editIssueView;
