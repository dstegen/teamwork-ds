/*!
 * main/file-controller.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const fileUpload = require('../lib/file-upload');
const fileDelete = require('../lib/file-delete');


function fileController (request, response, user) {
  let route = request.url.substr(1).split('?')[0];
  if (route.startsWith('fileupload')) {
    fileUploadAction(request, response, user);
  } else if (route.startsWith('filedelete')) {
    fileDeleteAction(request, response, user);
  } else {
    uniSend(new SendObj(302), response);
  }
}


// Additional functions

function fileUploadAction (request, response, user) {
  let urlPath = '';
  getFormObj(request).then(
    data => {
      let filePath = '';
      urlPath = data.fields.urlPath;
      if (data.fields.filePath && data.fields.filePath !== '') {
        filePath = path.join(__dirname, '../', data.fields.filePath, data.fields.id+'.jpg');
      }
      if (user.role === 'member') {
        if (fileUpload(data.fields, data.files, filePath)) {
          // TODO: add to issues files list
        }
      }
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t handle file upload: '+error.message);
  });
}

function fileDeleteAction (request, response) {
  let urlPath = '';
  getFormObj(request).then(
    data => {
      urlPath = data.fields.urlPath;
      fileDelete(data.fields);
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t handle file delete: '+error.message);
  });
}


module.exports = fileController;
