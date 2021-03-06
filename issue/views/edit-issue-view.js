/*!
 * issue/views/edit-issue-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllUsers } = require('../../user/models/model-user');
const { getAllIssues } = require('../models/model-issue');
const { getAllProjects, getProjectById } = require('../../project/models/model-project');
const formTextInput = require('../../main/templates/form-textinput');
const formTextArea = require('../../main/templates/form-textarea');
const formSelect = require('../../main/templates/form-select');
const config = require('../../main/models/model-config').getConfig();
const blueprintIssue = require('../models/blueprint-issue');


function editIssueView (issue) {
  let allUserObj = getAllUsers().map( item => { return {id: item.id, name: item.fname+' '+item.lname}; });
  if (!issue.masterId) issue.masterId = '';
  let headline = 'Add issue';
  if (issue.type === 'SubTask' && issue.name === '') {
    headline = 'Add subtaks';
  } else if (issue.type === 'SubTask' && issue.name !== '') {
    headline = 'Edit subtask'
  } else if (issue.type !== 'SubTask' && issue.name !== '') {
    headline = 'Edit issue';
  }
  return `
    <div id="edit-issue-view" class="container py-3">
      <div class="p-3 my-3 border">
        <div class="d-flex justify-content-between">
          <h4 class="m-0">${headline}: <strong>${issue.name}</strong> [${issue.id}]</h4>
          <a href="/issue${issue.name !== '' ? '/view/'+issue.id : ''}" class="btn btn-sm btn-secondary">Cancel</a>
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
        document.getElementById("masterId-field").style.display = "none";
        function chooseMasterId (type) {
          //console.log(type);
          if (type === 'SubTask') {
            document.getElementById('masterId-field').style.display = 'block';
            document.getElementById('masterId-field').attributes.removeNamedItem('disabled');
          } else {
            document.getElementById('masterId-field').setAttribute('disabled','disabled')
            document.getElementById('masterId-field').style.display = 'none';
          }
        }
        if (document.getElementById("type-field").value === 'SubTask') chooseMasterId('SubTask');
        myTags = ${JSON.stringify(config.tags)}
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
  Object.keys(blueprintIssue).forEach( key => {
    if (!['id','checklist'].includes(key)) {
      if (key === 'projectId') {
        if (issue.projectId > -1) {
          returnHtml1 += `
            <input type="text" class="d-none" id="projectId-field" name="projectId" value="${issue.projectId}" hidden />
            <div class="col-sm-2 text-right text-truncate mb-2 small">Project</div>
            <div class="col-sm-7">${getProjectById(issue.projectId).name}</div>
            <div class="col-3"></div>
          `;
        } else {
          returnHtml1 += formSelect(allProjectsList, issue.projectId, 'projectId', '', '', 'required') + '<div class="col-3"></div>';
        }
      } else if (key === 'name') {
        returnHtml1 += formTextInput(issue.name, 'name', 'required', '') + '<div class="col-3"></div>';
      } else if (key === 'description') {
        returnHtml2 += formTextArea(issue.description, 'description', '', '') + '<div class="col-3"></div>';
      } else if (key === 'state') {
        returnHtml1 += formSelect (['backlog','open','in progress','resolved','closed'], issue[key], key, '', '', '') + '<div class="col-3"></div>';
      } else if (key === 'type') {
        if (issue.type === 'SubTask') {
          returnHtml1 += formTextInput(issue.type, 'type', 'readonly', '') + '<div class="col-3"></div>';
        } else {
          returnHtml1 += formSelect (['Task','SubTask','Bug','Request'], issue[key], key, '', 'onchange="chooseMasterId(this.value)"', 'required') + '<div class="col-3"></div>';
        }
      } else if (key === 'masterId') {
        let masterIdDisplay = 'disabled';
        if (issue.type === 'SubTask') masterIdDisplay = 'required';
        let myOptions = getAllIssues().map(item => {return [item.id, item.name+' ['+getProjectById(item.projectId).name+']']});
        if (issue.projectId > -1) myOptions = getAllIssues().filter(item => item.projectId === Number(issue.projectId)).map(item => {return [item.id, item.name+' ['+getProjectById(item.projectId).name+']']});
        returnHtml1 += formSelect (myOptions, Number(issue[key]), key, '', '', masterIdDisplay) + '<div class="col-3"></div>';
      } else if (key === 'priority') {
        returnHtml1 += formSelect (['blocker','critical','high','medium','low'], issue[key], key, '', '', '') + '<div class="col-3"></div>';
      } else if (key === 'reporter' || key === 'assignee') {
        returnHtml2 += formSelect (allUserList, issue[key], key, '', '', 'required') + '<div class="col-3"></div>';
      } else if (key === 'dueDate') {
        returnHtml2 += formTextInput(issue[key], key, '', '', '', 'text') + '<div class="col-3"></div>';
      } else if (key.includes('Date')) {
        // do nothing
      } else if (key === 'tags') {
        let value = '';
        if (issue[key] && issue[key] !== undefined) value = issue[key];
        returnHtml1 += formTextInput(value, key, '', '') + '<div class="col-3"></div>';
      } else {
        returnHtml2 += formTextInput(issue[key], key, '', '') + '<div class="col-3"></div>';
      }
    }
  });
  return '<div class="row">'+returnHtml1+'</div>'+returnHtml2+'</div></div>';
}


module.exports = editIssueView;
