/*!
 * lib/websockets.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function registerWs (wss, key, userId) {
  try {
    wss.on('connection', function connection(ws) {
      ws.id = userId;
      ws.groupkey = key;
    });
  } catch (e) {
    console.log('- ERROR register websocket client: '+e);
  }
}

function sendWsMessage (wss, key='', message='') {
  try {
    wss.clients.forEach(client => {
      console.log(client.id);
      setTimeout(function () {
        if (key !== '' && client.id && client.id === key) {
          client.send(message);
        } else if (key !== '' && client.groupkey && client.groupkey === key) {
          client.send(message);
        } else if (key === '' || key === undefined) {
          client.send(message);
        }
      }, 50);
    });
  } catch (e) {
    console.log('- ERROR sending websocket message: '+e);
  }
}


module.exports = { registerWs, sendWsMessage };
