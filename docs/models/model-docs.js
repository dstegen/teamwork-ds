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
const sani = require('../../utils/sanitizer');
const uuidv4 = require('uuid').v4;
const { newDate } = require('../../lib/dateJuggler');
const { addActivity } = require('../../main/models/model-activity');


function getDocs () {
  let docs = loadFile(path.join(__dirname, '../../data/docs.json'));
  return docs;
}

function getDocsObj (id) {
  let returnObj = {
    id: id,
    content: loadFile(path.join(__dirname, '../../data/docs', id+'.html'), false, true),
    timeStamp: newDate()
  }
  return returnObj;
}

function createDoc (fields, user) {
  let docs = getDocs();
  let newDocsObj = {
    id: uuidv4(),
    name: sani(fields.name),
    content: '<h1>'+sani(fields.name)+'</h1>',
    timeStamp: newDate()
  }
  docs.filter(item => item.id === fields.topicObjId)[0].docs.push(newDocsObj);
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
  saveFile(path.join(__dirname, '../../data/docs'), newDocsObj.id+'.html', newDocsObj.content, true);
  addActivity('created doc: "'+newDocsObj.name+'"', user.id, 'docs', newDocsObj.id);
  return newDocsObj;
}

function updateDoc (fields, user) {
  let docs = getDocs().filter(obj => obj.docs.filter(item => item.id === fields.id).length > 0)[0];
  let docName = docs.docs.filter(item => item.id === fields.id)[0].name;
  saveFile(path.join(__dirname, '../../data/docs'), fields.id+'.html', fields.content, true);
  addActivity('updated doc: "'+docName+'"', user.id, 'docs', fields.id);
}

function addNewTopic (fields, user) {
  let docs = getDocs();
  let newTopic = {
    id: uuidv4(),
    name: sani(fields.name),
    order: 1000,
    docs: []
  }
  docs.push(newTopic);
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
  addActivity('added new topic to docs: "'+newTopic.name+'"', user.id, 'docs', newTopic.id);
}


module.exports = { getDocsObj, updateDoc, getDocs, addNewTopic, createDoc };
