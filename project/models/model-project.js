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
const createDir = require('../../utils/create-dir');
const sani = require('../../utils/sanitizer');


function getAllProjects () {
  let allProjects = loadFile(path.join(__dirname, '../../data/projects.json'));
  return allProjects;
}

function getProjectById (projectId) {
  return getAllProjects().filter(item => item.id === Number(projectId))[0];
}

function updateProject (fields) {
  fields.id = Number(fields.id);
  console.log(fields);
  let allProjects = getAllProjects();
  let myProject = {};
  if (allProjects.filter(item => item.id === fields.id).length > 0) {
    //update
    Object.keys(fields).forEach(key => {
      allProjects.filter(item => item.id === fields.id)[0][key] = sani(fields[key]);
    });
  } else {
    //add
    Object.keys(fields).forEach(key => {
      myProject[key] = sani(fields[key]);
    });
    console.log(myProject);
    allProjects.push(myProject);
    // create project subfolder & empty chat, if not exists
    createDir(path.join(__dirname, '../../data/projects', (myProject.id).toString()));
    saveFile(path.join(__dirname, '../../data/projects', (myProject.id).toString()), 'chat.json', []);
  }
  saveFile(path.join(__dirname, '../../data/'), 'projects.json', allProjects);
}


module.exports = { getAllProjects, getProjectById, updateProject };
