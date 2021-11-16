/*!
 * docs/models/model-docs.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');


function getDocs () {
  let docs = loadFile(path.join(__dirname, '../../data/docs.json'));
  return docs;
}

function getDocsObj (id) {
  let returnObj = {
    id: id,
    content: loadFile(path.join(__dirname, '../../data/docs', id+'.html'), false, true),
    timeStamp: new Date()
  }
  return returnObj;
}

function updateDoc (fields, user) {
  saveFile(path.join(__dirname, '../../data/docs'), fields.id+'.html', fields.content, true)
  // TODO: addActivitiy(user)
}


module.exports = { getDocsObj, updateDoc, getDocs };
