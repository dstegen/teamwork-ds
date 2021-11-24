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
const { thisWeek } = require('../lib/dateJuggler');


function timetrackingController (request, response, wss, wsport, user) {
  let route = request.url.substr(1).split('?')[0];
  let naviObj = getNaviObj(user);
  if (route.startsWith('timetracking/update') || route.startsWith('timetracking/delete')) {
    let urlPath = request.headers.referer.split(request.headers.origin)[1];
    getFormObj(request).then(
      data => {
        console.log(data.fields);
        if (route === 'timetracking/delete') {
          deleteTimetracking(data.fields, user);
        } else {
          updateTimetracking(data.fields, user);
        }
        uniSend(new SendObj(302, [], '', urlPath), response);
      }
    ).catch(
      error => {
        console.log('ERROR can\'t update timetracking: '+error.message);
        uniSend(new SendObj(302, [], '', '/'), response);
    });
  } else {
    let curWeek = thisWeek();
    if (route.split('/')[1] !== undefined && (1 < Number(route.split('/')[1]) < 53)) curWeek = Number(route.split('/')[1]);
    uniSend(view(wsport, naviObj, timetrackingOverview(getAllTimetracking(user), user, curWeek)), response);
  }
}


module.exports = timetrackingController;
