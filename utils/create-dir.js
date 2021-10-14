/*!
 * utils/create-dir.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');


function createDir (filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('* Creating directory: '+filePath);
    try {
      fs.mkdirSync(filePath);
    } catch (e) {
      console.log('- ERROR creating directory: '+e);
    }
  } else {
    console.log('- directory already exists: '+filePath);
  }
}


module.exports = createDir;
