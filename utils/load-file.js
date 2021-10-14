/*!
 * utils/load-file.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');


function loadFile (filePath, reqMode=false, raw=false) {
  let returnObj = {};
  try {
    if (reqMode) {
      returnObj = require(filePath);
    } else if (raw) {
      returnObj = fs.readFileSync(filePath);
    } else {
      let tmpObj = fs.readFileSync(filePath);
      returnObj = JSON.parse(tmpObj);
    }
  } catch (e) {
    console.log('- ERROR reading file: '+e);
  }
  return returnObj;
}


module.exports = loadFile;
