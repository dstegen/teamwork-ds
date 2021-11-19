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
const { getDocsObj, getDocs, updateDoc, addNewTopic, createDoc, deleteDocs, reorderDocs } = require('./models/model-docs');
const docsView = require('./views/docs-view');
const docsSettingsView = require('./views/docs-settings-view');


function docsController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  //console.log(route);
  let naviObj = getNaviObj(user);
  if (route.includes('update')) {
    getFormObj(request).then(
      data => {
        //console.log(data.fields);
        updateDoc(data.fields, user);
        uniSend(new SendObj(200, [], 'text/html; charset=UTF-8', '/', 'Ok'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update docs: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('docs/addtopic')) {
    getFormObj(request).then(
      data => {
        //console.log(data.fields);
        addNewTopic(data.fields, user);
        uniSend(new SendObj(302, [], '', '/docs'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t add topic: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('docs/create')) {
    getFormObj(request).then(
      data => {
        //console.log(data.fields);
        uniSend(new SendObj(302, [], '', '/docs/view/'+createDoc(data.fields, user).id), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t add doc: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else if (route.startsWith('docs/view')) {
    uniSend(view(wsport, naviObj, docsView(getDocsObj(route.split('/')[2]))), response);
  } else if (route === 'docs/settings') {
    uniSend(view(wsport, naviObj, docsSettingsView()), response);
  } else if (route.startsWith('docs/settings')) {
    getFormObj(request).then(
      data => {
        //console.log(data.fields);
        if (route === 'docs/settings/delete') {
          // Delete topic/doc
          deleteDocs(data.fields);
          uniSend(new SendObj(302, [], '', '/docs/settings'), response);
        } else if (route === 'docs/settings/sortdocs') {
          reorderDocs(data.fields);
          uniSend(new SendObj(200, [], 'text/plain', '/', 'ok'), response);
        } else {
          if (data.fields.topicObjId && data.fields.id) {
            if (data.fields.topicObjId === data.fields.id) {
              // Update topic
              addNewTopic(data.fields, user);
            } else {
              // Update docs title
              createDoc(data.fields, user);
            }
          }
          uniSend(new SendObj(302, [], '', '/docs/settings'), response);
        }
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update docs settings: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else {
    uniSend(view(wsport, naviObj, docsView(getDocsObj(getDocs()[0].docs[0].id))), response);
  }
}


module.exports = docsController;
