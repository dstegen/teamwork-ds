/*!
 * timetracking/index.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const { getAllTimetracking, updateTimetracking, deleteTimetracking } = require('./models/model-timetracking');
const timetrackingOverview = require('./views/timetracking-overview');


function timetrackingController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('timetracking/update')) {
    let urlPath = request.headers.referer.split(request.headers.origin)[1];
    getFormObj(request).then(
      data => {
        console.log(data.fields);
        updateTimetracking(data.fields, user);
        uniSend(new SendObj(302, [], '', urlPath), response);
        //uniSend(new SendObj(200, [], 'text/plain', '/timetracking','ok'), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update timetracking: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else {
    uniSend(view(wsport, naviObj, timetrackingOverview(getAllTimetracking(user), user)), response);
  }
}


module.exports = timetrackingController;
