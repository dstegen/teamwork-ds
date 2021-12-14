/*!
 * lib/file-upload.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required Moduls
const fs = require('fs');
const path = require('path');


function fileUpload (fields, files, filePath, fileId='filetoupload') {
  console.log('+ Upload file: '+files[fileId].name);
  let oldpath = files[fileId].path;
  let newpath = path.join(__dirname, '../data/attachements', fields.id, filePath, files[fileId].name);
  if (filePath.includes('data/users/pics')) {
    newpath = filePath;
  } else {
    if (!fs.existsSync(path.join(__dirname, '../data/attachements', fields.id, filePath))) {
      fs.mkdirSync(path.join(__dirname, '../data/attachements', fields.id, filePath), { recursive: true });
    }
  }
  try {
    fs.renameSync(oldpath, newpath);
    fs.chmodSync(newpath, '0640');
    console.log('+ Saved successfully file: '+newpath);
    return true;
  } catch (e) {
    console.log('- ERROR file upload, saving+changing file: ' + e);
    return false;
  }
}


module.exports = fileUpload;
