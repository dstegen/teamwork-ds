/*!
 * lib/file-delete.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const fs = require('fs');
const path = require('path');


function fileDelete (fields) {
	let filePathComplete = path.join(__dirname, '../', fields.filePath);
	let delfilename = fields.filePath.split('/').pop();
	if (fields.delfilename && fields.delfilename !== '') {
		filePathComplete = path.join(__dirname, '../data/classes', fields.filePath, fields.delfilename);
		delfilename = fields.delfilename;
	}
	if (fs.existsSync(filePathComplete)) {
		try {
			fs.unlinkSync(filePathComplete);
			console.log('- Deleted file: '+delfilename);
			return true;
		} catch (e) {
			console.log('- ERROR deleting file: ' + e);
			return false;
		}
  } else {
		console.log('- ERROR can\'t find file:'+delfilename);
  }
}


module.exports = fileDelete;
