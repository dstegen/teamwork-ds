/*!
 * project/models/model-project.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const path = require('path');
const loadFile = require('../../utils/load-file');
const saveFile = require('../../utils/save-file');
const sani = require('../../utils/sanitizer');


function getAllProjects () {
  let allProjects = loadFile(path.join(__dirname, '../../data/projects.json'));
  return allProjects;
}

function getProjectById (projectId) {
  return getAllProjects().filter(item => item.id === Number(projectId))[0];
}

module.exports = { getAllProjects, getProjectById };
