/*!
 * project/views/edit-project-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const formTextInput = require('../../main/templates/form-textinput');
const formTextArea = require('../../main/templates/form-textarea');
const formSelect = require('../../main/templates/form-select');


function editProjectView (project) {
  return `
    <div id="edit-project-view" class="container py-3">
      <div class="p-3 my-3 border">
        <div class="d-flex justify-content-between">
          <h4 class="m-0">Edit project: <strong>${project.name}</strong> [${project.id}]</h4>
          <a href="/project/${project.name !== '' ? '/view/'+project.id : ''}" class="btn btn-sm btn-secondary">Cancel</a>
        </div>
        <hr />
        <form id="project-form-${project.id}" action="/project/update/${project.id}" method="post">
          <input type="text" name="id" class="d-none" hidden value="${project.id}" />
          <input type="text" name="createDate" class="d-none" hidden value="${project.createDate}" />
          <div class="form-group row mb-1">
            ${helperProjectForm (project)}
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-sm btn-primary mt-3">Update</button>
          </div>
        </form>
      </div>
    </div>
  `;
}


// Additional functions

function helperProjectForm (project) {
  let returnHtml1 = '<div class="col-12 col-lg-6 row no-gutter">';
  let returnHtml2 = '<div class="col-12 col-lg-6 row no-gutter">';
  Object.keys(project).forEach( key => {
    if (!['id'].includes(key)) {
      if (key === 'name') {
        returnHtml1 += formTextInput(project.name, 'name', 'required', '') + '<div class="col-3"></div>';
      } else if (key === 'description') {
        returnHtml2 += formTextArea(project.description, 'description', '', '') + '<div class="col-3"></div>';
      } else if (key === 'state') {
        returnHtml1 += formSelect (['planed','started','ongoing','finished'], project[key], key, '', '', '') + '<div class="col-3"></div>';
      } else if (key === 'dueDate') {
        returnHtml2 += formTextInput(project[key], key, '', '', '', 'date') + '<div class="col-3"></div>';
      } else if (key.includes('Date')) {
        // do nothing
      } else {
        returnHtml2 += formTextInput(project[key], key, '', '') + '<div class="col-3"></div>';
      }
    }
  });
  return '<div class="row">'+returnHtml1+'</div>'+returnHtml2+'</div></div>';
}


module.exports = editProjectView;
