/*!
 * main/search-controller.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { uniSend, getFormObj, SendObj } = require('webapputils-ds');
const { search } = require('./models/model-search');
const getNaviObj = require('../lib/getNaviObj');
const view = require('../main/views/base-view');
const searchView = require('./views/search-view');


function searchController (request, response, wss, wsport, user) {
  getFormObj(request).then(
    data => {
      uniSend(view(wsport, getNaviObj(user), searchView(search(data.fields.searchTerm), data.fields.searchTerm)), response);
    }
  ).catch(
    error => {
      console.log('ERROR in search: '+error.message);
      uniSend(new SendObj(302, [], '', '/'), response);
  });
}


module.exports = searchController;
