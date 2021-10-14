/*!
 * communication/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { updateChat } = require('./models/model-chat');
const { updatePrivateMessages } = require('./models/model-messages');
const comView = require('./views/view');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');


function communicationController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('communication/chat')) {
    updateChatAction(request, response, wss);
  } else if (route.startsWith('communication/message')) {
    updatePrivateMessagesAction(request, response, wss);
  } else {
    uniSend(view(wsport, naviObj, comView(user, wsport)), response);
  }
}


// Additional functions

function updateChatAction (request, response, wss) {
  getFormObj(request).then(
    data => {
      updateChat(data.fields);
      try {
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send('chatUpdate')
          }, 100);
        });
      } catch (e) {
        console.log('- ERROR while sending websocket message to all clients: '+e);
      }
      //uniSend(new SendObj(302, [], '', '/communication'), response);
      uniSend(new SendObj(200), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update chat: '+error.message);
      uniSend(new SendObj(302), response);
  });
}

function updatePrivateMessagesAction (request, response, wss) {
  getFormObj(request).then(
    data => {
      updatePrivateMessages(data.fields);
      try {
        wss.clients.forEach(client => {
          setTimeout(function () {
            client.send('chatUpdate')
          }, 100);
        });
      } catch (e) {
        console.log('- ERROR while sending websocket message to all clients: '+e);
      }
      uniSend(new SendObj(302, [], '', '/communication'), response);
    }
  ).catch(
    error => {
      console.log('ERROR can\'t update private messages: '+error.message);
      uniSend(new SendObj(302), response);
  });
}


module.exports = communicationController;
