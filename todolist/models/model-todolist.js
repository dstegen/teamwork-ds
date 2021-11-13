/*!
 * todolist/models/model-todolist.js
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
const createDir = require('../../utils/create-dir');
const sani = require('../../utils/sanitizer');


function createTodolistObj (user) {
  let newTdListObj = {
    userId: user.id,
    lists: [
      { name: 'First list',
        listId: 1,
        items: [
          {
            item: 'Start your list',
            itemId: 1001,
            done: false
          }
        ]
      }
    ]
  };
  if (!fs.existsSync(path.join(__dirname, '../../data/users/todolists'))) createDir(path.join(__dirname, '../../data/users/todolists'));
  saveFile(path.join(__dirname, '../../data/users/todolists'), user.id+'.json', newTdListObj);
  return newTdListObj;
}

function getTodolistObj (user) {
  let tdListObj = loadFile(path.join(__dirname, '../../data/users/todolists', user.id+'.json'));
  if (tdListObj.lists) {
    return tdListObj;
  } else {
    return createTodolistObj(user);
  }
}

function addTodolist (fields, user) {
  let tdListObj = getTodolistObj(user);
  tdListObj.lists.push(
    {
      name: sani(fields.name),
      listId: Math.max(...tdListObj.lists.map( item => item.listId)) + 1,
      items: []
    }
  );
  saveFile(path.join(__dirname, '../../data/users/todolists'), user.id+'.json', tdListObj);
}

function updateTodolist (fields, user) {
  //console.log(fields);
  let tdListObj = getTodolistObj(user);
  tdListObj.lists.filter(item => item.listId === Number(fields.listId))[0].name = sani(fields.name);
  saveFile(path.join(__dirname, '../../data/users/todolists'), user.id+'.json', tdListObj);
}

function updateTodolistItem (fields, user) {
  //console.log(fields);
  let tdListObj = getTodolistObj(user);
  let curList = tdListObj.lists.filter(item => item.listId === Number(fields.listId))[0];
  if (curList.items.filter(item => item.itemId === Number(fields.itemId)).length > 0) {
    // update
    let curItem = curList.items.filter(item => item.itemId === Number(fields.itemId))[0];
    curItem.item = (fields.item && fields.item !== '') ? sani(fields.item) : curItem.item;
    curItem.done = (fields.done && fields.done == 'true') ? true : false;
  } else {
    // add item
    curList.items.push(
      {
        item: sani(fields.item),
        itemId: curList.items.length > 0 ? Math.max(...curList.items.map( item => item.itemId)) + 1 : 1001,
        done: false
      }
    );
  }
  saveFile(path.join(__dirname, '../../data/users/todolists'), user.id+'.json', tdListObj);
}

function deleteTdlElement (fields, user) {
  //console.log(fields);
  let tdListObj = getTodolistObj(user);
  if (fields.what === 'list') {
    tdListObj.lists = tdListObj.lists.filter(item => item.listId !== Number(fields.listId));
  } else if (fields.what === 'item') {
    let curList = tdListObj.lists.filter(item => item.listId === Number(fields.listId))[0];
    if (curList.items && curList.items.length > 0) {
      curList.items = curList.items.filter(item => item.itemId !== Number(fields.itemId));
    }
  }
  saveFile(path.join(__dirname, '../../data/users/todolists'), user.id+'.json', tdListObj);
}


module.exports = { getTodolistObj, addTodolist, updateTodolistItem, deleteTdlElement, updateTodolist };
