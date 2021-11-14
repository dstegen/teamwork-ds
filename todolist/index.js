/*!
 * todolist/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const todolistView = require('./views/todolist-view');
const { getTodolistObj, addTodolist, updateTodolistItem, deleteTdlElement, updateTodolist } = require('./models/model-todolist');


function todolistController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  if (route.startsWith('todolist/update')) {
    getFormObj(request).then(
      data => {
        if (data.fields.name) {
          updateTodolist(data.fields, user);
        } else {
          updateTodolistItem(data.fields, user);
        }
        uniSend(new SendObj(302, [], '', '/todolist/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update todolist: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('todolist/add')) {
    getFormObj(request).then(
      data => {
        addTodolist(data.fields, user);
        uniSend(new SendObj(302, [], '', '/todolist'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t add todolist: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('todolist/delete')) {
    getFormObj(request).then(
      data => {
        deleteTdlElement(data.fields, user);
        uniSend(new SendObj(302, [], '', '/todolist/'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t delete todolist element: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else {
    uniSend(view(wsport, getNaviObj(user), todolistView(getTodolistObj(user))), response);
  }
}


module.exports = todolistController;
