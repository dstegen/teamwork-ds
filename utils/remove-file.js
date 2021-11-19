/*!
 * utils/remove-file.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');


function removeFile (filePath, fileName, backup=true) {
  const now = Date.parse(Date());
		try {
      if (backup === true) {
        // Check for backup directory or dreate it
        let backupPath = path.join(filePath, 'backup');
        if (!fs.existsSync(backupPath)) {
          fs.mkdirSync(backupPath);
        }
        // Do backup first
        if (fs.existsSync(path.join(filePath, fileName))) {
          if (process.versions['node'].split('.')[0] > 8) {
            fs.copyFileSync(path.join(filePath, fileName), path.join(backupPath, now+'_'+fileName));
          } else {
            const objOrig = require(path.join(filePath, fileName));
            fs.writeFileSync(path.join(backupPath, now+'_'+fileName), JSON.stringify(objOrig));
          }
        }
      }
			// Then delete the file
      fs.unlinkSync(path.join(filePath, fileName));
		} catch (e) {
			console.log('- ERROR removing file: '+e);
		}
}


module.exports = removeFile;
