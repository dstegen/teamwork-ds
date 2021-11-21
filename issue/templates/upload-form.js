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
  if (fs.existsSync(path.join(__dirname, '../../data/attachements', issue.id.toString()))) {
    attachements = fs.readdirSync(path.join(__dirname, '../../data/attachements', issue.id.toString()));
  }
  return `
    ${attachements ? filesList(attachements, '/issue/view/'+issue.id, issue.id, '', true) : ''}
    <form class="row g-0" action="/fileupload" method="post" enctype="multipart/form-data">
      <input type="text" readonly class="d-none" id="course" name="id" value="${issue.id}">
      <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="${issue.id ? '/issue/view/'+issue.id+'/'+issue.id : '/issue'}">
      <div class="col-sm-10">
        <input type="file" class="form-control form-control-sm" id="filetoupload-${issue.id}" name="filetoupload">
        <div class="invalid-feedback">${locale.placeholder.invalid_feedback[config.lang]}</div>
      </div>
      <div class="col-sm-2 mt-2 mt-sm-0 d-flex justify-content-end">
        <button type="submit" class="btn btn-sm btn-primary">${locale.buttons.upload[config.lang]}</button>
      </div>
    </form>
  `;
}



module.exports = uploadForm;
