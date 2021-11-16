/*!
 * docs/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const { getDocsObj, updateDoc } = require('./models/model-docs');
const docsView = require('./views/docs-view');
//const uuidv4 = require('uuid').v4;


function docsController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  //console.log(route);
  let naviObj = getNaviObj(user);
  if (route.includes('update')) {
    getFormObj(request).then(
      data => {
        console.log(data.fields);
        updateDoc(data.fields, user);
        uniSend(new SendObj(200, [], 'text/html; charset=UTF-8', '/', 'Ok'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update docs: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.includes('docs/load')) {
    uniSend(view(wsport, naviObj, docsView(getDocsObj(route.split('/')[2]))), response);
  } else {
    uniSend(view(wsport, naviObj, docsView(getDocsObj('93667ae6-50ed-4ddc-873f-4935f56422c8'))), response);
  }
}


module.exports = docsController;
