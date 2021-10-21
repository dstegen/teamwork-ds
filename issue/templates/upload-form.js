/*!
 * issue/templates/upload-form.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const filesList = require('../../main/templates/files-list');

function uploadForm (issue) {
  let attachements = undefined;
  if (fs.existsSync(path.join(__dirname, '../../data/issues', issue.id.toString(), 'attachements'))) {
    attachements = fs.readdirSync(path.join(__dirname, '../../data/issues', issue.id.toString(), 'attachements'));
  }
  return `
  <div class="row">
    <div class="col-12 col-lg-6">
      ${attachements ? filesList(attachements, '/issue/view/'+issue.id, issue.id, '', true) : ''}
    </div>
    <div class="col-12 col-lg-6">
      <form class="row mx-0 align-item-center" action="/fileupload" method="post" enctype="multipart/form-data">
        <input type="text" readonly class="d-none" id="course" name="id" value="${issue.id}">
        <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="${issue.id ? '/issue/view/'+issue.id+'/'+issue.id : '/issue'}">
        <div class="col-sm-10">
          <input type="file" class="form-control form-control-sm" id="filetoupload-${issue.id}" name="filetoupload">
          <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
        </div>
        <div class="col-sm-2 mt-2 mt-sm-0">
          <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.upload[config.lang]}</button>
        </div>
      </form>
    </div>
  </div>
  `;
}



module.exports = uploadForm;
