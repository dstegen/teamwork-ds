/*!
 * board/models/model-boards.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const fs = require('fs');
const path = require('path');
const fileUpload = require('../../lib/file-upload');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');


function getBoard (group) {
  let returnBoard = {};
  returnBoard = loadFile(path.join(__dirname, '../../data/projects', group, 'board.json'), false);
  if (returnBoard.topics !== undefined) {
    return reOrderBoard(returnBoard);
  } else {
    return {
      topics: [
        {
          id: 0,
          order: 0,
          topic: 'Info',
          color: 'bg-blue',
          autofill: false
        }
      ],
      cards: [
        {
          id: 0,
          topicId: 0,
          chapter: 'Start your board',
          details: 'Start adding content and lessons to your board!',
          link: ''
        }
      ]
    };
  }
}

function updateTopic (fields) {
  let tmpBoard = {};
  if (fs.existsSync(path.join(__dirname, '../../data/classes/', fields.group, 'board.json'))) tmpBoard = getBoard(fields.group);
  let newTopic = {};
  if (fields.id !== 'null' && tmpBoard.topics && tmpBoard.topics.filter( item => item.id === Number(fields.id) ).length === 1) {
    newTopic = tmpBoard.topics.filter( item => item.id === Number(fields.id) )[0];
  } else {
    newTopic.id = getNewId(tmpBoard.topics);
    newTopic.order = newTopic.id;
  }
  newTopic.topic = sani(fields.topic),
  newTopic.color = fields.color,
  newTopic.autofill = fields.autofill === 'on' ? true : false,
  newTopic.autofillWith = fields.with
  if (fields.id === 'null') {
    tmpBoard.topics.push(newTopic);
  }
  saveFile(path.join(__dirname, '../../data/classes', fields.group), 'board.json', tmpBoard);
  console.log('+ Updated/added group board topic successfully!');
}

function updateCard (fields, files) {
  let tmpBoard = getBoard(fields.group);
  let newCard = {};
  if (fields.id !== 'null' && tmpBoard.cards.filter( item => item.id === Number(fields.id) ).length === 1) {
    newCard = tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0];
  } else {
    newCard.id = getNewId(tmpBoard.cards);
  }
  newCard.topicId = Number(fields.topicId);
  newCard.chapter = sani(fields.chapter);
  newCard.details = sani(fields.details);
  if (fields.link.startsWith('http://') || fields.link.startsWith('https://')) newCard.link = sani(fields.link);
  if (files.filetoupload.name !== '') {
    if (newCard.files === undefined || newCard.files === '') newCard.files = [];
    if (fileUpload(fields, files, path.join('board', newCard.id.toString()))) {
      newCard.files.push(path.join('/data/classes', fields.group, 'board', newCard.id.toString(), files.filetoupload.name));
    }
  }
  if (fields.id === 'null') {
    tmpBoard.cards.push(newCard);
  }
  saveFile(path.join(__dirname, '../../data/classes', fields.group), 'board.json', tmpBoard);
  console.log('+ Updated/added group board card successfully!');
}

function deleteFromBoard (fields) {
  let tmpBoard = getBoard(fields.group);
  if (fields.section === 'topics') {
    tmpBoard.topics.splice(tmpBoard.topics.indexOf(tmpBoard.topics.filter( item => item.id === Number(fields.id) )[0]), 1);
    if (tmpBoard.cards.filter( item => item.topicId === Number(fields.id) ).length > 0) {
      tmpBoard.cards.filter( item => item.topicId === Number(fields.id) ).forEach( item => {
        tmpBoard.cards.splice(tmpBoard.cards.indexOf(item), 1);
      });
    }
    console.log('- Deleted topic successfully from group board!');
  } else if (fields.section === 'cards') {
    if (tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0].files && tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0].files.length > 0) {
      tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0].files.forEach( item => {
        try {
          fs.unlinkSync(path.join(__dirname, '../../', item));
        } catch (e) {
          console.log('- ERROR can\'t delete files from card: '+e);
        }
      });
    }
    tmpBoard.cards.splice(tmpBoard.cards.indexOf(tmpBoard.cards.filter( item => item.id === Number(fields.id) )[0]), 1);
    console.log('- Deleted card successfully from group board!');
  }
  saveFile(path.join(__dirname, '../../data/classes', fields.group), 'board.json', tmpBoard);
}

function deleteFileFromCard (fields) {
  let tmpBoard = getBoard(fields.group);
  let myFiles = tmpBoard.cards.filter( item => item.id === Number(fields.lessonId))[0].files;
  myFiles.splice(myFiles.indexOf('/data/classes/'+fields.group+'/board/'+fields.lessonId+'/'+fields.delfilename));
  tmpBoard.cards.filter( item => item.id === Number(fields.lessonId))[0].files = myFiles;
  saveFile(path.join(__dirname, '../../data/classes', fields.group), 'board.json', tmpBoard);
}

function updateOrder (fields) {
  let tmpBoard = getBoard(fields.group);
  if (fields['newOrder[]'].length > 0) {
    fields['newOrder[]'].forEach((id, i) => {
      tmpBoard.topics.filter( item => item.id === Number(id))[0].order = i;
    });
  }
  saveFile(path.join(__dirname, '../../data/classes', fields.group), 'board.json', tmpBoard);
  console.log('+ Changed order of board '+fields.group);
}


// Additional functions

function reOrderBoard (inBoard) {
  let tmpTopics = [];
  try {
    for (let i=0; i<inBoard.topics.length; i++) {
      if (inBoard.topics.filter( item => item.order === i)[0] !== undefined) {
        tmpTopics.push(inBoard.topics.filter( item => item.order === i)[0]);
      }
    }
    inBoard.topics = tmpTopics;
  } catch (e) {
    console.log('- ERROR re-ording topics: '+e);
  }
  return inBoard;
}

function getNewId (cards) {
  if (cards.length > 0) {
    return Math.max(...cards.map( item => item.id)) + 1;
  } else {
    return 100001;
  }
}


module.exports = { getBoard, updateCard, updateTopic, deleteFromBoard, deleteFileFromCard, updateOrder };
