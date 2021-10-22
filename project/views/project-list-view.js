/*!
 * project/views/project-list-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllProjects } = require('../models/model-project');
const projectCard = require('../templates/project-card');


function projectListView () {
  let allProjects = getAllProjects();
  return `
    <div id="project-list-view" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Projects overview
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 gx-4 gy-1">
        <div class="col">
          ${allProjects.map(project => projectCard(project, true)).join('</div><div class="col">')}
        </div>
      </div>
    </div>
  `;
}


module.exports = projectListView;
