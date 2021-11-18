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
  let docs = getDocs().filter(obj => obj.docs.filter(item => item.id === id).length > 0)[0];
  let timeStamp = docs.docs.filter(item => item.id === id)[0].timeStamp;
  let returnObj = {
    id: id,
    content: loadFile(path.join(__dirname, '../../data/docs', id+'.html'), false, true),
    timeStamp: timeStamp
  }
  return returnObj;
}

function createDoc (fields, user) {
  let docs = getDocs();
  let myDocObj = {};
  if (docs.filter(item => item.id === fields.topicObjId)[0].docs.filter(item => item.id === fields.id).length > 0) {
    // Update
    myDocObj = docs.filter(item => item.id === fields.topicObjId)[0].docs.filter(item => item.id === fields.id)[0];
    myDocObj.name = sani(fields.name);
    myDocObj.timeStamp = newDate();
    addActivity('updated doc name: "'+myDocObj.name+'"', user.id, 'docs', myDocObj.id);
  } else {
    // Add
    myDocObj = {
      id: uuidv4(),
      name: sani(fields.name),
      content: '<h1>'+sani(fields.name)+'</h1>',
      timeStamp: newDate()
    }
    docs.filter(item => item.id === fields.topicObjId)[0].docs.push(myDocObj);
    saveFile(path.join(__dirname, '../../data/docs'), myDocObj.id+'.html', myDocObj.content, true);
    addActivity('created doc: "'+myDocObj.name+'"', user.id, 'docs', myDocObj.id);
  }
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
  return myDocObj;
}

function updateDoc (fields, user) {
  let allDocs = getDocs();
  let docs = allDocs.filter(obj => obj.docs.filter(item => item.id === fields.id).length > 0)[0];
  let docName = docs.docs.filter(item => item.id === fields.id)[0].name;
  docs.docs.filter(item => item.id === fields.id)[0].timeStamp = newDate();
  saveFile(path.join(__dirname, '../../data/docs'), fields.id+'.html', fields.content, true);
  saveFile(path.join(__dirname, '../../data'),'docs.json', allDocs);
  addActivity('updated doc: "'+docName+'"', user.id, 'docs', fields.id);
}

function addNewTopic (fields, user) {
  let docs = getDocs();
  let newTopic = {
    id: uuidv4(),
    name: sani(fields.name),
    order: Math.max(...docs.map( item => item.order)) + 1,
    docs: []
  }
  docs.push(newTopic);
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
  addActivity('added new topic to docs: "'+newTopic.name+'"', user.id, 'docs', newTopic.id);
}


module.exports = { getDocsObj, updateDoc, getDocs, addNewTopic, createDoc };
