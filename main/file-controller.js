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
//const { updateLesson, finishLesson, deleteFileFromLesson, deleteFileFromLessonFinished } = require('../lesson/models/model-lessons');
//const { deleteFileFromCard } = require('../board/models/model-board');
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
      if (user.role === 'student') {
        filePath = path.join('courses', data.fields.course, data.fields.courseId, 'homework', user.id.toString());
        if (fileUpload(data.fields, data.files, filePath)) {
          let addFields = {
            group: data.fields.group,
            courseId: data.fields.courseId,
            studentId: user.id,
            file: path.join('/data/classes', data.fields.group, filePath, data.files.filetoupload.name)
          }
          finishLesson(addFields);
        }
      } else if (user.role === 'teacher') {
        filePath = path.join('courses', data.fields.course, data.fields.courseId, 'material');
        if (fileUpload(data.fields, data.files, filePath)) {
          let addFields = {
            group: data.fields.group,
            id: data.fields.courseId,
            files: path.join('/data/classes', data.fields.group, filePath, data.files.filetoupload.name)
          }
          updateLesson(addFields);
        }
      }
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t handle file upload: '+error.message);
  });
}

function fileDeleteAction (request, response, user) {
  let urlPath = '';
  getFormObj(request).then(
    data => {
      urlPath = data.fields.urlPath;
      if (fileDelete(data.fields)) {
        if (data.fields.section === 'cards' && user.role === 'teacher') {
          //deleteFileFromCard(data.fields);
        } else if (data.fields.studentId && data.fields.studentId !== '') {
          deleteFileFromLessonFinished(data.fields.group, Number(data.fields.lessonId), Number(data.fields.studentId), data.fields.filePath);
        } else if (user.role === 'teacher') {
          deleteFileFromLesson(data.fields.group, Number(data.fields.lessonId), data.fields.filePath);
        }
      }
      uniSend(new SendObj(302, [], '', urlPath), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t handle file delete: '+error.message);
  });
}


module.exports = fileController;
