/*!
 * utils/save-file.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');


function saveFile (filePath, fileName, dataObj, raw=false) {
  const now = Date.parse(Date());
		try {
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
					if (raw) {
						const fileOrig = fs.readFileSync(path.join(filePath, fileName));
						fs.writeFileSync(path.join(backupPath, now+'_'+fileName), fileOrig);
					} else {
						const objOrig = require(path.join(filePath, fileName));
						fs.writeFileSync(path.join(backupPath, now+'_'+fileName), JSON.stringify(objOrig));
					}
				}
			}
			// Then save new version
			if (raw) {
				fs.writeFileSync(path.join(filePath, fileName), dataObj);
			} else {
				fs.writeFileSync(path.join(filePath, fileName), JSON.stringify(dataObj));
			}
		} catch (e) {
			console.log('- ERROR writing file: '+e);
		}
}


module.exports = saveFile;
