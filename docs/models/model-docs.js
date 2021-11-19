/*!
 * docs/models/model-docs.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const removeFile = require('../../utils/remove-file');
const sani = require('../../utils/sanitizer');
const uuidv4 = require('uuid').v4;
const { newDate } = require('../../lib/dateJuggler');
const { addActivity } = require('../../main/models/model-activity');
const sortItemsByDate = require('../../utils/sort-items-by-date');


function getDocs () {
  let docs = [
    {
      id: uuidv4(),
      order: 0,
      name: 'Home',
      docs: [
        {
          id: uuidv4(),
          position: 0,
          name: "Welcome to docs",
          timeStamp: newDate()
        }
      ]
    }
  ];
  if (fs.existsSync(path.join(__dirname, '../../data/docs.json'))) {
    docs = loadFile(path.join(__dirname, '../../data/docs.json'));
    for (let i=0; i<docs.length; i++) {
      docs[i].docs = docs[i].docs.sort((a,b) => sortItemsByDate(a,b,'position'));
    }
  } else {
    saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
  }
  return docs;
}

function getDocsObj (id) {
  let returnObj = {
    id: id,
    content: '<h1>Welcome to docs</h1>',
    timeStamp: newDate()
  }
  if (fs.existsSync(path.join(__dirname, '../../data/docs', id+'.html'))) {
    let docs = getDocs().filter(obj => obj.docs.filter(item => item.id === id).length > 0)[0];
    let timeStamp = docs.docs.filter(item => item.id === id)[0].timeStamp;
    returnObj = {
      id: id,
      content: loadFile(path.join(__dirname, '../../data/docs', id+'.html'), false, true),
      timeStamp: timeStamp
    }
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
    let myDocs = docs.filter(item => item.id === fields.topicObjId)[0]
    myDocObj = {
      id: uuidv4(),
      position: Math.max(...myDocs.docs.map( item => item.position)) + 1,
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
  if (docs.filter(item => item.id === fields.topicObjId).length > 0) {
    // Update
    docs.filter(item => item.id === fields.topicObjId)[0].name = sani(fields.name);
    addActivity('update docs topic: "'+sani(fields.name)+'"', user.id, 'docs', fields.topicObjId);
  } else {
    // Add
    let newTopic = {
      id: uuidv4(),
      name: sani(fields.name),
      order: Math.max(...docs.map( item => item.order)) + 1,
      docs: []
    }
    docs.push(newTopic);
    addActivity('added new topic to docs: "'+newTopic.name+'"', user.id, 'docs', newTopic.id);
  }
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
}

function deleteDocs (fields) {
  let docs = getDocs();
  if (fields.topicObjId === fields.id) {
    // Delete topic
    docs = docs.filter(item => item.id !== fields.id);
    // TODO: delete all files first
    console.log('- Deleted topic ID: '+fields.id);
  } else {
    // Delete doc
    docs.filter(item => item.id === fields.topicObjId)[0].docs = docs.filter(item => item.id === fields.topicObjId)[0].docs.filter(item => item.id !== fields.id);
    removeFile(path.join(__dirname, '../../data/docs'), fields.id+'.html');
    console.log('- Deleted doc ID: '+fields.id);
  }
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
}

function reorderDocs (fields) {
  let docs = getDocs();
  let myDocs = docs.filter(item => item.id === fields.topicObjId)[0];
  fields['newOrder[]'].forEach((id, i) => {
    myDocs.docs.filter(item => item.id === id)[0].position = i;
  });
  console.log('+ Changed order of '+myDocs.name);
  saveFile(path.join(__dirname, '../../data'),'docs.json', docs);
}


module.exports = { getDocsObj, updateDoc, getDocs, addNewTopic, createDoc, deleteDocs, reorderDocs };
